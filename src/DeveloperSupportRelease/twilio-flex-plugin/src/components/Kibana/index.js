import React from "react";
import { SideLink, Actions } from "@twilio/flex-ui";
import Iframe from "react-iframe";
import * as S from "./styles";

export const KibanaView = () => {
  return (
    <Iframe
      width="100%"
      height="100%"
      url={process.env.REACT_APP_KIBANA_HOST}
    />
  );
};

export const KibanaButton = ({ activeView }) => {
  const handleClick = () => {
    Actions.invokeAction("NavigateToView", { viewName: "jabra-kibana-view" });
  };
  return (
    <SideLink
      showLabel={true}
      icon={<S.ElasticIcon />}
      iconActive={<S.ElasticIconFull />}
      isActive={activeView === "jabra-kibana-view"}
      onClick={handleClick}
    />
  );
};
