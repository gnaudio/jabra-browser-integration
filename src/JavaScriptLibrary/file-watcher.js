/* Simple file watcher for triggering automatic rebuilds in DevelopperSupport/test */

const fs = require('fs');
const { exec } = require('child_process');

console.log(`
Watching src-folder for file changes.
File change will queue a rebuild in /DeveloperSupportBeta/test/

Prerequisites:
* npm install with local reference in package.json of /DeveloperSupportBeta/test/: "@gnaudio/jabra-browser-integration": "file:../../JavaScriptLibrary"
* start test server with ./serve.bat from root/src
`);

let runs = false;

fs.watch('./src/', { recursive: true }, (event, filename) => {
    if (runs) {
        return;
    }

    runs = true;

    console.time("Build time");
    console.log(`files changed... trigger build in "/JavaScriptLibrary/src/"`);

    exec('npm run build:debug', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        console.log(`trigger build in "/DeveloperSupportBeta/test/"`);

        exec('npm run build', { cwd: '../DeveloperSupportBeta/test/' }, (error) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            runs = false;

            console.log('Build complete! Refresh test app to see changes.');
            console.log('https://127.0.0.1:8000/DeveloperSupportBeta/test/');            
            console.timeEnd("Build time");
        });  
    });  
});
