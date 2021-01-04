import styled from "styled-components";

export const Base = styled.div`
  display: flex;
`;

export const Plot = styled.div`
  width: 50%;
  margin: 0 12px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;
