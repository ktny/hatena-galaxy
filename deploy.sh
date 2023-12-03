#!/bin/bash
set -euxo pipefail

cd /home/ubuntu/hatena-galaxy
git pull
bun install --production
bun run build
