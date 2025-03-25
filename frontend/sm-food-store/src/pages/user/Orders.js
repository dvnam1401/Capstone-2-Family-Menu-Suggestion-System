import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingBag, FaEye, FaFileDownload } from 'react-icons/fa';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button/Button';
import Pagination from '../../components/common/Pagination/Pagination';
import { AuthContext } from '../../context/AuthContext';
import orderService from '../../services/orderService';

const OrdersContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
`;

const OrdersTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 30px;
`;

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
`;

const CardHeader = styled.div`
  background: #f5f5f5;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 10px;
      color: #4CAF50;
    }
  }
`;

const CardBody = styled.div`
  padding: 20px;
`;

const OrdersTable = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f9f9f9;
    font-weight: 600;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  ${props => {
    if (props.status === 'completed') {
      return `
        background-color: rgba(76, 175, 80, 0.1);
        color: #4CAF50;
      `;
    } else if (props.status === 'processing') {
      return `
        background-color: rgba(33, 150, 243, 0.1);
        color: #2196F3;
      `;
    } else if (props.status === 'cancelled') {
      return `
        background-color: rgba(244, 67, 54, 0.1);
        color: #F44336;
      `;
    } else {
      return `
        background-color: rgba(255, 152, 0, 0.1);
        color: #FF9800;
      `;
    }
  }}
`;

const ActionButton = styled(Button)`
  margin-right: 8px;
  
  &:last-child {
    margin-right: 0;
  }
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: 30px;
  
  svg {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  h3 {
    margin: 0 0 10px;
    font-size: 18px;
    color: #333;
  }
  
  p {
    margin: 0 0 20px;
    color: #666;
  }
`;

const Orders = () => {
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getUserOrders({
          page: currentPage,
          limit: 10
        });
        
        setOrders(response.orders);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, currentPage]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  return (
    <MainLayout>
      <OrdersContainer>
        <OrdersTitle>My Orders</OrdersTitle>
        
        <CardContainer>
          <CardHeader>
            <h2><FaShoppingBag /> Order History</h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length > 0 ? (
              <>
                <OrdersTable>
                  <Table>
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.orderNumber}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <StatusBadge status={order.status.toLowerCase()}>
                              {getStatusText(order.status)}
                            </StatusBadge>
                          </td>
                          <td>{order.total}đ</td>
                          <td>
                            <ActionButton
                              as={Link}
                              to={`/orders/${order.id}`}
                              variant="outline"
                              size="small"
                            >
                              <FaEye /> View
                            </ActionButton>
                            <ActionButton
                              variant="text"
                              size="small"
                              onClick={() => {/* Download invoice logic */}}
                            >
                              <FaFileDownload /> Invoice
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </OrdersTable>
                
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyOrders>
                <FaShoppingBag />
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet.</p>
                <Button
                  as={Link}
                  to="/"
                  variant="primary"
                >
                  Start Shopping
                </Button>
              </EmptyOrders>
            )}
          </CardBody>
        </CardContainer>
      </OrdersContainer>
    </MainLayout>
  );
};

export default Orders;