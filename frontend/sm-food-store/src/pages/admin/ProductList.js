import React from 'react';
import styled from 'styled-components';
import AdminLayout from '../../layouts/AdminLayout';

const Container = styled.div`
  padding: 20px;
`;

const ProductList = () => {
  return (
    <AdminLayout title="Product Management">
      <Container>
        <h2>Product Management</h2>
        <p>This page will display a list of products and allow admins to manage them.</p>
      </Container>
    </AdminLayout>
  );
};

export default ProductList;