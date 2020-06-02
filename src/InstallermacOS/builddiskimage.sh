#! /bin/bash

# Create disk image (run after installer build + notarize).
cd "./src/InstallermacOS"
hdiutil create -volname JabraChromeHost -srcfolder ./JabraChromeHost2.0.2.pkg -ov -format UDZO JabraChromeHost2.0.2.dmg
