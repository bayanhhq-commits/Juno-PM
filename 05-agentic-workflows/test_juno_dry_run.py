import copy
import unittest
from pathlib import Path

from run_juno_dry_run import (
    ValidationError,
    load_json,
    run_fixture,
    simulate_reversibility,
    validate_spec,
)


HERE = Path(__file__).resolve().parent


class JunoDryRunTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.spec = load_json(HERE / "Juno Agent.json")
        cls.fixture = load_json(HERE / "fixtures" / "juno-dry-run.json")

    def test_current_spec_structure(self):
        result = validate_spec(self.spec)
        self.assertEqual(result["node_count"], 16)
        self.assertEqual(result["edge_count"], 24)
        self.assertTrue(all(result["checks"].values()))

    def test_quality_mode_expected_outcomes(self):
        result = run_fixture(self.spec, self.fixture)
        by_id = {item["id"]: item for item in result["results"]}
        self.assertEqual(result["analysis_mode"], "Quality Mode")
        self.assertEqual(by_id["OPP-001"]["status"], "P1")
        self.assertEqual(by_id["OPP-002"]["status"], "Insufficient Evidence")
        self.assertEqual(by_id["OPP-003"]["status"], "Insufficient Evidence")

    def test_approval_gate_defaults_closed(self):
        pending = run_fixture(self.spec, self.fixture)
        approved = run_fixture(self.spec, self.fixture, approve=True)
        self.assertEqual(pending["approval_status"], "pending_pm_approval")
        self.assertFalse(pending["export_allowed"])
        self.assertEqual(approved["approval_status"], "approved_by_cli_user")
        self.assertTrue(approved["export_allowed"])

    def test_strategy_mode_p1_requires_strategy_citation(self):
        fixture = copy.deepcopy(self.fixture)
        fixture["workspace"]["strategyDocument"] = "S-001"
        result = run_fixture(self.spec, fixture)
        by_id = {item["id"]: item for item in result["results"]}
        self.assertEqual(result["analysis_mode"], "Strategy Mode")
        self.assertEqual(by_id["OPP-001"]["status"], "Insufficient Evidence")
        self.assertIn(
            "P0-P1 requires a strategy citation", by_id["OPP-001"]["gate_reasons"]
        )

        fixture["candidates"][0]["strategy_citation"] = "S-001#problem-workflow"
        result = run_fixture(self.spec, fixture)
        by_id = {item["id"]: item for item in result["results"]}
        self.assertEqual(by_id["OPP-001"]["status"], "P1")

    def test_reversibility_simulation(self):
        checks = simulate_reversibility(self.spec)
        self.assertTrue(all(checks.values()), checks)

    def test_broken_edge_fails_closed(self):
        broken = copy.deepcopy(self.spec)
        broken["data"]["nodes"] = [
            node for node in broken["data"]["nodes"] if node["id"] != "approval-gate"
        ]
        with self.assertRaises(ValidationError):
            validate_spec(broken)


if __name__ == "__main__":
    unittest.main()
