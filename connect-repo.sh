#!/bin/bash
# Connect this folder to https://github.com/Dtaraczkozi/ai-build-day-test
# Run from the repo root: ./connect-repo.sh

set -e
cd "$(dirname "$0")"

git init
git remote add origin https://github.com/Dtaraczkozi/ai-build-day-test.git
git add README.md
git commit -m "Initial commit"
git branch -M main
git push -u origin main

echo "Done. Repo connected to https://github.com/Dtaraczkozi/ai-build-day-test"
