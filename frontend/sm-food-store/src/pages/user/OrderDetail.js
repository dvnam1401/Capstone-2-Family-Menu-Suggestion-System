import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaTruck, FaFileDownload, FaTimesCircle } from 'react-icons/fa';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button/Button';
import orderService from '../../services/orderService';

const OrderDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    
    div:last-child {
      margin-top: 20px;
    }
  }
`;

const OrderTitle = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const OrderNumber = styled.span`
  font-weight: normal;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
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

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
`;

const InfoSection = styled.div`
  h3 {
    font-size: 16px;
    margin: 0 0 10px;
    color: #666;
  }
  
  p {
    margin: 0 0 5px;
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

const ProductsTable = styled.div`
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

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductName = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #4CAF50;
    text-decoration: underline;
  }
`;

const SubtotalRow = styled.tr`
  background-color: #f9f9f9;
  
  td {
    padding-top: 20px;
    
    &:nth-child(5) {
      font-weight: 600;
    }
  }
`;

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(id, 'Customer requested cancellation');
        // Refresh order data
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
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
  
  if (loading) {
    return (
      <MainLayout>
        <OrderDetailContainer>
          <p>Loading order details...</p>
        </OrderDetailContainer>
      </MainLayout>
    );
  }
  
  if (!order) {
    return (
      <MainLayout>
        <OrderDetailContainer>
          <p>Order not found or you don't have permission to view it.</p>
          <BackLink to="/orders">
            <FaArrowLeft /> Back to Orders
          </BackLink>
        </OrderDetailContainer>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <OrderDetailContainer>
        <BackLink to="/orders">
          <FaArrowLeft /> Back to Orders
        </BackLink>
        
        <OrderHeader>
          <div>
            <OrderTitle>
              Order Details <OrderNumber>#{order.orderNumber}</OrderNumber>
            </OrderTitle>
          </div>
          
          <ActionButtons>
            <Button variant="outline" size="small">
              <FaFileDownload /> Download Invoice
            </Button>
            {(order.status === 'pending' || order.status === 'processing') && (
              <Button 
                variant="outline" 
                size="small"
                onClick={handleCancelOrder}
              >
                <FaTimesCircle /> Cancel Order
              </Button>
            )}
          </ActionButtons>
        </OrderHeader>
        
        <CardContainer>
          <CardHeader>
            <h2>Order Information</h2>
          </CardHeader>
          <CardBody>
            <OrderInfo>
              <InfoSection>
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> #{order.orderNumber}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <StatusBadge status={order.status.toLowerCase()}>
                    {getStatusText(order.status)}
                  </StatusBadge>
                </p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              </InfoSection>
              
              <InfoSection>
                <h3>Shipping Address</h3>
                <p>{order.shipping?.firstName} {order.shipping?.lastName}</p>
                <p>{order.shipping?.address}</p>
                <p>{order.shipping?.city}, {order.shipping?.postalCode}</p>
                <p>{order.shipping?.country}</p>
              </InfoSection>
              
              <InfoSection>
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {order.customer?.email}</p>
                <p><strong>Phone:</strong> {order.customer?.phone}</p>
              </InfoSection>
            </OrderInfo>
            
            <ProductsTable>
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <ProductImage src={item.image} alt={item.name} />
                      </td>
                      <td>
                        <ProductName to={`/products/${item.productId}`}>
                          {item.name}
                        </ProductName>
                      </td>
                      <td>{item.price}đ</td>
                      <td>{item.quantity}</td>
                      <td>{item.price * item.quantity}đ</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" align="right">Subtotal:</td>
                    <td>{order.subtotal}đ</td>
                  </tr>
                  <tr>
                    <td colSpan="4" align="right">Shipping:</td>
                    <td>{order.shipping ? order.shipping.cost : 0}đ</td>
                  </tr>
                  {order.discount > 0 && (
                    <tr>
                      <td colSpan="4" align="right">Discount:</td>
                      <td>-{order.discount}đ</td>
                    </tr>
                  )}
                  <SubtotalRow>
                    <td colSpan="4" align="right"><strong>Total:</strong></td>
                    <td>{order.total}đ</td>
                  </SubtotalRow>
                </tbody>
              </Table>
            </ProductsTable>
          </CardBody>
        </CardContainer>
        
        {order.notes && (
          <CardContainer>
            <CardHeader>
              <h2>Additional Notes</h2>
            </CardHeader>
            <CardBody>
              <p>{order.notes}</p>
            </CardBody>
          </CardContainer>
        )}
      </OrderDetailContainer>
    </MainLayout>
  );
};

export default OrderDetail;