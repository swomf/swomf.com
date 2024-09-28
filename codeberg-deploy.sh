#!/usr/bin/env bash
set -euo pipefail

arrow_msg() {
  echo "$(tput setaf 2)$(tput bold) => $(tput sgr0)$(tput bold)${1}$(tput sgr0)"
}
current_commit=$(git log --pretty=format:'%H' -n 1)
pages_push_https="https://codeberg.org/swomf/pages.git"
pages_push_ssh="git@codeberg.org:swomf/pages.git"
pages_repo_dir=".codeberg-deploy.d"

usage() {
cat << EOF
Build and deploy an astro project to ${pages_push_https}

Usage: $0 [OPTIONS]

Options:
  -h, --help    show this help.
  -f, --force   force deploy to pages.
EOF
}

push_opts=()

while [[ $# -gt 0 ]]; do
  case $1 in
    -f|--force)
      push_opts+=("--force")
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown parameter passed: $1"
      exit 1
      ;;
  esac
done

arrow_msg "Building static directories"
pnpm build

if [[ -d "${pages_repo_dir}" && -d "${pages_repo_dir}/.git" ]]; then
  arrow_msg "Syncing ${pages_repo_dir} to origin/pages via reset"
  cd "${pages_repo_dir}"
  git fetch "${pages_push_https}"
  git reset origin/pages &> /dev/null
  cd ..
else
  arrow_msg "Syncing ${pages_repo_dir} to origin/pages via clone"
  rm -rf "${pages_repo_dir}"
  git clone --no-checkout "${pages_push_https}" "${pages_repo_dir}"
fi

arrow_msg "Copying ${pages_repo_dir}/.git to dist/"
rm -rf dist/.git
cp -R "${pages_repo_dir}/.git" dist/

arrow_msg "Committing ${current_commit}"
cd dist
git add --all
git commit -m "${current_commit}"

if [[ -n "${push_opts[*]}" ]]; then
  arrow_msg "Pushing with options: ${push_opts[*]}"
  git push "${pages_push_ssh}" "${push_opts[@]}"
else
  arrow_msg "Pushing"
  git push "${pages_push_ssh}"
fi