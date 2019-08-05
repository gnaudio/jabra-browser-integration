import styled, { css } from "styled-components";

export const Overview = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Statuses = styled.div`
  /* flex-shrink: 0; */
`;

export const Status = styled.div`
  display: flex;
  padding: 1px 0;
  align-items: center;
`;

export const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 99999px;
  margin-right: 8px;

  ${({ value, color }) => css`
    border: 1px solid ${color};
    box-shadow: inset 0px 0px 0 1.5px white;

    ${value &&
      css`
        background-color: ${color};
      `}
  `}
`;

export const StatusLabel = styled.div`
  font-family: "Open Sans";

  ${({ value }) => css`
    ${value &&
      css`
        font-weight: 700;
      `}
  `}
`;
