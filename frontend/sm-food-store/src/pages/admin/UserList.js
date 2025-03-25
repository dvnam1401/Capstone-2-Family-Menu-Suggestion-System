import React from 'react';
import styled from 'styled-components';
import AdminLayout from '../../layouts/AdminLayout';

const Container = styled.div`
  padding: 20px;
`;

const UserList = () => {
  return (
    <AdminLayout title="User Management">
      <Container>
        <h2>User Management</h2>
        <p>This page will display a list of users and allow admins to manage them.</p>
      </Container>
    </AdminLayout>
  );
};

export default UserList;