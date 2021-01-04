import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { css } from 'styled-components'

export enum ButtonType {
  primary,
  primaryInverted,
  danger,
}

export interface ButtonCommonProps {
  buttonType?: ButtonType
  theme?: unknown
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonCommonProps {}

export interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    ButtonCommonProps {}

const PrimaryCSS = css`
  background-color: ${(props) => props.theme.buttonPrimary.backgroundColor};
  border-color: ${(props) => props.theme.buttonPrimary.borderColor};
  color: ${(props) => props.theme.buttonPrimary.color};

  &:hover {
    background-color: ${(props) => props.theme.buttonPrimary.backgroundColorHover};
    border-color: ${(props) => props.theme.buttonPrimary.borderColorHover};
    color: ${(props) => props.theme.buttonPrimary.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.buttonPrimary.borderColor};
    border-color: ${(props) => props.theme.buttonPrimary.borderColor};
    color: ${(props) => props.theme.buttonPrimary.color};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const PrimaryInvertedCSS = css`
  background-color: ${(props) => props.theme.buttonPrimaryInverted.backgroundColor};
  border-color: ${(props) => props.theme.buttonPrimaryInverted.borderColor};
  color: ${(props) => props.theme.buttonPrimaryInverted.color};

  &:hover {
    background-color: ${(props) => props.theme.buttonPrimaryInverted.backgroundColorHover};
    border-color: ${(props) => props.theme.buttonPrimaryInverted.borderColorHover};
    color: ${(props) => props.theme.buttonPrimaryInverted.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.buttonPrimaryInverted.backgroundColor};
    border-color: ${(props) => props.theme.buttonPrimaryInverted.borderColor};
    color: ${(props) => props.theme.buttonPrimaryInverted.color};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const DangerCSS = css`
  background-color: ${(props) => props.theme.buttonDanger.backgroundColor};
  border-color: ${(props) => props.theme.buttonDanger.borderColor};
  color: ${(props) => props.theme.buttonDanger.color};

  &:hover {
    background-color: ${(props) => props.theme.buttonDanger.backgroundColorHover};
    border-color: ${(props) => props.theme.buttonDanger.borderColorHover};
    color: ${(props) => props.theme.buttonDanger.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.buttonDanger.backgroundColor};
    border-color: ${(props) => props.theme.buttonDanger.borderColor};
    color: ${(props) => props.theme.buttonDanger.color};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getButtonTypeStyles = (buttonType: ButtonType = ButtonType.primary): any => {
  if (buttonType === ButtonType.primary) {
    return PrimaryCSS
  }

  if (buttonType === ButtonType.primaryInverted) {
    return PrimaryInvertedCSS
  }

  if (buttonType === ButtonType.danger) {
    return DangerCSS
  }

  return PrimaryCSS
}

export const ButtonCSS = css<ButtonCommonProps>`
  align-items: center;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
  display: flex;
  font-size: 20px;
  font-weight: 500;
  height: 35px;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 0 25px;
  text-align: center;
  transition: all 0.15s ease-out;
  user-select: none;
  white-space: nowrap;

  ${(props) => getButtonTypeStyles(props.buttonType)}
`
