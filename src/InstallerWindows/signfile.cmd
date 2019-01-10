echo off
echo Code signing...
"C:\Program Files (x86)\Microsoft SDKs\ClickOnce\SignTool\signtool.exe" sign /f %1 /p %2 /d "Jabra Chrome Host" /du http://www.jabra.com /t http://timestamp.verisign.com/scripts/timstamp.dll %3
echo Done