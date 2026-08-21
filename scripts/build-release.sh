#!/bin/bash
set -e
cd "$(dirname "$0")/../app"
npm install
npx expo prebuild --clean --platform android
cd android
./gradlew assembleRelease
