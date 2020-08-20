#!/usr/bin/env bash

# To test cross origin storage, execute this file.
#
# To test HTTPS, create development certs with
#
#   openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
#
# and run an HTTP server, like http-server, that supports HTTPS.

PROJECT_ROOT="../../"
cd "$PROJECT_ROOT"

python3 -m http.server 9090 &
#http-server -p 9090 -S &
pid=$!
python3 -m http.server 9091 &
#http-server -p 9091 -S &

python3 -m webbrowser \
    -t "http://127.0.0.1:9090/testing/iframes/parent.html" &

wait $pid
