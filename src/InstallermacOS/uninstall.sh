#!/bin/bash

echo "Attempting to uninstall a previous jabrachromehost pkg install. Not officially supported. Use at your own risk!"

if (( $EUID != 0 )); then
    echo "Failure. This script needs to be run with sudo rights"
    exit
fi

searchFiles=("com.jabra.nm.json" "jabrachromehost" "libjabra.dylib")
installFiles=$(pkgutil --only-files --files com.jabra.chromehost)

for fPath in ${installFiles[@]}; do
    f="$(basename "$fPath")"
    absFPath='/'${fPath}

    if [[ ${searchFiles[@]} =~ $f ]]; then
        rm -v -i $absFPath
    fi
done

pkgutil -v --forget com.jabra.chromehost


