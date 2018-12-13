#! /bin/bash

cd "${PWD}/../ChromeHost"
cmake -DCMAKE_BUILD_TYPE=Release .
make
cd -
ROOT_FOLDER=${PWD}/ROOT/Library/Google/Chrome/NativeMessagingHosts
rm -v ${ROOT_FOLDER}/jabrachromehost ${ROOT_FOLDER}/libjabra.dylib
cp -a ../ChromeHost/bin/jabrachromehost ${ROOT_FOLDER}
cp -a ../ChromeHost/SDKmacOS/libjabra.dylib ${ROOT_FOLDER}
pkgbuild --root ROOT  --identifier com.jabra.chromehost --version 2.0 JabraChromeHost2.0.unsigned.pkg
productsign --sign "Developer ID Installer: GN Audio AS" JabraChromeHost0.5.unsigned.pkg JabraChromeHost0.5.pkg
hdiutil create -volname JabraChromeHost -srcfolder ./JabraChromeHost0.5.pkg -ov -format UDZO JabraChromeHost0.5.dmg
