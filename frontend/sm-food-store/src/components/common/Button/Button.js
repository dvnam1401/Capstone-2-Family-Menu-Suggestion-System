import React from 'react';
import styled, { css } from 'styled-components';

const ButtonWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'large' ? '12px 24px' : props.size === 'small' ? '6px 12px' : '8px 16px'};
  font-size: ${props => props.size === 'large' ? '16px' : props.size === 'small' ? '12px' : '14px'};
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;

  ${props => props.variant === 'secondary' && css`
    background-color: #FF8C00;
    color: white;
    &:hover {
      background-color: #e67e00;
    }
  `}

  ${props => props.variant === 'outline' && css`
    background-color: transparent;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    &:hover {
      background-color: rgba(76, 175, 80, 0.1);
    }
  `}

  ${props => props.variant === 'text' && css`
    background-color: transparent;
    color: #4CAF50;
    padding: ${props.size === 'large' ? '8px 16px' : props.size === 'small' ? '4px 8px' : '6px 12px'};
    &:hover {
      background-color: rgba(76, 175, 80, 0.1);
    }
  `}

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      ${props.variant === 'primary' && css`background-color: #4CAF50;`}
      ${props.variant === 'secondary' && css`background-color: #FF8C00;`}
      ${props.variant === 'outline' && css`background-color: transparent;`}
      ${props.variant === 'text' && css`background-color: transparent;`}
    }
  `}

  svg {
    margin-right: ${props => props.iconOnly ? '0' : '8px'};
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  fullWidth = false, 
  iconOnly = false, 
  type = 'button', 
  onClick,
  ...rest 
}) => {
  return (
    <ButtonWrapper
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </ButtonWrapper>
  );
};

export default Button;