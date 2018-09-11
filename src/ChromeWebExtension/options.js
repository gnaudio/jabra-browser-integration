/*
Jabra Browser Integration
https://github.com/gnaudio/jabra-browser-integration

MIT License

Copyright (c) 2017 GN Audio A/S (Jabra)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict';

let configurationSection = document.getElementById('configuration');
let permissionSection = document.getElementById('permission');
let restartSection =  document.getElementById('restart');

function setupConfiguration() {
    var logLevelDropdown = document.getElementById('logLevel');
    chrome.storage.local.get('logLevel', (items) => {
        var logLevel = items.logLevel || 1;
        logLevelDropdown.value = logLevel;
    
        logLevelDropdown.addEventListener('change', () => {
            var value = logLevelDropdown.options[logLevelDropdown.selectedIndex].value;
            chrome.storage.local.set({logLevel: value}, () => {
                // Called when storage updated.
            });
        });
    });
}

chrome.permissions.contains({
    permissions: ['storage']
}, (allowed) => {
    if (allowed) {
        configurationSection.style.display = "block";
        permissionSection.style.display = "none";
        restartSection.style.display = "none";
        setupConfiguration();
    } else {
        configurationSection.style.display = "none";
        restartSection.style.display = "none";
        permissionSection.style.display = "block";

        console.info("User asked for permission to access storage");

        let askPermission = document.getElementById('askPermission');
        askPermission.onclick = () => {
            chrome.permissions.request({
                permissions: ['storage']
            }, function(granted) {
                if (granted) { // Permitted
                    configurationSection.style.display = "none";
                    restartSection.style.display = "block";                    
                    permissionSection.style.display = "none";
                    console.info("Access to storage granted");
                } else { // Not permitted:
                    // Do nothing - wait for the user to re-consider.
                    console.warn("Access to storage not granted");
                }
            });
        };
    }
});


