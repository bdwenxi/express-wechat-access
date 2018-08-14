npm version patch
tsc
node scripts/prettier.js

cp package.json dist/
cp README.md dist/
cp README.en.md dist/
cp LICENSE dist/
npm publish dist
