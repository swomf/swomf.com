#!/usr/bin/env bash
set -eo pipefail

rm -rf dist
git clone https://codeberg.org/swomf/pages dist
rm -rf dist/*
pnpm build
cd dist
git add --all
git commit -m "$(git log --pretty=format:'%H' -n 1)"
git push