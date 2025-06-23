#!/bin/bash
# Run Lighthouse CI audit on localhost:3000

echo "Starting Lighthouse CI audit..."
npx lhci autorun --config=./tests/lighthouse/lighthouserc.json