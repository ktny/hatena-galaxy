#!/bin/bash
set -euxo pipefail

cd /home/ubuntu/hatena-galaxy
git pull
npm i
PORT=80 npm run build
node ./build/index.js
