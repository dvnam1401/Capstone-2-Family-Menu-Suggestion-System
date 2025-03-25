import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaHome, FaListAlt } from 'react-icons/fa';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button/Button';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SuccessIcon = styled.div`
  color: #4CAF50;
  font-size: 80px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 15px;
  color: #333;
`;

const Message = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  color: #666;
  line-height: 1.6;
`;

const OrderInfo = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;
`;

const OrderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 10px;
    border-top: 1px dashed #ddd;
    font-weight: 600;
  }
  
  span:first-child {
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PaymentSuccess = () => {
  const location = useLocation();
  const order = location.state?.order || {};
  
  return (
    <MainLayout>
      <Container>
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        
        <Title>Thank You for Your Order!</Title>
        
        <Message>
          Your order has been placed successfully. We've sent a confirmation email with all the details.
          We'll process your order as soon as possible.
        </Message>
        
        <OrderInfo>
          <OrderDetail>
            <span>Order Number:</span>
            <span>#{order.id || '12345678'}</span>
          </OrderDetail>
          
          <OrderDetail>
            <span>Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </OrderDetail>
          
          <OrderDetail>
            <span>Payment Method:</span>
            <span>{order.paymentMethod || 'Cash on Delivery'}</span>
          </OrderDetail>
          
          <OrderDetail>
            <span>Total:</span>
            <span>{order.total ? `${order.total}đ` : '₫500,000'}</span>
          </OrderDetail>
        </OrderInfo>
        
        <ButtonGroup>
          <Button 
            variant="primary" 
            as={Link} 
            to="/orders"
            leftIcon={<FaListAlt />}
          >
            View My Orders
          </Button>
          
          <Button 
            variant="outline" 
            as={Link} 
            to="/"
            leftIcon={<FaHome />}
          >
            Continue Shopping
          </Button>
        </ButtonGroup>
      </Container>
    </MainLayout>
  );
};

export default PaymentSuccess;