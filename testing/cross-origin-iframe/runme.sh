#!/usr/bin/env bash

# To test cross origin storage, execute this file.

PROJECT_ROOT="../../"
cd "$PROJECT_ROOT"

python3 -m http.server 9090 &
pid=$!
python3 -m http.server 9091 &
python3 -m webbrowser \
    -t "http://127.0.0.1:9090/testing/cross-origin-iframe/parent.html" &

wait $pid
