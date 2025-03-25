// src/layouts/AuthLayout.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  
  img {
    height: 40px;
  }
`;

const AuthLayout = ({ children }) => {
  return (
    <AuthContainer>
      <LogoContainer>
        <Link to="/">
          <img src={logo} alt="SM Food Store" />
        </Link>
      </LogoContainer>
      <Content>
        {children}
      </Content>
    </AuthContainer>
  );
};

export default AuthLayout;