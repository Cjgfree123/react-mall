#!/usr/bin/env bash
set -euo pipefail

bundle_dir="${1:?缺少部署包目录}"
app_dir=/opt/react-mall
container_name=react-mall-11030

if [[ "$(id -u)" != 0 ]]; then
  echo '请使用 root 用户部署。'
  exit 1
fi
if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  echo '服务器没有可用的 Docker。请安装并启动 Docker 后重新执行同一条部署命令。'
  exit 1
fi
if docker container inspect "$container_name" >/dev/null 2>&1; then
  owner="$(docker inspect -f '{{ index .Config.Labels "app" }}' "$container_name")"
  if [[ "$owner" != react-mall ]]; then
    echo "已有非本项目管理的容器 $container_name，已停止部署。"
    exit 1
  fi
elif command -v ss >/dev/null 2>&1 && ss -H -ltn 'sport = :11030' | grep -q .; then
  echo '11030 已被其他服务占用，请先确认占用程序。'
  exit 1
fi

test -s "$bundle_dir/dist/index.html"
mkdir -p "$app_dir/releases"
release_dir="$(mktemp -d "$app_dir/releases/release.XXXXXX")"
cp -R "$bundle_dir/dist" "$release_dir/dist"
cp "$bundle_dir/Dockerfile" "$bundle_dir/nginx.conf" "$release_dir/"
image_tag="react-mall:$(basename "$release_dir" | tr '[:upper:]' '[:lower:]')"

# Build and validate before stopping the existing application.
docker build -t "$image_tag" "$release_dir"
old_image="$(docker inspect -f '{{.Image}}' "$container_name" 2>/dev/null || true)"
docker rm -f "$container_name" >/dev/null 2>&1 || true
if ! docker run -d --name "$container_name" --label app=react-mall --restart unless-stopped -p 11030:80 "$image_tag"; then
  docker rm -f "$container_name" >/dev/null 2>&1 || true
  if [[ -n "$old_image" ]]; then
    docker run -d --name "$container_name" --label app=react-mall --restart unless-stopped -p 11030:80 "$old_image"
  fi
  exit 1
fi

healthy=false
for attempt in 1 2 3 4 5; do
  if docker exec "$container_name" wget -q -O /dev/null http://127.0.0.1/; then
    healthy=true
    break
  fi
  sleep 1
done
if [[ "$healthy" != true ]]; then
  docker logs --tail 30 "$container_name"
  docker rm -f "$container_name" >/dev/null
  if [[ -n "$old_image" ]]; then
    docker run -d --name "$container_name" --label app=react-mall --restart unless-stopped -p 11030:80 "$old_image"
  fi
  echo '页面访问检查失败；如果有旧版本，已尝试恢复。'
  exit 1
fi
if command -v curl >/dev/null 2>&1; then
  curl --noproxy '*' -fsSI http://127.0.0.1:11030/
fi
echo '服务器页面访问检查通过：11030。'
