#!/usr/bin/env bash
set -e

# Create data directory for LMDB
mkdir -p ./data

# Clone the original course‑creator repo (if not already present)
if [ ! -d "repo" ]; then
  echo "Cloning course‑creator repo…"
  git clone https://github.com/twilson63/course-creator.git repo
else
  echo "Repo already present – pulling latest…"
  (cd repo && git pull)
fi

# Install and build the original CLI (needed for HTML generation)
cd repo
npm install
./node_modules/.bin/tsc
cd ..

echo "Setup complete. You can now run 'npm run dev' to start the PoC server."
