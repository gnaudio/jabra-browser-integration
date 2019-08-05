type Interval = {
  start: number;
  end: number;
};

interface Analytics {
  getTXSpeechStatus(): boolean;
  getTXSpeechTime(fromTime?: number, toTime?: number): number;
  getTXSpeechPercentage(fromTime?: number, toTime?: number): number;

  getRXSpeechStatus(): boolean;
  getRXSpeechTime(fromTime?: number, toTime?: number): number;
  getRXSpeechPercentage(fromTime?: number, toTime?: number): number;

  getCrosstalkStatus(): boolean;
  getCrosstalkTime(fromTime?: number, toTime?: number): number;
  getCrosstalkPercentage(fromTime?: number, toTime?: number): number;

  getSilenceStatus(): boolean;
  getSilenceTime(fromTime?: number, toTime?: number): number;
  getSilencePercentage(fromTime?: number, toTime?: number): number;

  getMutedStatus(): boolean;
  getMutedCount(): number;

  getBoomArmStatus(): boolean;
  getBoomArmMisalignedCount(): number;

  getVolumeUpCount(): number;
  getVolumeDownCount(): number;

  getAudioExposure(fromTime?: number, toTime?: number): number;
  getAverageAudioExposure(fromTime?: number, toTime?: number): number;

  getBackgroundNoise(fromTime?: number, toTime?: number): number;
  getAverageBackgroundNoise(fromTime?: number, toTime?: number): number;
}
