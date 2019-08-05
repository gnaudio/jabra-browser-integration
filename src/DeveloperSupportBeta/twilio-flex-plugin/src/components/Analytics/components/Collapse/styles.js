import styled, { css } from "styled-components";

export const Label = styled.div`
  font-weight: 700;
  user-select: none;
  position: relative;
  margin-bottom: 6px;
  text-transform: uppercase;

  &:after {
    content: "";
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto 0;

    ${({ open }) =>
      open
        ? css`
            border-width: 0 6px 6px 6px;
            border-color: transparent transparent black transparent;
          `
        : css`
            border-width: 6px 6px 0 6px;
            border-color: black transparent transparent transparent;
          `}
  }
`;

export const Content = styled.div`
  display: none;
  margin-bottom: 8px;

  ${({ open }) =>
    open &&
    css`
      display: block;
    `}
`;
