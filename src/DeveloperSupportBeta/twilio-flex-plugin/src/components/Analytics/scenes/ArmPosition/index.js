import React from "react";
import { Collapse } from "../../components/Collapse";
import * as S from "./styles";

export class ArmPosition extends React.Component {
  state = {
    positionOK: null
  };

  componentDidMount = () => {
    this.props.analytics.on("armpositionok", this.handleSpeechEvent);
  };

  componentWillUnmount = () => {
    this.props.analytics.off("armpositionok", this.handleSpeechEvent);
  };

  handleSpeechEvent = ({ value }) => {
    this.setState({
      positionOK: value
    });
  };

  render = () => {
    const { positionOK } = this.state;

    return (
      <Collapse label="Arm position">
        <S.Text>
          {positionOK === null
            ? "Position unknown, please wait"
            : positionOK === true
            ? "Well positioned for best quality"
            : "Badly positioned"}
        </S.Text>
      </Collapse>
    );
  };
}
