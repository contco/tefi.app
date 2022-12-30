/* eslint no-nested-ternary: "off" */
import styled from 'styled-components';
import { ButtonProps } from './Helper';

export const StyledButton = styled.span<ButtonProps>`
  cursor: pointer;
  color: ${(props) => (props.reversed ? (props.active ? 'white' : '#aaa') : props.active ? 'black' : '#ccc')};
  background: ${(props) => (props.reversed ? (props.active ? '#9fa6bf' : '') : props.active ? '#9fa6bf' : '')};
  &: hover {
    background: #e7e9f5;
  }
  padding: 4px;
  border-radius: 2px;
`;

export const StyledIcon = styled.svg<ButtonProps>`
  fill: ${(props) => props.color};
  & use {
    fill: ${(props) => props.color};
    fill: ${(props) => (props.reversed ? (props.active ? '#ffffff' : '') : props.active ? '#ffffff' : '')};
  }
  fill: ${(props) => (props.reversed ? (props.active ? '#ffffff' : '') : props.active ? '#ffffff' : '')};
`;

// Menu
export const Container = styled.div`
  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  opacity: 0;
  background-color: #050b21;
  border-radius: 3px;
  transition: opacity 0.75s;
  & > * {
    display: inline-block;
  }
`;
export const Triangle = styled.div`
  position: absolute;
  top: auto;
  bottom: 100%;
  left: 44%;
  border: solid 8px;
  border-color: transparent transparent #050b21 transparent;
  margin: 0 auto;
`;
export const StyledMenu = styled.div`
    border-radius: 3px;
    transition: opacity 0.75s;
    & > * {
      display: inline-block;
    }
    & > * + * {
      margin-left: 15px;
    `;

// link input
export const LinkInput = styled.input`
    border: none;
    background: #050b21;
    box-sizing: border-box;
    color: #FFFFFF;
    padding:6px
    font-size:16px
`;
