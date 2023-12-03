#!/bin/bash
set -euxo pipefail

cd /home/ubuntu/hatena-galaxy
git pull
bun install --production
PORT=80 bun run build
bun ./build/index.js
