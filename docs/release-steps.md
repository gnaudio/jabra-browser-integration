# Release Steps

To release the BrowserSDK, follow these steps carefully.

### 1. Update version number in ChromeHost/Meta.h and push to origin to trigger build

### 2. Build installers for MacOS and Windows 

Installers are build with [Azure DevOps](https://dev.azure.com/gnaudio/jabra-browser-integration), which will output downloadable installer-files for Windows and Mac in seperate pipelines.

**Windows:**

For Windows the installer is build using Visual Studio with the [Wix Toolset](https://wixtoolset.org/) extension. The pipeline will also sign the installer, so it is ready for installation.   

**Mac:**

The MacOS pipeline builds but doesn't notarizes. Follow these 4 steps on a Mac to get a complete installer:

1. run buildinstaller.sh (done by CI)
2. run notarize.sh -u \<username\> -p \<app-specific-password\> -f JabraChromeHostxxxx.pkg -b com.jabra.chromehost
3. run builddiskimage.sh
4. run notarize.sh -u \<username\> -p \<app-specific-password\> -f JabraChromeHostxxxx.dmg -b com.jabra.chromehost

*The app-specific-password can be obtained from appleid.apple.com*

*The dmg-file is build by builddiskimage.sh so don't look for it in the Azure drop*

### 3. Test installers for Windows and Mac

Delete existing ChromeHost and verify that the new installers work. On Mac you may have to uninstall by running the shell script  `src/InstallermacOS/uninstall.sh`

### 4. Move installers (.msi, .pkg, .dmg) to `/downloads`

### 5. Update version number in `src/JavaScriptLibrary/package.json` 

### 6. Update version number in `src/JavaScriptLibrary/src/core.ts` 

### 7a. Run `npm run build` in `src/JavaScriptLibrary` 

### 7b. Run `npm audit`

### 8. Publish to npm `npm publish --tag beta` 

### 9. Update `src/DeveloperSupportBeta/test/package.json` to use the npm-package just published

### 10. Run `npm i` and `npm run build` in `src/DeveloperSupportBeta/test`

### 11. Open the test-app locally. Press Init and CheckInstall, and verify that "Installation is ok" and version numbers look correct

### 12. Run `./copy_examples_to_doc_repo.bat` from repository root to copy new files to content repository at https://github.com/gnaudio/gnaudio.github.io

### 13. In gnaudio.github.io commit and push downloadable files for the release

### 14. Go back to jabra-browser-integration repository and update README.md and CHANGELOG.md

### 15. Update links to Native Chromehost so that the versions match the files just uploaded to gnaudio.github.io project. Remember to verify that links work.

### 16. Prod release only: Rename `DeveloperSupportRelease` to `DeveloperSupportLegacy_<version>` and `DeveloperSupportBeta` to `DeveloperSupportRelease`

### 17. Prod release only: in rare cases the Chrome Extension needs to be [updated in the Chrome Web Store](https://developer.chrome.com/webstore/publish). Consult the Jabra certificate manager about getting access   