// src/layouts/AdminLayout.js
import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaShoppingCart, 
  FaBoxes, 
  FaTags, 
  FaCogs, 
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: #0A2342;
  color: #fff;
  transition: all 0.3s;
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1000;
  
  @media (min-width: 992px) {
    transform: translateX(0);
    position: relative;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h2 {
    margin: 0;
    color: #fff;
    font-size: 1.5rem;
  }
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarMenuItem = styled.li`
  a {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.3s;
    
    &:hover, &.active {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-left-color: #4CAF50;
    }
    
    svg {
      margin-right: 10px;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  margin-left: ${({ sidebarOpen }) => sidebarOpen ? '0' : '0'};
  transition: all 0.3s;
  width: 100%;
  
  @media (min-width: 992px) {
    margin-left: 0;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const MenuToggle = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  display: block;
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  
  span {
    margin-right: 10px;
  }
  
  button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    
    &:hover {
      color: #333;
    }
    
    svg {
      margin-left: 5px;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };
  
  return (
    <AdminContainer>
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <h2>Admin Panel</h2>
        </SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              <FaTachometerAlt /> Dashboard
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/admin/users" className={location.pathname.startsWith('/admin/users') ? 'active' : ''}>
              <FaUsers /> User Management
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/admin/orders" className={location.pathname.startsWith('/admin/orders') ? 'active' : ''}>
              <FaShoppingCart /> Orders
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/admin/products" className={location.pathname.startsWith('/admin/products') ? 'active' : ''}>
              <FaBoxes /> Products
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/admin/categories" className={location.pathname.startsWith('/admin/categories') ? 'active' : ''}>
              <FaTags /> Categories
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/admin/settings" className={location.pathname.startsWith('/admin/settings') ? 'active' : ''}>
              <FaCogs /> Settings
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
      
      <Overlay isOpen={sidebarOpen} onClick={closeSidebar} />
      
      <MainContent sidebarOpen={sidebarOpen}>
        <TopBar>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MenuToggle onClick={toggleSidebar}>
              <FaBars />
            </MenuToggle>
            <PageTitle>{title}</PageTitle>
          </div>
          <UserInfo>
            <span>Welcome, {currentUser?.name || 'Admin'}</span>
            <button onClick={handleLogout}>
              Logout <FaSignOutAlt />
            </button>
          </UserInfo>
        </TopBar>
        
        {children}
      </MainContent>
    </AdminContainer>
  );
};

export default AdminLayout;