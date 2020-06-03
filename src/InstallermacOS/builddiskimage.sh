#! /bin/bash

# Create disk image (run after installer build + notarize).
cd "./src/InstallermacOS"
hdiutil create -volname JabraChromeHost -srcfolder ./JabraChromeHost2.1.0.pkg -ov -format UDZO JabraChromeHost2.1.0.dmg
