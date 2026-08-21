#!/usr/bin/env sh
#
# Gradle start up script for UN*X
#
# This is a minimal wrapper that delegates to system gradle if wrapper jar is missing
# For CI we use gradle/actions/setup-gradle which provides gradle binary

# Try to find gradle
if [ -f "gradle/wrapper/gradle-wrapper.jar" ]; then
    exec java -jar gradle/wrapper/gradle-wrapper.jar "$@"
else
    # Fallback to system gradle
    if command -v gradle >/dev/null 2>&1; then
        exec gradle "$@"
    else
        echo "Gradle not found and wrapper jar missing. Please install gradle."
        exit 1
    fi
fi
