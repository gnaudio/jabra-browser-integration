import ReactTooltip from "react-tooltip";
import styled, { css } from "styled-components";

import { ReactComponent as UnstyledLogo } from "../../assets/logo.svg";

export const Base = styled.div`
  padding: 6px;
  display: flex;
  align-items: center;
`;

export const Logo = styled(UnstyledLogo)`
  height: 16px;

  ${({ invalid }) =>
    invalid &&
    css`
      filter: saturate(0%);
    `}
`;

export const Tooltip = styled(ReactTooltip).attrs({
  delayHide: 100,
  effect: "solid",
  place: "bottom"
})`
  max-width: 16rem !important;
  pointer-events: auto !important;
  padding: 1rem !important;

  &:hover {
    visibility: visible !important;
    opacity: 1 !important;
  }
`;

export const Error = styled.div`
  text-align: center;
`;
