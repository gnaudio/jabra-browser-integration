#! /bin/bash

cd "${PWD}/../ChromeHost"
cmake -DCMAKE_BUILD_TYPE=Release .
make
cd -
ROOT_FOLDER=${PWD}/ROOT/Library/Google/Chrome/NativeMessagingHosts
rm -v ${ROOT_FOLDER}/jabrachromehost ${ROOT_FOLDER}/libjabra.dylib
cp -a ../ChromeHost/bin/jabrachromehost ${ROOT_FOLDER}
cp -a ../ChromeHost/SDKmacOS/libjabra.dylib ${ROOT_FOLDER}
#Uncomment to sign the application. Provide a valid signing certificate.
#codesign --sign "Developer ID Application: GN Audio AS" ${ROOT_FOLDER}/jabrachromehost
pkgbuild --root "ROOT" --scripts ./scripts --identifier com.jabra.chromehost --version 2.0 JabraChromeHost2.0.unsigned.pkg
#Uncomment to sign the package and create dmg file. Provide a valid signing certificate.
#productsign --sign "Developer ID Installer: GN Audio AS" JabraChromeHost2.0.unsigned.pkg JabraChromeHost2.0.pkg
#hdiutil create -volname JabraChromeHost -srcfolder ./JabraChromeHost2.0.pkg -ov -format UDZO JabraChromeHost2.0.dmg
