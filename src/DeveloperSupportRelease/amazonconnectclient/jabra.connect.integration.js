/// <reference path="../../JavaScriptLibrary/jabra.browser.integration-2.0.d.ts" />
/// <reference path="./amazon-connect-v1.x.d.ts" />

// Setup references to all HTML elements
const amazonParent = document.getElementById('amazonParent');
const configurationParent = document.getElementById('configurationParent');
const configureGo = document.getElementById('configureGo');
const urlText = document.getElementById('urlText');
const configureForm = document.getElementById('configureForm');
const error = document.getElementById('error');

const addOnBody = document.getElementById('addOnBody');
const addOnHeaderText = document.getElementById('addOnHeaderText');

const boomArmStatusText = document.getElementById('boomArmStatusText');
const noiseBar = document.getElementById('noiseBar');
const noiseKnown = document.getElementById('NoiseKnown');
const noiseUnknown = document.getElementById('NoiseUnknown');

const exposureBar = document.getElementById('exposureBar');
const exposureKnown = document.getElementById('ExposureKnown');
const exposureUnknown = document.getElementById('ExposureUnknown');

const boomArmKnown = document.getElementById('boomArmKnown');
const boomArmUnknown = document.getElementById('boomArmUnknown');

const noteHeadsetSelectionProblem = document.getElementById('noteHeadsetSelectionProblem');
const noteBoomArmProblem = document.getElementById('noteBoomArmProblem');
const noteNoiseProblem = document.getElementById('noteNoiseProblem');

const noiseChartContext = document.getElementById("noiseChart").getContext('2d');
const exposureChartContext = document.getElementById("exposureChart").getContext('2d');

const overviewChartContext = document.getElementById("overviewChart").getContext('2d');

const headSetSelectedContent = document.getElementById("headSetSelected");
const boomArmContent = document.getElementById("boomArm");
const exposureContent = document.getElementById("exposure");
const backgroundNoiseContent = document.getElementById("backgroundNoise");
const callOverviewContent = document.getElementById("callOverview");

const expandHeadSetSelected = document.getElementById('expandHeadSetSelected');
const collapseHeadSetSelected = document.getElementById('collapseHeadSetSelected');

const expandBoomArm = document.getElementById('expandBoomArm');
const collapseBoomArm = document.getElementById('collapseBoomArm');

const expandBackgroundNoise = document.getElementById('expandBackgroundNoise');
const collapseBackgroundNoise = document.getElementById('collapseBackgroundNoise');

const expandExposureNoise = document.getElementById('expandExposureNoise');
const collapseExposureNoise = document.getElementById('collapseExposureNoise');

const expandCallOverview = document.getElementById('expandCallOverview');
const collapseCallOverview = document.getElementById('collapseCallOverview');

const agentTalkingOff = document.getElementById('agentTalkingOff');
const agentTalkingOn = document.getElementById('agentTalkingOn');
const agentTalkingLabel = document.getElementById('agentTalkingLabel');

const contactTalkingOff = document.getElementById('contactTalkingOff');
const contactTalkingOn = document.getElementById('contactTalkingOn');
const contactLabel = document.getElementById('contactLabel');

const crossTalkOff = document.getElementById('crossTalkOff');
const crossTalkOn = document.getElementById('crossTalkOn');
const crossTalkLabel = document.getElementById('crossTalkLabel');

const silenceOff = document.getElementById('silenceOff');
const silenceOn = document.getElementById('silenceOn');
const silenceLabel = document.getElementById('silenceLabel');

const maxQueueSize = 1000;
const silenceMinDurationMs = 1000;
const cloudReportIntervalMs = 5000;
const silenceUpdateIntervalMs = 1000;

// The run method contains the actual demo.
function run(cppAccountUrl, quickPhoneNumber, elasticsearchHost, softphoneEnable) {
    /** @type {jabra.InstallInfo} */
    let installInfo = undefined;

    /** @type {connect.Contact} */
    let activeContact = undefined;

    /** @type {connect.Agent} */
    let activeAgent = undefined;

    /** @type {jabra.DeviceInfo} */
    let activeDevice = undefined;

    let lastNoiseDate = undefined;
    let lastExposureDate = undefined;
    
    let txSpeech = undefined;
    let rxSpeech = undefined;
    let crossTalk = undefined;
    let silence = undefined;

    let lastTxSpeechOrStart = undefined;
    let lastRxSpeechOrStart = undefined;

    let txSpeechStart = undefined;
    let rxSpeechStart = undefined;
    let crossTalkStart = undefined;
    let silenceStart = undefined;

    let currentTxSpeechTime = 0;
    let currentRxSpeechTime = 0;
    let currentCrossTalkTime = 0;
    let currentSilenceTime = 0;

    let txSpeechTotal = 0;
    let rxSpeechTotal = 0;
    let crossTalkTotal = 0;
    let silenceTotal = 0;

    let boomArmEventsReceived = false;
    let timesBoomArmMisaligned = 0;
    let boomArmLastStatus = undefined;

    let muteDuringCallCount = 0;
    let muteStatus = false;

    let volUpDownAdjustDuringCallCount = 0;

    let callConnectedTime = undefined;
    let callEndedTime = undefined;

    let inCall = undefined;

    /** @type {BoundedQueue */
    let audioExposureQueue =  new BoundedQueue(maxQueueSize);
    
    /** @type {BoundedQueue */
    let backgroundNoiseQueue = new BoundedQueue(maxQueueSize);

    // Last time for live report.
    let lastReportLiveToElasticSearchCloud = undefined;

    let lastCrossTalkReportTime = 0;
    let lastTxSpeechReportTime = 0;
    let lastRxSpeechReportTime = 0;
    let lastSilenceReportTime = 0;
    
    // Checks if active device reports analytics data back:
    function deviceHasLogging(device) {
        return device && device.deviceFeatures && device.deviceFeatures.includes(jabra.DeviceFeature.Logging);
    }

    // Checks if active device allow button take over / lighting etc.:
    function deviceHasMMIv2(device) {
        return device && device.deviceFeatures && device.deviceFeatures.includes(jabra.DeviceFeature.RemoteMMIv2);
    }

    // Utility to calulate time weighted average for exposure or backround noise
    // from list of {db, ts} entries and a terminating time for last entry.
    // Optionally data before a giving time can be thrown away.
    function weightedTimeAvg(dbTimestamps, endTimeStamp, sinceTimeStamp = undefined) {
        if (dbTimestamps.length > 0) {
            // Filer out unwanted elements and convert to time duration array:
            let dbTimedList = dbTimestamps.filter((currentValue) => !sinceTimeStamp || currentValue.ts>sinceTimeStamp).map( (currentValue, index, array) => {
                let nextTimeStamp = index+1<array.length ? array[index+1].ts : endTimeStamp;
                let delta = nextTimeStamp-currentValue.ts;
                if (delta<0) {
                    throw new Exception("timestamps not increasing / endTime wrong.")
                }
                return {
                    db: currentValue.db,
                    delta: delta
                };
            });

            // Tempoary fix: return last value if filtered list becomes empty due to sinceTimeStamp.
            //               which can happen if there were no events since last call.
            // TODO: Need a better way to do this that is also more in line with method description.
            if (dbTimedList.length == 0) {
                let lastElement = dbTimestamps[dbTimestamps.length -1];
                dbTimedList = [{
                    db: lastElement.db,
                    delta: endTimeStamp-lastElement.ts
                }];
            }

            // Calculate average seperately for dividend and divisor parts:
            let dividendAndDivisor = dbTimedList.reduce( (acc, currValue) => {
                return {
                    sum: acc.sum + currValue.db * currValue.delta,
                    time: acc.time + currValue.delta
                }
            }, {
                sum: 0.0,
                time: 0.0
            });

            // Return result
            return dividendAndDivisor.time !== 0.0 ? dividendAndDivisor.sum / dividendAndDivisor.time : 0;
        } else {
            return undefined;
        }
    }

    function showError(msg) {
      error.style.display = "inline";
      error.innerHTML = msg;
    }

    function setupExpandCollapse(sectionElement, expandElement, collapseElement) {
        expandElement.onclick = () => {
            sectionElement.style.display = "block";
            expandElement.style.display = "none";
            collapseElement.style.display = "";
        }

        collapseElement.onclick = () => {
            sectionElement.style.display = "none";
            collapseElement.style.display = "none";
            expandElement.style.display = "";
        }
    }

    setupExpandCollapse(headSetSelectedContent, expandHeadSetSelected, collapseHeadSetSelected);
    setupExpandCollapse(boomArmContent, expandBoomArm, collapseBoomArm);
    setupExpandCollapse(backgroundNoiseContent, expandBackgroundNoise, collapseBackgroundNoise);
    setupExpandCollapse(exposureContent, expandExposureNoise, collapseExposureNoise);
    setupExpandCollapse(callOverviewContent, expandCallOverview, collapseCallOverview);

    // Reporting to elastic search backend (can be Amazon hosted or not):
    let es_client = undefined;
    
    if (elasticsearchHost) {
        es_client = new elasticsearch.Client({
            host: elasticsearchHost,
            log: 'trace',
            apiVersion: '6.3'
        });
    }
 
    // Reports data to ElasticSearch. Live data records are send seperately with different
    // document/IDs for different reports, historic data records are merged (using same fixed ID).
    function reportLiveToElasticSearchCloud(live) {
        if (es_client && activeContact) { // Report only if enabled and contact is active
            let timeThisReport = new Date();
            let loggingDevice = deviceHasLogging(activeDevice);

            let deviceInfo = activeDevice ? {
                'deviceName': activeDevice.deviceName,
                'firmwareVersion': activeDevice.firmwareVersion,
                'serialNumber': activeDevice.serialNumber,
                'skypeCertified': activeDevice.skypeCertified,
                'productID': activeDevice.productID,
                'variant': activeDevice.variant
            } : undefined;

            let environment = installInfo && navigator ? {
                'versionChromehost': installInfo.version_chromehost,
                'versionNativeSDK': installInfo.version_nativesdk,
                'version_browserextension' : installInfo.version_browserextension,
                'version_jsapi' : installInfo.version_jsapi,
                'platform' : navigator.platform,
                'userAgent': navigator.userAgent
            } : undefined;

            let callInfo = undefined;
            if (activeAgent) {
                callInfo = {
                    'agentName': activeAgent.getName(),
                    'agentUserName': activeAgent.getConfiguration().username,
                    'contactPhoneNumber' : activeContact.getInitialConnection().getEndpoint().phoneNumber
                };

                callInfo["currentTime"] = timeThisReport.toISOString();
                
                if (callConnectedTime)
                {
                    callInfo["connectedTime"] = callConnectedTime.toISOString();
                }

                if (callEndedTime)
                {
                    callInfo["endedTime"] = callEndedTime.toISOString();
                }
            }

            const crossTalkReportTime = crossTalkTotal+currentCrossTalkTime;
            const txSpeechReportTime = txSpeechTotal+currentTxSpeechTime;
            const rxSpeechReportTime = rxSpeechTotal+currentRxSpeechTime;
            const silenceReportTime = silenceTotal+currentSilenceTime;

            let analytics = undefined;    
            if (loggingDevice && (crossTalkReportTime || txSpeechReportTime || rxSpeechReportTime || silenceReportTime)) {
                const total = crossTalkReportTime + txSpeechReportTime + rxSpeechReportTime + silenceReportTime;

                analytics = {
                    'txSpeechTotal': txSpeechReportTime,
                    'rxSpeechTotal': rxSpeechReportTime,
                    'crossTalkTotal': crossTalkReportTime,
                    'silenceTotal': silenceReportTime,

                    'txSpeechTotalPct' : (100.0 * txSpeechReportTime) / total,
                    'rxSpeechTotalPct' : (100.0 * rxSpeechReportTime) / total,
                    'crossTalkTotalPct' : (100.0 * crossTalkReportTime) / total,
                    'silenceTotalPct' : (100.0 * silenceReportTime) / total,
                };

                if (live) {
                    const txSpeechIntervalTime = txSpeechReportTime - lastTxSpeechReportTime;
                    const rxSpeechIntervalTime = rxSpeechReportTime - lastRxSpeechReportTime;
                    const crossTalkIntervalTime = crossTalkReportTime - lastCrossTalkReportTime;
                    const silenceIntervalTime = silenceReportTime - lastSilenceReportTime;

                    const intervalTotal = txSpeechIntervalTime + rxSpeechIntervalTime + crossTalkIntervalTime + silenceIntervalTime;
                 
                    analytics['txSpeechNow'] = txSpeechIntervalTime;
                    analytics['rxSpeechNow'] = rxSpeechIntervalTime;
                    analytics['crossTalkNow'] =crossTalkIntervalTime;
                    analytics['silenceNow'] = silenceIntervalTime;

                    analytics['txSpeechNowPct'] = (100.0 * txSpeechIntervalTime) / intervalTotal;
                    analytics['rxSpeechNowPct'] = (100.0 * rxSpeechIntervalTime) / intervalTotal;
                    analytics['crossTalkNowPct'] = (100.0 * crossTalkIntervalTime) / intervalTotal;
                    analytics['silenceNowPct'] = (100.0 * silenceIntervalTime) / intervalTotal;
                }

            }      
           
            // Dynamic status information:
            let status = undefined;
            {
                status = {
                    'muted' : muteStatus,
                    'muteCount': muteDuringCallCount
                }

                if (loggingDevice) {
                    status['boomArm'] = {};
                    status['volUpDownCount'] = volUpDownAdjustDuringCallCount;
                    status['audioExposureAvg'] = weightedTimeAvg(audioExposureQueue, timeThisReport.getTime());
                    status['backgroundNoiseAvg'] = weightedTimeAvg(backgroundNoiseQueue, timeThisReport.getTime());

                    if (live) {
                        status['audioExposureNow'] = weightedTimeAvg(audioExposureQueue, timeThisReport.getTime(), lastReportLiveToElasticSearchCloud ? lastReportLiveToElasticSearchCloud.getTime() : undefined);
                        status['backgroundNoiseNow'] = weightedTimeAvg(backgroundNoiseQueue, timeThisReport.getTime(), lastReportLiveToElasticSearchCloud ? lastReportLiveToElasticSearchCloud.getTime() : undefined);
                    }
    
                }

                let boomArmStatus = boomArmEventsReceived ? {
                    'lastPositioned' : boomArmLastStatus,
                    'timesMisaligned' : timesBoomArmMisaligned
                } : undefined;

                if (boomArmStatus) {
                    status['boomArm'] = boomArmStatus;
                }
            }

            const contactId = activeContact.getContactId();

            // Setup request structure (No id provided so it will be auto-generated):
            let json = {
                index: live ? 'jabralive' : 'jabrahistoric',
                type: 'jabraConnect', // Use our own type.
                body: {}
            };

            // For historic data, everything is stored under the same id (only one record).
            if (!live) {
                json['id'] = contactId;
            }

            // Add contact ID using same key/pos as connect stream index to allow interop if needed.
            json.body["ContactId"] =contactId;

            // Optionally add sections as data becomes available:
            if (deviceInfo) {
                json.body["deviceInfo"] = deviceInfo;
            }

            if (environment) {
                json.body["environment"] = environment;
            }

            if (callInfo) {
                json.body["callInfo"] = callInfo;
            }

            if (analytics) {
                json.body["analytics"] = analytics;
            }

            if (status) {
                json.body["status"] = status;
            }

            es_client.index(json).then((response) => {
                lastReportLiveToElasticSearchCloud = timeThisReport;

                lastTxSpeechReportTime = txSpeechReportTime;
                lastRxSpeechReportTime = rxSpeechReportTime;
                lastCrossTalkReportTime = crossTalkReportTime;
                lastSilenceReportTime = silenceReportTime;            

                console.log("Sucessfully send " + (live ? "live" : "historic") + " data " + JSON.stringify(json) + " to ES");
            }).catch((err) => {
                console.error("Error " + err + " trying to send " + JSON.stringify(json) + " to ES");
                showError("Failed reporting status to ElasticSearch");
            });
        }
    }

    // Jabra library init with full installation check, focus setup and diagnostics of common problems:
    jabra.init().then(() => jabra.getInstallInfo()).then((_installInfo) => {
        console.log("Jabra library initialized");
        installInfo = _installInfo;
        if (_installInfo.installationOk) {
          return Promise.resolve();
        } else {
          return Promise.reject(new Error("Browseer SDK Installation incomplete. Please (re)install"));
        }
    }).then(() => {
        console.log("Jabra Installation check succeded");
        // Try to get current device and set focus, ignoring focus errors since device might not support all feature 
        // and might not have been attached yet.
        return setupDevice().catch(() => {});
    }).catch((err) => {
        if (err.name === "CommandError" && err.errmessage === "Unknown cmd" && err.command === "getinstallinfo" ) {
            showError("Your browser SDK installation is incomplete, out of date or corrupted. Please (re)install");
        } else if (err.name === "NotFoundError") {
            showError("Jabra input device not accessible/found");
        } else {
            showError(err.name + ": " + err.message);
        }
    });

    function setupDevice() {
        return jabra.getActiveDevice().then((device) => {
            activeDevice = device;
            if (device && device.deviceName) {
                addOnHeaderText.innerText = device.deviceName ? device.deviceName : "";
                if (deviceHasMMIv2(activeDevice)) {
                    jabra.setMmiFocus(jabra.RemoteMmiType.MMI_TYPE_DOT3, true).then( () => {
                        return jabra.setMmiFocus(jabra.RemoteMmiType.MMI_TYPE_DOT4, true);
                    });
                }
                if (deviceHasLogging(activeDevice)) {
                    addOnBody.style.opacity = "1.0";
                    addOnBody.style.pointerEvents = "auto";
                } else {
                    addOnBody.style.opacity = "0.5";
                    addOnBody.style.pointerEvents = "none";
                }
            }
        }).catch( () => {
            console.log("Error during device setup");
        });
    }

    jabra.addEventListener("device attached", (event) => {
        // Try to get current device and set focus, ignoring focus errors since device might not support all features.
        setupDevice().catch(() => {});
    });

    jabra.addEventListener("mute", (event) => {
        activeAgent.mute();
    });

    jabra.addEventListener("unmute", (event) => {
        activeAgent.unmute();
    });

    jabra.addEventListener("acceptcall", (event) => {
        activeContact.accept();
    });

    jabra.addEventListener("endcall", (event) => {
        activeContact.getInitialConnection().destroy();
    });

    jabra.addEventListener("mmi", (event) => {
        if (event.data.type === jabra.RemoteMmiType.MMI_TYPE_DOT3 && event.data.action === jabra.RemoteMmiActionInput.MMI_ACTION_UP) {
            const currentState = activeAgent.getState().type;

            let newState;
            if (currentState === connect.AgentStateType.ROUTABLE) {
                newState = activeAgent.getAgentStates().filter(function(state) {
                    return state.type === connect.AgentStateType.OFFLINE;
                })[0];
            } else if (currentState === connect.AgentStateType.OFFLINE || currentState === "system") {
                newState = activeAgent.getAgentStates().filter(function(state) {
                    return state.type === connect.AgentStateType.ROUTABLE;
                })[0];
            } else newState = null;

            if (newState) {
                activeAgent.setState(newState,
                {
                    success: () => {},
                    failure: (jsonErr) => { 
                        console.error ("Failed setting state: " + JSON.stringify(jsonErr));
                    }
                });
            }
        } else if (event.data.type === jabra.RemoteMmiType.MMI_TYPE_DOT4 && event.data.action === jabra.RemoteMmiActionInput.MMI_ACTION_UP && quickPhoneNumber) {
            let state = activeAgent.getState().type;
            if (state === connect.AgentStateType.ROUTABLE) {
                var endpoint = connect.Endpoint.byPhoneNumber(quickPhoneNumber);
                activeAgent.connect(endpoint, {
                    success: () => {
                        if (deviceHasMMIv2(activeDevice)) {
                            jabra.setRemoteMmiLightAction(jabra.RemoteMmiType.MMI_TYPE_DOT4, 0x0000ff, jabra.RemoteMmiSequence.MMI_LED_SEQUENCE_ON);
                        }
                    },
                    failure: (jsonErr) => {
                        console.error ("Failed calling supervisor: " + JSON.stringify(jsonErr));
                    }
                });
            } else {
                console.error ("Can not call supervisor unless routable (state = " + state + ")");
            }
        }
    });


    jabra.addEventListener("devlog", (event) => {
        console.log("Got devlog event " + JSON.stringify(event));

        let timeStamp = new Date(event.data["TimeStampMs"]);

        let boomArm = undefined;
        let boomArmEvent = event.data["Boom Position Guidance OK"];
        if (boomArmEvent !== undefined) {
            boomArm = (boomArmEvent.toString().toLowerCase() === "true");
            boomArmEventsReceived = true;
            boomArmLastStatus = boomArm;

            if (!boomArm) {
                ++timesBoomArmMisaligned;
            }

            // Boom arm is updated always - call or not.
            updateBoomArmGui(boomArm);
        }

        let txDb = undefined;
        let txLevelEvent = event.data["TX Acoustic Logging Level"];
        if (txLevelEvent !== undefined) {
            txDb = parseInt(txLevelEvent);
            backgroundNoiseQueue.push({
                db: txDb,
                ts: timeStamp
            });
        }

        let txPeakDb = undefined;
        let txPeakLevelEvent = event.data["TX Acoustic Logging Peak"];
        if (txPeakLevelEvent !== undefined) {
            txPeakDb = parseInt(txPeakLevelEvent);
        }

        let rxDb = undefined;
        let rxLevelEvent = event.data["RX Acoustic Logging Level"];
        if (rxLevelEvent !== undefined) {
            rxDb = parseInt(rxLevelEvent);
            audioExposureQueue.push({
                db: rxDb,
                ts: timeStamp
            });
        }

        let rxPeakDb = undefined;
        let rxPeakLevelEvent = event.data["RX Acoustic Logging Peak"];
        if (rxPeakLevelEvent !== undefined) {
            rxPeakDb = parseInt(rxPeakLevelEvent);
        }

        txSpeech = undefined;
        let txSpeechEvent = event.data["Speech_Analysis_TX"];
        if (txSpeechEvent !== undefined) {
            txSpeech = (txSpeechEvent.toString().toLowerCase() === "true");
        }

        rxSpeech = undefined;
        let rxSpeechEvent = event.data["Speech_Analysis_RX"];
        if (rxSpeechEvent !== undefined) {
            rxSpeech = (rxSpeechEvent.toString().toLowerCase() === "true");
        }

        // Calculate historic tx/rx status.
        currentTxSpeechTime = txSpeechStart ? Math.abs((timeStamp - txSpeechStart)/1000) : 0;
        if (!txSpeechStart && txSpeech) {
            txSpeechStart = timeStamp;
        } else if (txSpeech === false && txSpeechStart !== undefined) {
            txSpeechTotal += currentTxSpeechTime;
            txSpeechStart = undefined;
            currentTxSpeechTime = 0;
        }

        currentRxSpeechTime = rxSpeechStart ? Math.abs((timeStamp - rxSpeechStart)/1000) : 0;
        if (!rxSpeechStart && rxSpeech) {
            rxSpeechStart = timeStamp;
        } else if (rxSpeech === false && rxSpeechStart !== undefined) {
            rxSpeechTotal += currentRxSpeechTime;
            rxSpeechStart = undefined;
            currentRxSpeechTime = 0;
        }

        // Calculate derived dynamic status:
        if (txSpeechStart && rxSpeechStart) {
            crossTalk = true;
        } else if (txSpeechStart !== undefined || rxSpeechStart !== undefined) {
            crossTalk = false;
        } else {
            crossTalk = undefined;
        }
        
        // Calculate derived historic status:
        currentCrossTalkTime = crossTalkStart ? Math.abs((timeStamp - crossTalkStart)/1000) : 0;
        if (!crossTalkStart && crossTalk) {
            crossTalkStart = timeStamp;
        } else if (crossTalk === false && crossTalkStart !== undefined) {
            crossTalkTotal += currentCrossTalkTime;
            crossTalkStart = undefined;
            currentCrossTalkTime = 0;
        }
        
        // Update GUI if in call:
        if (inCall) {
            calculateSilence(timeStamp);

            let id = event.data["ID"];
            if (id === "VOLDOWN TAP" || id === "VOLUP TAP") {
                ++volUpDownAdjustDuringCallCount;
            }       

            if (rxDb !== undefined) {
                updateExposureGui(rxDb);
            }

            if (txDb !== undefined) {
                updateNoiseGui(txDb);
            }

            updateCallOverviewGui();        
        }
        
        // Update when there was last tx/rx activity for next time use:
        if (txSpeech) {
            lastTxSpeechOrStart = timeStamp;
        }

        if (rxSpeech) {
            lastRxSpeechOrStart = timeStamp;
        }
    });

    // Find out if there is silence and for how long.
    function calculateSilence(timeStamp) 
    {        
        if (lastTxSpeechOrStart && lastRxSpeechOrStart && (!txSpeechStart && !rxSpeechStart)) {
            silence = (Math.abs(timeStamp-lastTxSpeechOrStart)>=silenceMinDurationMs && Math.abs(timeStamp-lastRxSpeechOrStart)>=silenceMinDurationMs)
        } else if (txSpeechStart || rxSpeechStart) {
            silence = false;
        } else {
            silence = undefined;
        }

        currentSilenceTime = silenceStart ? Math.abs((timeStamp - silenceStart)/1000) : 0;
        if (!silenceStart && silence) {
            silenceStart = timeStamp;
        } else if (!silence && silenceStart !== undefined) {
            silenceTotal += currentSilenceTime;
            silenceStart = undefined;
            currentSilenceTime = 0;
        }
    }

    function updateBoomArmGui(boomArm) {
        boomArmStatusText.innerText = boomArm ? "Well positioned for best quality" : "Badly positioned";
        noteBoomArmProblem.style.display = boomArm ? "none" : "block";

        boomArmUnknown.style.display = "none";
        boomArmKnown.style.display = "block";
    }

    let exposureData = {
        labels: [],
        datasets: [{
            data: [],
            borderColor: 'white',
            borderWidth: 1,
            fill: false,
        }]
    }

    let exposureChart = new Chart(exposureChartContext, {
        type: 'line',
        maintainAspectRatio: false,
        data: exposureData,
        options: {
            responsive: false,
            showLines: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: { 
                        display:false,
                        color: 'white'
                    },
                    ticks: {
                        display: false,
                        fontColor: "white",
                        fontSize: 10,
                        defaultFontFamily: "'GNElliotWeb-Regular'",
                        maxRotation: 90,
                        minRotation: 90,
                        callback: function (date) {
                            return date.toLocaleTimeString();                       
                        }
                    },
                    scaleLabel: {
                        display: false,
                    },
                }],
                yAxes: [{
                    display: true,
                    gridLines: { 
                        display:false,
                        color: 'white'
                    },
                    ticks: {
                        suggestedMin: 30,
                        suggestedMax: 80,
                        beginAtZero: false,
                        fontColor: "white",
                        defaultFontFamily: "'GNElliotWeb-Regular'",
                        fontSize: 10,
                        callback: function (value) {
                            return value + " db";
                        }
                    },
                    scaleLabel: {
                        display: false,
                    }
                }]
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            }
        }
    });

    const maxExposureData = 15;

    function updateExposureGui(exposureDb) {
        let exposurePct;
        if (exposureDb<=30) {
            exposurePct = 1;
        } else if (exposureDb>90) {
            exposurePct = 100;           
        } else {
            exposurePct =  Math.round(100.0*(exposureDb-30)/90.0);
        }

        exposureBar.style.width = exposurePct + '%';

        exposureBar.style.backgroundColor = "white";

        let date = new Date();
        lastExposureDate = exposureData.labels[noiseData.labels.length - 1];
        if (!lastExposureDate || (date.getTime()-lastExposureDate.getTime())>=5000) {
            const dataset = exposureData.datasets[0];
            if (exposureData.labels.length >= maxExposureData) {
                dataset.data.shift();
                exposureData.labels.shift();
            }
            dataset.data.push(exposureDb);
            exposureData.labels.push(date);
            exposureChart.update();

            lastExposureDate = date;
        }

        exposureUnknown.style.display = "none";
        exposureKnown.style.display = "block";
    }

    let noiseData = {
        labels: [],
        datasets: [{
            data: [],
            borderColor: 'grey',
            borderWidth: 1,
            pointBackgroundColor: [],
            pointBorderColor: [],
            fill: false,
        }]
    }

    let noiseChart = new Chart(noiseChartContext, {
        type: 'line',
        maintainAspectRatio: false,
        data: noiseData,
        options: {
            responsive: false,
            showLines: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: { 
                        display:false,
                        color: 'white'
                    },
                    ticks: {
                        display: false,
                        fontColor: "white",
                        fontSize: 10,
                        defaultFontFamily: "'GNElliotWeb-Regular'",
                        maxRotation: 90,
                        minRotation: 90,
                        callback: function (date) {
                            return date.toLocaleTimeString();                       
                        }
                    },
                    scaleLabel: {
                        display: false,
                    },
                }],
                yAxes: [{
                    display: true,
                    gridLines: { 
                        display:false,
                        color: 'white'
                    },
                    ticks: {
                        suggestedMin: 30,
                        suggestedMax: 80,
                        beginAtZero: false,
                        fontColor: "white",
                        defaultFontFamily: "'GNElliotWeb-Regular'",
                        fontSize: 10,
                        callback: function (value) {
                            return value + " db";
                        }
                    },
                    scaleLabel: {
                        display: false,
                    }
                }]
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            }
        }
    });

    const maxNoiseData = 15;

    function updateNoiseGui(noiseDb) {
        let noisePct;
        if (noiseDb<=30) {
            noisePct = 1;
        } else if (noiseDb>90) {
            noisePct = 100;           
        } else {
            noisePct =  Math.round(100.0*(noiseDb-30)/90.0);
        }

        noiseBar.style.width = noisePct + '%';

        let color;
        let problem;
        if (noiseDb<40) {
            problem = false;
            color = "00ff00";
        } else if (noiseDb>=40 && noiseDb<=45) {
            problem = false;
            color = "ffff00";
        } else if (noiseDb>45 && noiseDb<70) {
            problem = true;
            color = "8b0000";
        } else {
            problem = true;
            color = "ff0000";
        }

        noteNoiseProblem.style.display = problem ? "block" : "none";

        noiseBar.style.backgroundColor = "#"+color;

        let date = new Date();
        lastNoiseDate = noiseData.labels[noiseData.labels.length - 1];
        if (!lastNoiseDate || (date.getTime()-lastNoiseDate.getTime())>=5000) {
            const dataset = noiseData.datasets[0];
            if (noiseData.labels.length >= maxNoiseData) {
            dataset.data.shift();
            dataset.pointBackgroundColor.shift();
            dataset.pointBorderColor.shift();
            noiseData.labels.shift();
            }
            dataset.data.push(noiseDb);
            dataset.pointBackgroundColor.push("#"+color);
            dataset.pointBorderColor.push("#"+color);
            noiseData.labels.push(date);
            noiseChart.update();

            lastNoiseDate = date;
        }

        if (deviceHasMMIv2(activeDevice)) {
            jabra.setRemoteMmiLightAction(jabra.RemoteMmiType.MMI_TYPE_DOT3, color, jabra.RemoteMmiSequence.MMI_LED_SEQUENCE_ON);
        }

        noiseUnknown.style.display = "none";
        noiseKnown.style.display = "block";
    }



    let overviewData = {
        labels: [],
        datasets: [{
            data: [0,0,0,0], // cross talk, agent talking, contact talking, silence.
            borderColor: 'grey',
            borderWidth: 1,
            backgroundColor: [
                '#eb5757', "#ffd100", "#27AE60", "#808080"
            ]
        }]
    }

    let overviewChart = new Chart(overviewChartContext, {
        type: 'doughnut',
        maintainAspectRatio: true,
        data: overviewData,
        options: {
            responsive: false,
            legend: {
                display: false
            },       
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            cutoutPercentage: 65
        }
    });

    // Update gui:
    function updateCallOverviewGui() 
    {
        // Update dynamic status:
        if (txSpeech !== undefined) {
            agentTalkingOn.style.display = txSpeech ? "inline" : "none";
            agentTalkingOff.style.display = !txSpeech ? "inline" : "none"
            agentTalkingLabel.style.fontFamily = txSpeech ? "GNElliotWeb-Bold" : "GNElliotWeb-Regular";
        }

        if (rxSpeech !== undefined) {
            contactTalkingOn.style.display = rxSpeech ? "inline" : "none";
            contactTalkingOff.style.display = !rxSpeech ? "inline" : "none"
            contactLabel.style.fontFamily = rxSpeech ? "GNElliotWeb-Bold" : "GNElliotWeb-Regular";
        }

        if (crossTalk !== undefined) {
            crossTalkOn.style.display = crossTalk ? "inline" : "none";
            crossTalkOff.style.display = !crossTalk ? "inline" : "none"
            crossTalkLabel.style.fontFamily = crossTalk ? "GNElliotWeb-Bold" : "GNElliotWeb-Regular";
        }

        if (silence !== undefined) {
            silenceOn.style.display = silence ? "inline" : "none";
            silenceOff.style.display = !silence ? "inline" : "none";
            silenceLabel.style.fontFamily = silence ? "GNElliotWeb-Bold" : "GNElliotWeb-Regular";
        }

        // Update chart:
        overviewData.datasets[0].data = [crossTalkTotal+currentCrossTalkTime,
                                        txSpeechTotal+currentTxSpeechTime,
                                        rxSpeechTotal+currentRxSpeechTime,
                                        silenceTotal+currentSilenceTime];
        overviewChart.update();
    }

    // Show Amazon connect and addon wigets:
    amazonParent.style.display = "inline";

    // Connect init
    connect.core.initCCP(containerDiv, {
            ccpUrl: cppAccountUrl,
            loginPopup: true,
            softphone: { allowFramedSoftphone: softphoneEnable }
    });
    
    // Agent
    connect.agent(function (agent) {
        console.log("+++++++++********* inside connect.agent(function (agent)");
        activeAgent = agent;
        var name = agent.getName();
        name = ("Hello agent " + name);
        console.log(name);
        agent.onMuteToggle(function(m) {
            console.log("+++++++++ onRefresh On mute with muted = " + m.muted);

            muteStatus = m.muted;
            if (inCall) {
                ++muteDuringCallCount;
            }

            if (m.muted) {
                jabra.mute();
            } else {
                jabra.unmute();
            }
        });
    });

    // Contact
    connect.contact(function (contact) {
        console.log("+++++++++********* inside connect.contact(function (contact)");
        
        activeContact = contact;

        contact.onRefresh(function (contact) {
            console.log("+++++++++ onRefresh");
        });

        contact.onIncoming(function (contact) {
            console.log("+++++++++ onIncoming");
        });
        
        contact.onAccepted(function (contact) {
            console.log("+++++++++ onAccepted");
        });
        
        contact.onEnded(function (contact) {
            // Nb. beware AWS calls this on both call ended and on contact available for unknown reasons.
            console.log("+++++++++ onEnded");

            callEndedTime = new Date();
            jabra.onHook();

            // Complete live data.
            reportLiveToElasticSearchCloud(false);

            // Mark call as finished!
            inCall = false;

            if (deviceHasMMIv2(activeDevice)) {
              jabra.setRemoteMmiLightAction(jabra.RemoteMmiType.MMI_TYPE_DOT4, 0x000000, jabra.RemoteMmiSequence.MMI_LED_SEQUENCE_OFF);
            }
        });
        
        contact.onConnecting(function (contact) {
            console.log("+++++++++ onConnecting");
            jabra.ring();
        });
        
        contact.onPending(function (contact) {
            console.log("+++++++++ onPending");
        });
        
        contact.onConnected(function (contact) {
            console.log("+++++++++ onConnected");

            const loggingDevice = deviceHasLogging(activeDevice);

            lastTxSpeechOrStart = undefined;
            lastRxSpeechOrStart = undefined;
                
            txSpeech = undefined;
            rxSpeech = undefined;
            crossTalk = undefined;
            silence = undefined;

            txSpeechStart = undefined;
            rxSpeechStart = undefined;
            crossTalkStart = undefined;
            silenceStart = undefined;

            txSpeechTotal = 0;
            rxSpeechTotal = 0;
            crossTalkTotal = 0;
            silenceTotal = 0;

            currentTxSpeechTime = 0;
            currentRxSpeechTime = 0;
            currentCrossTalkTime = 0;
            currentSilenceTime = 0;

            callEndedTime = undefined;
            callConnectedTime = undefined;

            boomArmEventsReceived = false;
            timesBoomArmMisaligned = 0;

            muteDuringCallCount = 0;
            volUpDownAdjustDuringCallCount = 0;

            callEndedTime = undefined;
            callConnectedTime = new Date();
            let timestamp = callConnectedTime.getTime();
            lastTxSpeechOrStart = timestamp;
            lastRxSpeechOrStart = timestamp;

            lastCrossTalkReportTime = 0;
            lastTxSpeechReportTime = 0;
            lastRxSpeechReportTime = 0;
            lastSilenceReportTime = 0;

            // Keep only last registered exposure/backgrond noise before call for reference.
            audioExposureQueue.clearAllButLast();
            backgroundNoiseQueue.clearAllButLast();

            inCall = true;
            jabra.offHook();

            // Now everything is configured and we can start timed updated and reporting
            // Start by creating single historic record that will be updated later
            // with all data when call is finished.
            reportLiveToElasticSearchCloud(false);

            // Live cloud reporting per time interval:
            let cloudReportInterval = setInterval((activeContactOnSetup) => {
                // Auto unsubscribe once call is finished and final report was made.
                if (activeContactOnSetup !== activeContact || (!inCall && cloudReportInterval)) {
                    clearInterval(cloudReportInterval);
                    cloudReportInterval=undefined
                } else {
                    reportLiveToElasticSearchCloud(true);
                }
            }, cloudReportIntervalMs, activeContact);

            // Overview silence updates in absence of devlog events (silence)
            if (loggingDevice) {
                let updateSilenceInterval = setInterval((activeContactOnSetup) => {
                    // Auto unsubscribe once call is finished and final update was made.
                    if (activeContactOnSetup !== activeContact || (!inCall && updateSilenceInterval)) {
                        clearInterval(updateSilenceInterval);
                        updateSilenceInterval=undefined;
                    } else {
                        if (inCall) {
                            calculateSilence(new Date().getTime());
                        } else if (callEndedTime) {
                            calculateSilence(callEndedTime.getTime());
                        }

                        updateCallOverviewGui();
                    }
                }, silenceUpdateIntervalMs, activeContact);
            }
        });
    });
};

// Check if we have the configuration setup:
const urlParams = new URLSearchParams(window.location.search);
const cppUrlParam = urlParams.get('cppAccountUrl');
const quickPhoneNumberParam = urlParams.get('quickPhoneNumber');
const elasticsearchHostParam = urlParams.get('elasticsearchHost');
const softphoneEnableParam = urlParams.get('softphoneEnable');

const cppUrl = cppUrlParam ? decodeURI(cppUrlParam) : '';
const quickPhoneNumber = quickPhoneNumberParam ? decodeURI(quickPhoneNumberParam) : '';
const elasticsearchHost = elasticsearchHostParam ? decodeURI(elasticsearchHostParam) : '';
const softphoneEnable = softphoneEnableParam ? decodeURI(softphoneEnableParam).toLowerCase() === "true" : true;

// Run demo if we have the required parts of the configuration - otherwise ask for configuration:
if (cppUrl) {
    run(cppUrl, quickPhoneNumber, elasticsearchHost, softphoneEnable);
} else {
    urlText.textContent = "https://" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
    configurationParent.style.display = "inline";
}
