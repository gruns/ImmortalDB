#!/usr/bin/env bash

# To test cross origin storage, execute this file.
#
# To test HTTPS, create development certs with
#
#   openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout self-signed-dev-key.pem -out self-signed-dev-cert.pem
#
# and run an HTTP server, like http-server, that supports HTTPS.

PROJECT_ROOT="../../"
cd "$PROJECT_ROOT"

#python3 -m http.server 9090 &
http-server -p 9090 -S -C self-signed-dev-cert.pem -K self-signed-dev-key.pem &
pid=$!
#python3 -m http.server 9091 &
http-server -p 9091 -S -C self-signed-dev-cert.pem -K self-signed-dev-key.pem &

python3 -m webbrowser \
    -t "http://127.0.0.1:9090/playground/iframes/same-origin.html" &
python3 -m webbrowser \
    -t "http://127.0.0.1:9090/playground/iframes/cross-origin.html" &

wait $pid
