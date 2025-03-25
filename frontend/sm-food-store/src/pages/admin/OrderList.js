import React from 'react';
import styled from 'styled-components';
import AdminLayout from '../../layouts/AdminLayout';

const Container = styled.div`
  padding: 20px;
`;

const OrderList = () => {
  return (
    <AdminLayout title="Order Management">
      <Container>
        <h2>Order Management</h2>
        <p>This page will display a list of orders and allow admins to manage them.</p>
      </Container>
    </AdminLayout>
  );
};

export default OrderList;