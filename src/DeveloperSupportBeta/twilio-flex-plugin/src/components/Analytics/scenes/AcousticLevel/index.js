import React from "react";
import { Collapse } from "../../components/Collapse";
import { Acoustic } from "../../components/Acoustic";
import * as S from "./styles";

export class AcousticLevel extends React.Component {
  state = {
    noise: [],
    exposure: []
  };

  componentDidMount = () => {
    this.props.analytics.on("txacousticlevel", this.handleNoiseLevel);
    this.props.analytics.on("rxacousticlevel", this.handleExposureLevel);
  };

  componentWillUnmount = () => {
    this.props.analytics.off("txacousticlevel", this.handleNoiseLevel);
    this.props.analytics.off("rxacousticlevel", this.handleExposureLevel);
  };

  handleNoiseLevel = () => {
    const noise = this.props.analytics.getBackgroundNoise();

    this.setState({ noise });
  };

  handleExposureLevel = () => {
    const exposure = this.props.analytics.getAudioExposure();

    this.setState({ exposure });
  };

  render = () => {
    const { noise, exposure } = this.state;

    return (
      <Collapse label="Acoustic levels">
        <S.Base>
          <S.Plot>
            Noise (dB)
            <Acoustic data={noise} />
          </S.Plot>
          <S.Plot>
            Exposure (dB)
            <Acoustic data={exposure} />
          </S.Plot>
        </S.Base>
      </Collapse>
    );
  };
}
