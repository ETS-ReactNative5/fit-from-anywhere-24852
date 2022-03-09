#!/bin/sh

rm -rf dist/ && 
npx webpack --mode=production --config webpack.config.js && 
cp -r dist/* backend/web_build/ && 
mv backend/web_build/ffa.bundle.js backend/web_build/static/ && 
sed -i '' 's/ffa.bundle.js/static\/ffa.bundle.js/' backend/web_build/index.html