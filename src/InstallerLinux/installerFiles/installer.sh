#!/bin/bash
DIR="/home/$USER/.config/google-chrome";
GC_DIR="./.config/google-chrome";
NMH_DIR="$GC_DIR/NativeMessagingHosts";
if [ -d "$DIR" ]; then
  echo "Installing files in ${DIR}";
  sed -i "s/##USER##/$USER/" "$NMH_DIR/com.jabra.nm.json";
  cp -r $NMH_DIR "$DIR/";
  sed -i "s/$USER/##USER##/" "$NMH_DIR/com.jabra.nm.json";
  echo "Jabrachromehost installed, please restart google-chrome";
else
  echo "Google-chrome not found, please install or start once.(Make sure ${DIR} exists)";
fi
