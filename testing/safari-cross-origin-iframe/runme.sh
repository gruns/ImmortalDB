#!/usr/bin/env bash

PROJECT_ROOT="../../"
cd "$PROJECT_ROOT"

python3 -m http.server 9090 &
python3 -m http.server 9091
