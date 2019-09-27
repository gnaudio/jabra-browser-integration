import { Client } from "elasticsearch-browser";
import * as Flex from "@twilio/flex-ui";
import { jabra } from "@gnaudio/twilio-flex-call-control-plugin";

class Elastic {
  client = new Client({
    host: process.env.REACT_APP_ES_HOST,
    log: "trace",
    apiVersion: "6.8"
  });

  manager = Flex.Manager.getInstance();

  constructor(analytics) {
    this.analytics = analytics;
    this.manager = Flex.Manager.getInstance();
  }

  async start(reservation) {
    this.reservation = reservation;

    this.startTime = new Date();
    this.stopTime = undefined;

    this.interval = setInterval(() => {
      this.report(true);
    }, 5000);

    await this.report();
  }

  async stop() {
    this.stopTime = new Date();

    clearInterval(this.interval);

    await this.report();
  }

  async report(live = false) {
    if (!this.reservation) return;
    const taskId = this.reservation.task.sid;
    const currentTime = new Date();
    const deviceInfo = await this.getDeviceInfo(live, currentTime);
    const environment = await this.getEnvironment(live, currentTime);
    const callInfo = await this.getCallInfo(live, currentTime);
    const analytics = await this.getAnalytics(live, currentTime);
    const status = await this.getStatus(live, currentTime);

    const json = {
      index: live ? "jabralive" : "jabrahistoric",
      type: "jabraTwilio",
      body: { taskId }
    };

    if (!live) json.id = taskId;
    if (deviceInfo) json.body.deviceInfo = deviceInfo;
    if (environment) json.body.environment = environment;
    if (callInfo) json.body.callInfo = callInfo;
    if (analytics) json.body.analytics = analytics;
    if (status) json.body.status = status;

    try {
      await this.client.index(json);

      console.log(
        "Sucessfully send " +
          (live ? "live" : "historic") +
          " data " +
          JSON.stringify(json) +
          " to ES"
      );
    } catch (err) {
      console.error(
        "Error " + err + " trying to send " + JSON.stringify(json) + " to ES"
      );
    }

    this.lastReportTime = currentTime;
  }

  async getDeviceInfo() {
    const activeDevice = await jabra.getActiveDevice();

    if (activeDevice)
      return {
        deviceName: activeDevice.deviceName,
        firmwareVersion: activeDevice.firmwareVersion,
        serialNumber: activeDevice.serialNumber,
        skypeCertified: activeDevice.skypeCertified,
        productID: activeDevice.productID,
        variant: activeDevice.variant
      };
  }

  async getEnvironment() {
    const installInfo = await jabra.getInstallInfo();

    if (installInfo && navigator)
      return {
        versionChromehost: installInfo.version_chromehost,
        versionNativeSDK: installInfo.version_nativesdk,
        version_browserextension: installInfo.version_browserextension,
        version_jsapi: installInfo.version_jsapi,
        platform: navigator.platform,
        userAgent: navigator.userAgent
      };
  }

  async getCallInfo(live, currentTime) {
    const callInfo = {
      agentName: this.manager.workerClient.attributes.full_name,
      agentUserName: this.manager.workerClient.name,
      contactPhoneNumber: this.reservation.task.attributes.caller,
      currentTime: currentTime.toISOString()
    };
    if (this.startTime) callInfo.connectedTime = this.startTime.toISOString();
    if (this.stopTime) callInfo.endedTime = this.stopTime.toISOString();

    return callInfo;
  }

  async getAnalytics(live, currentTime) {
    const speechTime = this.analytics.getSpeechTime();
    const speechTimeNow = this.analytics.getSpeechTime(
      this.lastReportTime,
      currentTime
    );
    const analytics = {
      txSpeechTotal: speechTime.txSpeechTime,
      rxSpeechTotal: speechTime.rxSpeechTime,
      crossTalkTotal: speechTime.crosstalkTime,
      silenceTotal: speechTime.silenceTime,
      txSpeechTotalPct: speechTime.txSpeechTimePct,
      rxSpeechTotalPct: speechTime.rxSpeechTimePct,
      crossTalkTotalPct: speechTime.crosstalkTimePct,
      silenceTotalPct: speechTime.silenceTimePct
    };

    if (live) {
      analytics.txSpeechNow = speechTimeNow.txSpeechTime;
      analytics.rxSpeechNow = speechTimeNow.rxSpeechTime;
      analytics.crossTalkNow = speechTimeNow.crosstalkTime;
      analytics.silenceNow = speechTimeNow.silenceTime;
      analytics.txSpeechNowPct = speechTimeNow.txSpeechTimePct;
      analytics.rxSpeechNowPct = speechTimeNow.rxSpeechTimePct;
      analytics.crossTalkNowPct = speechTimeNow.crosstalkTimePct;
      analytics.silenceNowPct = speechTimeNow.silenceTimePct;
    }

    return analytics;
  }

  async getStatus(live, currentTime) {
    const boomArmStatus = this.analytics.getBoomArmStatus();

    const status = {
      muted: this.analytics.getMutedStatus(),
      muteCount: this.analytics.getMutedCount(),
      boomArm: {},
      volUpDownCount:
        this.analytics.getVolumeUpCount() + this.analytics.getVolumeDownCount()
    };

    const audioExposureAvg = this.analytics.getAverageAudioExposure();
    const backgroundNoiseAvg = this.analytics.getAverageBackgroundNoise();

    if (audioExposureAvg > 0) status.audioExposureAvg = audioExposureAvg;
    if (backgroundNoiseAvg > 0) status.backgroundNoiseAvg = backgroundNoiseAvg;

    if (boomArmStatus) {
      status.boomArm = {
        lastPositioned: boomArmStatus,
        timesMisaligned: this.analytics.getBoomArmMisalignedCount()
      };
    }

    if (live) {
      const audioExposureNow = this.analytics.getAverageAudioExposure(
        this.lastReportTime,
        currentTime
      );
      const backgroundNoiseNow = this.analytics.getAverageBackgroundNoise(
        this.lastReportTime,
        currentTime
      );

      if (audioExposureNow > 0) status.audioExposureNow = audioExposureNow;
      if (audioExposureNow > 0) status.backgroundNoiseNow = backgroundNoiseNow;
    }

    return status;
  }
}

export default Elastic;
