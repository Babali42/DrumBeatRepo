#!/bin/bash
set -e

sudo apt-get update
sudo apt-get install -y chromium --no-install-recommends

echo "Chromium installed: $(chromium --version)"