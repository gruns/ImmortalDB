#!/usr/bin/env bash

# To test cross origin storage, execute this file and navigate to
#
#   http://127.0.0.1:9090/testing/safari-cross-origin-iframe/parent.html
#
# in your browser.

PROJECT_ROOT="../../"
cd "$PROJECT_ROOT"

python3 -m http.server 9090 &
python3 -m http.server 9091
