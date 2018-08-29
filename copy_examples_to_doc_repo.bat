REM This helper copies examples and downloads to the documentation repo

COPY src\JavaScriptLibrary\*.js ..\gnaudio.github.io\jabra-browser-integration\JavaScriptLibrary\ /v
COPY src\JavaScriptLibrary\*.d.ts ..\gnaudio.github.io\jabra-browser-integration\JavaScriptLibrary\ /v
COPY downloads\*.* ..\gnaudio.github.io\jabra-browser-integration\download\ /v

XCOPY src\DeveloperSupportRelease ..\gnaudio.github.io\jabra-browser-integration\release /S /i /y /v
XCOPY src\DeveloperSupportBeta ..\gnaudio.github.io\jabra-browser-integration\beta /S /i /y /v
