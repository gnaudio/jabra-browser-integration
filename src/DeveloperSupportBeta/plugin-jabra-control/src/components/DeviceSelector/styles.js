import styled from "styled-components";

export const Device = styled.label`
  display: flex;
  align-items: center;
  user-select: none;

  &:not(:first-child) {
    margin-top: 0.5rem;
  }
`;

export const Input = styled.input`
  margin-right: 1rem;
`;
