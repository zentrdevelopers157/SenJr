@echo off
curl.exe -L "https://mission-control-zentropques-projects.vercel.app/?x-vercel-protection-bypass=abc123accessSecret456" | findstr /i "GESTALT"
if %errorlevel% equ 0 (
    echo SUCCESS: GESTALT found in response.
) else (
    echo FAILURE: Content mismatch or access denied.
)
