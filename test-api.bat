@echo off
REM Fitness Activity Tracker - API Test Script for Windows
REM Tests all CRUD operations

setlocal enabledelayedexpansion

set API_URL=http://localhost:8080/api/activities
set ACTIVITY_ID=

echo ================================
echo Fitness Activity Tracker API Tests
echo ================================
echo.

REM Test 1: Create Activity
echo Test 1: CREATE Activity
for /f "tokens=*" %%A in ('powershell -Command "
$response = Invoke-WebRequest -Uri '%API_URL%' -Method POST -ContentType 'application/json' -Body '{\"type\": \"RUNNING\", \"duration\": 30, \"caloriesBurned\": 300, \"startTime\": \"2024-04-07T09:00:00\"}' | ConvertTo-Json
$json = $response | ConvertFrom-Json
$json.id
"') do set ACTIVITY_ID=%%A

if "%ACTIVITY_ID%"=="" (
  echo [FAIL] Failed to create activity
  exit /b 1
) else (
  echo [SUCCESS] Activity created successfully
  echo Activity ID: %ACTIVITY_ID%
)

echo.

REM Test 2: Get All Activities
echo Test 2: GET All Activities
powershell -Command "Invoke-WebRequest -Uri '%API_URL%' -Method GET" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [SUCCESS] Retrieved all activities successfully
) else (
  echo [FAIL] Failed to retrieve activities
)

echo.

REM Test 3: Get Single Activity
echo Test 3: GET Single Activity
powershell -Command "Invoke-WebRequest -Uri '%API_URL%/%ACTIVITY_ID%' -Method GET" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [SUCCESS] Retrieved activity successfully
) else (
  echo [FAIL] Failed to retrieve single activity
)

echo.

REM Test 4: Update Activity
echo Test 4: UPDATE Activity
powershell -Command "Invoke-WebRequest -Uri '%API_URL%/%ACTIVITY_ID%' -Method PUT -ContentType 'application/json' -Body '{\"type\": \"RUNNING\", \"duration\": 45, \"caloriesBurned\": 450, \"startTime\": \"2024-04-07T09:00:00\"}'" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [SUCCESS] Activity updated successfully
) else (
  echo [FAIL] Failed to update activity
)

echo.

REM Test 5: Delete Activity
echo Test 5: DELETE Activity
powershell -Command "Invoke-WebRequest -Uri '%API_URL%/%ACTIVITY_ID%' -Method DELETE" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  echo [SUCCESS] Activity deleted successfully
) else (
  echo [FAIL] Failed to delete activity
)

echo.
echo ================================
echo All tests completed!
echo ================================

