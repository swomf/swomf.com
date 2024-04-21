#!/usr/bin/env bash
set -eo pipefail

arrow_msg() {
    echo "$(tput setaf 2)$(tput bold) => $(tput sgr0)$(tput bold)${1}$(tput sgr0)"
}
current_commit=$(git log --pretty=format:'%H' -n 1)

arrow_msg "Building static directories"
pnpm build

arrow_msg "Making TEMPDIR"
some_dir=$(mktemp -d)
arrow_msg "Cloning to TEMPDIR"
git clone --no-checkout https://codeberg.org/swomf/pages ${some_dir}
if [ -d "dist" ]; then
  arrow_msg "Removing dist/.git to replace with TEMPDIR/.git"
  rm -rf dist/.git
fi
arrow_msg "Moving TEMPDIR/.git to dist/"
mv ${some_dir}/.git dist/


arrow_msg "Committing ${current_commit}"
cd dist
git add --all
git commit -m "${current_commit}"
git push