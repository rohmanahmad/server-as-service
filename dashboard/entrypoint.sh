#!/bin/sh

set -xe
# : "${AJAX_BASE_API_URL?Need an api url}"
PREFIX_APP_PATH="${PREFIX_APP_PATH:=/}"
sed -i "s|PREFIX_APP_PATH|$PREFIX_APP_PATH|g" "/usr/share/nginx/html/js/main.js"
sed -i "s|AJAX_BASE_API_URL|$AJAX_BASE_API_URL|g" "/usr/share/nginx/html/js/main.js"
sed -i "s|IDLE_TIMEOUT_SECOND|$IDLE_TIMEOUT|g" "/usr/share/nginx/html/js/main.js"
sed -i "s|vendor.css|vendor.css?cache=$(date +%m%d%y%H%M%S)|g" "/usr/share/nginx/html/index.html"
sed -i "s|all.css|all.css?cache=$(date +%m%d%y%H%M%S)|g" "/usr/share/nginx/html/index.html"
sed -i "s|custom.css|custom.css?cache=$(date +%m%d%y%H%M%S)|g" "/usr/share/nginx/html/index.html"
sed -i "s|daterangepicker.css|daterangepicker.css?cache=$(date +%m%d%y%H%M%S)|g" "/usr/share/nginx/html/index.html"
sed -i "s|manifest.js|manifest.js?cache=$(date +%m%d%y%H%M%S)|g" "/usr/share/nginx/html/index.html"
sed -i "s|main.js|main.js?cache=$(date +%m%d%y%H%M%S)|g" "/usr/share/nginx/html/index.html"
sed -i "s|vendor.js|vendor.js?cache=$(date +%m%d%y%H%M%S)|g" "/usr/share/nginx/html/index.html"
cat /usr/share/nginx/html/js/main.js | grep dashboard

exec "$@"
