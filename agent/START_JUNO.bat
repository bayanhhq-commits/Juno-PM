@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Juno needs Node.js 20 or newer.
  echo Install Node.js, then double-click START_JUNO.bat again.
  echo https://nodejs.org/en/download
  pause
  exit /b 1
)

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:4173'"
echo Starting Juno Agent locally...
echo Keep this window open while you use Juno.
echo Close it or press Ctrl+C to stop Juno.
node server.mjs

if errorlevel 1 (
  echo.
  echo Juno stopped with an error. Copy the message above if you need help.
  pause
)
