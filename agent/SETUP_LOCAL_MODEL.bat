@echo off
setlocal
cd /d "%~dp0"

where ollama >nul 2>&1
if errorlevel 1 (
  echo Ollama is not installed yet.
  echo Download the Windows installer from: https://ollama.com/download/windows
  echo After installation, run this file again.
  pause
  exit /b 1
)

echo Installed local models:
ollama list
echo.
choice /M "Download the llama3.2 starter model now"
if errorlevel 2 exit /b 0
ollama pull llama3.2
echo.
echo Local model setup is complete. Open START_JUNO.bat to use it.
pause
