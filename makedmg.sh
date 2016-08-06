#!/bin/bash -x

PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
DEST="./dist/WhatsApp-$PACKAGE_VERSION.dmg"

[ -f "$DEST" ] && rm "$DEST"
[ $(node -p "require('appdmg/package.json').version") != "0.4.5" ] && npm install -g appdmg
appdmg ./dmg.json "$DEST"
