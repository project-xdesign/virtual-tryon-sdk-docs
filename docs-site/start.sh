#!/bin/bash
# Stop script on any build error
set -e

echo "Building Next.js application..."
npm run build

echo "Deploying to Firebase Hosting..."
# Use npx to execute firebase command without requiring global installation
npx firebase deploy --only hosting:smd-docs