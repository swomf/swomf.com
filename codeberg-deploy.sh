#!/usr/bin/env bash
set -eo pipefail

arrow_msg() {
  echo "$(tput setaf 2)$(tput bold) => $(tput sgr0)$(tput bold)${1}$(tput sgr0)"
}
current_commit=$(git log --pretty=format:'%H' -n 1)
pages_push_location="https://codeberg.org/swomf/pages"
pages_repo_dir=".codeberg-deploy.d"

arrow_msg "Building static directories"
pnpm build

if [[ -d "${pages_repo_dir}" && -d "${pages_repo_dir}/.git" ]]; then
  arrow_msg "Syncing ${pages_repo_dir} to origin/pages via reset"
  cd ${pages_repo_dir}
  git reset origin/pages &> /dev/null
  cd ..
else
  arrow_msg "Syncing ${pages_repo_dir} to origin/pages via clone"
  rm -rf ${pages_repo_dir}
  git clone --no-checkout ${pages_push_location} ${pages_repo_dir}
fi

arrow_msg "Copying ${pages_repo_dir}/.git to dist/"
rm -rf dist/.git
cp -R ${pages_repo_dir}/.git dist/

arrow_msg "Committing ${current_commit}"
cd dist
git add --all
git commit -m "${current_commit}"
git push