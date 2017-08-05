#!/bin/bash

VERSION=`echo ${TRAVIS_TAG} | tr -d 'v'`

if [ ! -e "../dist/WhatsApp-linux-x64.tar.gz" ]; then
	echo "Linux file missing - please build for linux first"
	exit 1
fi

rm -rf aur-repo

NEWSUM=`sha256sum ../dist/WhatsApp-linux-x64.tar.gz | cut -f 1 -d " "`
git config --global user.name "Travis-CI"
git config --global user.email "build@travis-ci.org"
git clone https://aur.archlinux.org/whatsapp-desktop.git aur-repo

pushd aur-repo
OLDSUM=`cat PKGBUILD | grep sha256sums -A 1 | tail -n 1 | tr -d "' "`
sed -i 's/^pkgver=.*$/pkgver=${VERSION}/' PKGBUILD
sed -i "s/${OLDSUM}/${NEWSUM}/" PKGBUILD

sed -i 's/pkgver = .*$/pkgver = ${VERSION}/' .SRCINFO
sed -i "s/${OLDSUM}/${NEWSUM}/" .SRCINFO

git commit -a -m "Version ${VERSION}"
git push
popd
