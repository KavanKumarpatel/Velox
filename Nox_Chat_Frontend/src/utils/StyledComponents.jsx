import { styled } from "@mui/material";

export const InputBox = styled("input")`
widthL 100%;
height: 100%;
border: none;
outline: none;
padding: 0 3rem;
border-radius: 1.5rem;
background-color: ${"#161c24"}
`;


export const SearchField = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  height: 3rem;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: #454f5b;
  font-size: 1.1rem;
`;

export const CurveButton = styled("button")`
  border-radius: 1.5rem;
  padding: 0.5rem 2rem;
  border: none;
  height: 3rem;
  display: "flex";
  flex-direction: "row";
  justify-content: "center";
  align-items: "center";
  outline: none;
  cursor: pointer;
  background-color: #dfe3e8;
  colorl: white;
  font-size: 1.1rem;
  &:hover {
    background-color: #c4cdd5;
  }
`;