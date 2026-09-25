@echo off
title Celestial Observer Simulation
echo ======================================================================
echo    Celestial Observer: Globe vs Flat Earth Simulation
echo ======================================================================
echo.
echo Starting local simulation server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Launching simulation in your default web browser...
    start "" http://localhost:8080
    echo [OK] Server running on http://localhost:8080
    echo.
    echo Leave this window open while using the simulation.
    echo To close the simulation, close your browser and close this window.
    echo.
    python -m http.server 8080 --directory build\web
    goto end
)

REM Fallback if Python is not installed: Check for Flutter
flutter --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python not found. Launching via Flutter...
    flutter run -d chrome
    goto end
)

echo [!] Neither Python nor Flutter was detected on your system.
echo Please read README.md for easy 2-minute setup instructions!
echo.
pause

:end
