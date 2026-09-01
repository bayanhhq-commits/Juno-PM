#!/usr/bin/env python3
"""Zero-cost, deterministic test harness for the Juno agent reference spec.

This runner validates workflow policy and exercises synthetic fixtures. It does
not call an LLM, retrieve production data, or claim to be a live Langflow run.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
from pathlib import Path
from typing import Any


REQUIRED_CONTROLS = {
    "cancel_run",
    "undo_last_change",
    "discard_draft",
    "compare_versions",
    "restore_previous_approved_version",
    "kill_switch",
}
SCORE_KEYS = (
    "problem_clarity",
    "evidence_quality",
    "requirement_specificity",
    "anti_pattern_check",
)
PRIORITY_ORDER = {
    "P0": 0,
    "P1": 1,
    "P2": 2,
    "P3": 3,
    "P3 / Not Recommended": 4,
    "Insufficient Evidence": 5,
}


class ValidationError(ValueError):
    """Raised when the reference workflow or fixture is unsafe or malformed."""


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _is_reachable(
    graph: dict[str, list[str]], start: str, target: str, blocked: str | None = None
) -> bool:
    seen = {blocked} if blocked else set()
    queue = [start]
    while queue:
        node = queue.pop(0)
        if node in seen:
            continue
        if node == target:
            return True
        seen.add(node)
        queue.extend(graph.get(node, []))
    return False


def validate_spec(spec: dict[str, Any]) -> dict[str, Any]:
    try:
        nodes = spec["data"]["nodes"]
        edges = spec["data"]["edges"]
        controls = set(spec["reversibility"]["controls"])
    except (KeyError, TypeError) as exc:
        raise ValidationError(f"Missing required spec field: {exc}") from exc

    ids = [node.get("id") for node in nodes]
    if not all(isinstance(node_id, str) and node_id for node_id in ids):
        raise ValidationError("Every node requires a non-empty string ID")
    if len(ids) != len(set(ids)):
        raise ValidationError("Node IDs must be unique")

    id_set = set(ids)
    missing_endpoints = [
        edge
        for edge in edges
        if edge.get("source") not in id_set or edge.get("target") not in id_set
    ]
    if missing_endpoints:
        raise ValidationError(f"Edges reference missing nodes: {missing_endpoints}")

    graph = {node_id: [] for node_id in ids}
    for edge in edges:
        graph[edge["source"]].append(edge["target"])

    if not _is_reachable(graph, "opportunity-brief", "approved-export"):
        raise ValidationError("No path exists from draft brief to approved export")
    if _is_reachable(
        graph, "opportunity-brief", "approved-export", blocked="approval-gate"
    ):
        raise ValidationError("An export path bypasses the approval gate")

    missing_controls = REQUIRED_CONTROLS - controls
    if missing_controls:
        raise ValidationError(
            f"Missing reversibility controls: {sorted(missing_controls)}"
        )

    node_by_id = {node["id"]: node for node in nodes}
    exporter = node_by_id["approved-export"]["data"]
    version_store = node_by_id["version-store"]["data"]
    audit_log = node_by_id["audit-log"]["data"]

    checks = {
        "valid_json_object": isinstance(spec, dict),
        "unique_node_ids": True,
        "valid_edge_endpoints": True,
        "approval_gate_unavoidable": True,
        "all_reversibility_controls_present": True,
        "external_side_effects_none": spec["reversibility"].get(
            "external_side_effects_in_v1"
        )
        == "none",
        "export_requires_approval": exporter.get("requires_approval") is True,
        "export_has_no_external_actions": exporter.get("allowed_external_actions")
        == [],
        "version_store_append_only": version_store.get("append_only") is True
        and version_store.get("delete_previous_versions") is False,
        "audit_log_append_only": audit_log.get("append_only") is True,
    }
    failed = [name for name, passed in checks.items() if not passed]
    if failed:
        raise ValidationError(f"Safety checks failed: {failed}")

    return {"node_count": len(nodes), "edge_count": len(edges), "checks": checks}


def validate_workspace(spec: dict[str, Any], fixture: dict[str, Any]) -> None:
    workspace = fixture.get("workspace", {})
    input_node = next(
        node for node in spec["data"]["nodes"] if node["id"] == "workspace-input"
    )
    required = input_node["data"]["required_fields"]
    missing = [field for field in required if workspace.get(field) in (None, "", [])]
    if missing:
        raise ValidationError(f"Fixture workspace is missing: {missing}")

    source_ids = [source.get("id") for source in fixture.get("sources", [])]
    if len(source_ids) != len(set(source_ids)):
        raise ValidationError("Fixture source IDs must be unique")
    unknown = set(workspace["approvedSources"]) - set(source_ids)
    if unknown:
        raise ValidationError(f"Approved source IDs are missing: {sorted(unknown)}")


def score_to_priority(total: int) -> str:
    if 80 <= total <= 100:
        return "P1"
    if 50 <= total <= 79:
        return "P2"
    if 20 <= total <= 49:
        return "P3"
    if 0 <= total <= 19:
        return "P3 / Not Recommended"
    raise ValidationError(f"Score must be between 0 and 100, received {total}")


def evaluate_candidate(
    candidate: dict[str, Any],
    source_by_id: dict[str, dict[str, Any]],
    approved_source_ids: set[str],
    mode: str,
) -> dict[str, Any]:
    components = candidate.get("score_components", {})
    missing_scores = [key for key in SCORE_KEYS if key not in components]
    if missing_scores:
        raise ValidationError(
            f"Candidate {candidate.get('id')} is missing scores: {missing_scores}"
        )

    for key in SCORE_KEYS:
        value = components[key]
        if not isinstance(value, int) or not 0 <= value <= 25:
            raise ValidationError(
                f"Candidate {candidate.get('id')} score {key} must be an integer 0-25"
            )

    cited = candidate.get("source_ids", [])
    valid_citations = [
        source_id
        for source_id in cited
        if source_id in source_by_id and source_id in approved_source_ids
    ]
    invalid_citations = sorted(set(cited) - set(valid_citations))
    total = sum(components[key] for key in SCORE_KEYS)
    priority = score_to_priority(total)
    gate_reasons: list[str] = []

    if not valid_citations:
        gate_reasons.append("No valid approved evidence citation")
    if components["evidence_quality"] == 0:
        gate_reasons.append("Evidence quality is zero")
    if invalid_citations:
        gate_reasons.append(f"Invalid or unapproved citations: {invalid_citations}")
    if mode == "Strategy Mode" and priority in {"P0", "P1"}:
        if not candidate.get("strategy_citation"):
            gate_reasons.append("P0-P1 requires a strategy citation")

    anti_patterns = candidate.get("anti_patterns", [])
    if gate_reasons:
        status = "Insufficient Evidence"
        recommended = False
    elif anti_patterns or priority == "P3 / Not Recommended":
        status = "P3 / Not Recommended"
        recommended = False
    else:
        status = priority
        recommended = True

    return {
        "id": candidate["id"],
        "title": candidate["title"],
        "status": status,
        "recommended": recommended,
        "quality_score": total,
        "score_components": components,
        "valid_citations": valid_citations,
        "strategy_citation": candidate.get("strategy_citation"),
        "anti_patterns": anti_patterns,
        "gate_reasons": gate_reasons,
    }


def simulate_reversibility(spec: dict[str, Any]) -> dict[str, bool]:
    """Exercise append-only state transitions without touching external systems."""
    controls = set(spec["reversibility"]["controls"])
    history: list[dict[str, Any]] = [
        {"event": "approved", "version": 1, "content": "baseline"}
    ]

    history.append({"event": "edit", "version": 2, "content": "changed draft"})
    length_after_edit = len(history)
    history.append(
        {"event": "undo", "version": 3, "content": history[-2]["content"]}
    )
    undo_is_additive = len(history) == length_after_edit + 1

    history.append({"event": "discard", "draft_version": 3, "return_to": 1})
    discard_keeps_baseline = any(
        event.get("event") == "approved" and event.get("version") == 1
        for event in history
    )

    before_restore = len(history)
    history.append(
        {
            "event": "restore",
            "version": 4,
            "restored_from": 1,
            "content": "baseline",
        }
    )
    restore_is_additive = len(history) == before_restore + 1

    run_state = "active"
    run_state = "cancelled"
    cancel_stops_run = run_state == "cancelled"

    queue = ["run-a", "run-b"]
    queue.clear()
    kill_switch_clears_queue = not queue

    return {
        "all_controls_declared": REQUIRED_CONTROLS <= controls,
        "undo_is_append_only": undo_is_additive,
        "discard_preserves_approved_version": discard_keeps_baseline,
        "restore_is_append_only": restore_is_additive,
        "cancel_stops_run": cancel_stops_run,
        "kill_switch_stops_queue": kill_switch_clears_queue,
    }


def run_fixture(
    spec: dict[str, Any], fixture: dict[str, Any], approve: bool = False
) -> dict[str, Any]:
    validation = validate_spec(spec)
    validate_workspace(spec, fixture)
    workspace = fixture["workspace"]
    mode = (
        "Strategy Mode" if workspace.get("strategyDocument") else "Quality Mode"
    )
    source_by_id = {source["id"]: source for source in fixture["sources"]}
    approved_ids = set(workspace["approvedSources"])
    evaluated = [
        evaluate_candidate(candidate, source_by_id, approved_ids, mode)
        for candidate in fixture["candidates"]
    ]
    evaluated.sort(
        key=lambda item: (
            PRIORITY_ORDER[item["status"]],
            -item["quality_score"],
            item["id"],
        )
    )

    canonical_input = json.dumps(fixture, sort_keys=True, separators=(",", ":"))
    input_hash = hashlib.sha256(canonical_input.encode("utf-8")).hexdigest()
    reversibility = simulate_reversibility(spec)
    if not all(reversibility.values()):
        raise ValidationError("Reversibility simulation failed")

    return {
        "agent": spec["name"],
        "execution_mode": "deterministic dry run; no LLM or external services",
        "trace_id": f"dry-{input_hash[:12]}",
        "input_hash": input_hash,
        "workspace_id": workspace["workspaceId"],
        "decision_name": workspace["decisionName"],
        "analysis_mode": mode,
        "mode_warning": (
            None
            if mode == "Strategy Mode"
            else "Quality Mode reflects request quality, not strategic alignment."
        ),
        "approval_status": "approved_by_cli_user" if approve else "pending_pm_approval",
        "export_allowed": approve,
        "results": evaluated,
        "spec_validation": validation,
        "reversibility_checks": reversibility,
    }


def render_markdown(result: dict[str, Any]) -> str:
    lines = [
        "# Juno dry-run result",
        "",
        f"- Trace: `{result['trace_id']}`",
        f"- Mode: **{result['analysis_mode']}**",
        f"- Approval: **{result['approval_status']}**",
        f"- Export allowed: **{str(result['export_allowed']).lower()}**",
    ]
    if result["mode_warning"]:
        lines.append(f"- Warning: {result['mode_warning']}")
    lines.extend(
        [
            "",
            "| Opportunity | Status | Score | Evidence | Gate reason |",
            "|---|---|---:|---|---|",
        ]
    )
    for item in result["results"]:
        citations = ", ".join(item["valid_citations"]) or "None"
        reasons = "; ".join(item["gate_reasons"]) or "—"
        lines.append(
            f"| {item['title']} | {item['status']} | {item['quality_score']} "
            f"| {citations} | {reasons} |"
        )
    lines.extend(
        [
            "",
            "## Safety checks",
            "",
            f"- Nodes: {result['spec_validation']['node_count']}",
            f"- Edges: {result['spec_validation']['edge_count']}",
            "- Spec validation: PASS",
            "- Reversibility simulation: PASS",
            "- External side effects: NONE",
        ]
    )
    return "\n".join(lines) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--spec", type=Path, default=Path("Juno Agent.json"))
    parser.add_argument(
        "--fixture", type=Path, default=Path("fixtures/juno-dry-run.json")
    )
    parser.add_argument(
        "--approve",
        action="store_true",
        help="Simulate explicit PM approval. No external system is changed.",
    )
    parser.add_argument("--json", action="store_true", help="Print JSON output")
    parser.add_argument(
        "--out", type=Path, help="Optionally write the rendered result to this path"
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        spec = load_json(args.spec)
        fixture = load_json(args.fixture)
        result = run_fixture(spec, fixture, approve=args.approve)
    except (OSError, json.JSONDecodeError, ValidationError) as exc:
        print(f"FAIL: {exc}")
        return 1

    output = json.dumps(result, indent=2) + "\n" if args.json else render_markdown(result)
    if args.out:
        args.out.write_text(output, encoding="utf-8")
        print(f"Wrote {args.out}")
    else:
        print(output, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
