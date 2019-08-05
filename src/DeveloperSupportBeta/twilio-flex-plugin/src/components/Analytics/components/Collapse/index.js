import React from "react";
import * as S from "./styles";

export class Collapse extends React.Component {
  state = {
    open: true
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render = () => {
    const { label, children } = this.props;
    const { open } = this.state;

    return (
      <div>
        <S.Label open={open} onClick={this.handleClick}>
          {label}
        </S.Label>
        <S.Content open={open}>{children}</S.Content>
      </div>
    );
  };
}
