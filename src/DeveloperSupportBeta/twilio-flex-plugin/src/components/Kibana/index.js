import React from "react";
import { SideLink, Actions } from "@twilio/flex-ui";
import Iframe from "react-iframe";
import * as S from "./styles";

export const KibanaView = () => {
  return (
    <Iframe
      width="100%"
      height="100%"
      url="https://search-jabra-twilio-flex-sg4bab332ayahqwjnim6fw4e3a.eu-central-1.es.amazonaws.com/_plugin/kibana/app/kibana#/dashboard/9c4286d0-3fef-11e9-8957-4114c8ca1c37?embed=true&_g=(refreshInterval%3A(pause%3A!f%2Cvalue%3A5000)%2Ctime%3A(from%3Anow-15m%2Cmode%3Aquick%2Cto%3Anow))"
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
