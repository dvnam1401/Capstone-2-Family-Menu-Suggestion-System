import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSearch } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button/Button';

const NotFoundContainer = styled.div`
  max-width: 800px;
  margin: 60px auto;
  padding: 30px;
  text-align: center;
`;

const ErrorCode = styled.div`
  font-size: 100px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NotFound = () => {
  return (
    <MainLayout>
      <NotFoundContainer>
        <ErrorCode>404</ErrorCode>
        <Title>Page Not Found</Title>
        <Description>
          We're sorry, the page you are looking for does not exist or has been moved.
          Please check the URL or return to the homepage.
        </Description>
        <ButtonGroup>
          <Button as={Link} to="/" variant="primary">
            <FaHome /> Go to Homepage
          </Button>
          <Button as={Link} to="/search" variant="outline">
            <FaSearch /> Search Products
          </Button>
        </ButtonGroup>
      </NotFoundContainer>
    </MainLayout>
  );
};

export default NotFound;