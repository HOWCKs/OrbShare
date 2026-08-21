@rem Gradle startup script for Windows
@if "%DEBUG%" == "" @echo off
@rem Use system gradle if wrapper missing
if exist "gradle\wrapper\gradle-wrapper.jar" (
    java -jar gradle\wrapper\gradle-wrapper.jar %*
) else (
    gradle %*
)
