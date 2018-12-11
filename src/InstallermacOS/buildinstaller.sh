#! /bin/bash

cd "${PWD}/../ChromeHost"
cmake -DCMAKE_BUILD_TYPE=Release .
make
cd -
rm -v ${PWD}/ROOT/Library/Google/Chrome/NativeMessagingHosts/jabrachromehost ${PWD}/ROOT/Library/Google/Chrome/NativeMessagingHosts/libjabra.dylib
cp -a ../ChromeHost/bin/jabrachromehost ./ROOT/Library/Google/Chrome/NativeMessagingHosts/
cp -a ../ChromeHost/SDKmacOS/libjabra.dylib ./ROOT/Library/Google/Chrome/NativeMessagingHosts
pkgbuild --root ROOT  --identifier com.jabra.chromehost --version 0.5 JabraChromeHost0.5.unsigned.pkg
productsign --sign "Developer ID Installer: GN Audio AS" JabraChromeHost0.5.unsigned.pkg JabraChromeHost0.5.pkg
hdiutil create -volname JabraChromeHost -srcfolder ./JabraChromeHost0.5.pkg -ov -format UDZO JabraChromeHost0.5.dmg
