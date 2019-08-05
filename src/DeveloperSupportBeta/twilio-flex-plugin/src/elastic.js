import { Client } from "elasticsearch-browser";
import * as Flex from "@twilio/flex-ui";
import * as Jabra from "jabra-browser-integration";

class Elastic {
  client = new Client({
    host:
      "https://search-jabra-twilio-flex-sg4bab332ayahqwjnim6fw4e3a.eu-central-1.es.amazonaws.com/",
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

      // console.log(
      //   "Sucessfully send " +
      //     (live ? "live" : "historic") +
      //     " data " +
      //     JSON.stringify(json) +
      //     " to ES"
      // );
    } catch (err) {
      console.error(
        "Error " + err + " trying to send " + JSON.stringify(json) + " to ES"
      );
    }

    this.lastReportTime = currentTime;
  }

  async getDeviceInfo() {
    const activeDevice = await Jabra.getActiveDevice();

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
    const installInfo = await Jabra.getInstallInfo();

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
    const analytics = {
      txSpeechTotal: this.analytics.getTXSpeechTime(),
      rxSpeechTotal: this.analytics.getRXSpeechTime(),
      crossTalkTotal: this.analytics.getCrosstalkTime(),
      silenceTotal: this.analytics.getSilenceTime(),
      txSpeechTotalPct: this.analytics.getTXSpeechPercentage(),
      rxSpeechTotalPct: this.analytics.getRXSpeechPercentage(),
      crossTalkTotalPct: this.analytics.getCrosstalkPercentage(),
      silenceTotalPct: this.analytics.getSilencePercentage()
    };

    if (live) {
      analytics.txSpeechNow = this.analytics.getTXSpeechTime(
        this.lastReportTime,
        currentTime
      );
      analytics.rxSpeechNow = this.analytics.getRXSpeechTime(
        this.lastReportTime,
        currentTime
      );
      analytics.crossTalkNow = this.analytics.getCrosstalkTime(
        this.lastReportTime,
        currentTime
      );
      analytics.silenceNow = this.analytics.getSilenceTime(
        this.lastReportTime,
        currentTime
      );
      analytics.txSpeechNowPct = this.analytics.getTXSpeechPercentage(
        this.lastReportTime,
        currentTime
      );
      analytics.rxSpeechNowPct = this.analytics.getRXSpeechPercentage(
        this.lastReportTime,
        currentTime
      );
      analytics.crossTalkNowPct = this.analytics.getCrosstalkPercentage(
        this.lastReportTime,
        currentTime
      );
      analytics.silenceNowPct = this.analytics.getSilencePercentage(
        this.lastReportTime,
        currentTime
      );
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
        this.analytics.getVolumeUpCount() + this.analytics.getVolumeDownCount(),
      audioExposureAvg: this.analytics.getAverageAudioExposure(),
      backgroundNoiseAvg: this.analytics.getAverageBackgroundNoise()
    };

    if (boomArmStatus) {
      status.boomArm = {
        lastPositioned: boomArmStatus,
        timesMisaligned: this.analytics.getBoomArmMisalignedCount()
      };
    }

    if (live) {
      status.audioExposureNow = this.analytics.getAverageAudioExposure(
        this.lastReportTime,
        currentTime
      );
      status.backgroundNoiseNow = this.analytics.getAverageBackgroundNoise(
        this.lastReportTime,
        currentTime
      );
    }

    return status;
  }
}

export default Elastic;
