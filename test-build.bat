@echo off
echo Running TypeScript type check...
call npm run typecheck
if %errorlevel% neq 0 (
    echo TypeScript check failed!
    exit /b 1
)
echo TypeScript check passed!
