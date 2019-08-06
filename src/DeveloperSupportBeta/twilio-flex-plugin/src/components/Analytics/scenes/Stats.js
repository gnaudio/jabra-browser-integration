import React from "react";
import { Collapse } from "../components/Collapse";
import { Overview } from "../components/Overview";

export class Stats extends React.Component {
  state = {
    status: {
      isTXSpeaking: false,
      isRXSpeaking: false,
      isCrosstalking: false,
      isSilent: true
    },
    overview: {
      txSpeechTime: 0,
      rxSpeechTime: 0,
      crosstalkTime: 0,
      silenceTime: 0
    }
  };

  componentDidMount = () => {
    this.props.analytics.on("txspeech", this.handleSpeechEvent);
    this.props.analytics.on("rxspeech", this.handleSpeechEvent);
  };

  componentWillUnmount = () => {
    this.props.analytics.off("txspeech", this.handleSpeechEvent);
    this.props.analytics.off("rxspeech", this.handleSpeechEvent);
  };

  handleSpeechEvent = () => {
    this.setState({
      status: this.props.analytics.getSpeechStatus(),
      overview: this.props.analytics.getSpeechTime()
    });
  };

  render = () => {
    const { status, overview } = this.state;

    return (
      <Collapse label="Overview">
        <Overview status={status} overview={overview} />
      </Collapse>
    );
  };
}
