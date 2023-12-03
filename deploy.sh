#!/bin/bash
set -euxo pipefail

cd /home/ubuntu/hatena-galaxy
git pull
bun run build
