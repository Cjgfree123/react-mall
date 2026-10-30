#!/usr/bin/env bash
set -euo pipefail

ssh_target="${1:-}"
ssh_port="${2:-22}"
if [[ ! "$ssh_target" =~ ^[a-zA-Z0-9_][a-zA-Z0-9_.@:-]*$ ]] || [[ ! "$ssh_port" =~ ^[0-9]+$ ]]; then
  echo '用法：npm run deploy -- root@服务器IP [SSH端口]'
  exit 1
fi

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"
npm run build

bundle_dir="$(mktemp -d "${TMPDIR:-/tmp}/react-mall-deploy.XXXXXX")"
trap 'rm -rf "$bundle_dir"' EXIT
COPYFILE_DISABLE=1 tar -czf "$bundle_dir/bundle.tar.gz" dist Dockerfile nginx.conf scripts/deploy-server.sh

echo '正在通过 SSH 上传并部署到 11030 端口……'
# A single SSH connection transfers the archive and runs the deployment.
ssh -p "$ssh_port" "$ssh_target" '
  set -eu
  upload_dir=$(mktemp -d /tmp/react-mall-upload.XXXXXX)
  trap '\''rm -rf "$upload_dir"'\'' EXIT
  tar -xzf - -C "$upload_dir"
  bash "$upload_dir/scripts/deploy-server.sh" "$upload_dir"
' < "$bundle_dir/bundle.tar.gz"

echo "部署完成。浏览器打开：http://${ssh_target##*@}:11030"
echo '若服务器本机检查成功但外网打不开，请在云服务器安全组放行 TCP 11030。'
