// src/components/common/Header/Header.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaSearch, FaUser, FaPhoneAlt } from 'react-icons/fa';
import { CartContext } from '../../../context/CartContext';
import { AuthContext } from '../../../context/AuthContext';
import logo from '../../../assets/images/logo.png';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 5%;
  border-bottom: 1px solid #f1f1f1;
`;

const Logo = styled.div`
  img {
    height: 40px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex: 1;
  max-width: 600px;
  margin: 0 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  outline: none;
  &:focus {
    border-color: #4CAF50;
  }
`;

const SearchButton = styled.button`
  background: #fff;
  border: 1px solid #ddd;
  border-left: none;
  padding: 0 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  &:hover {
    background: #f8f8f8;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 0.9rem;
  color: #666;
  svg {
    margin-right: 8px;
    color: #4CAF50;
  }
`;

const ActionItems = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  &:hover {
    color: #4CAF50;
  }
  svg {
    margin-right: 5px;
  }
`;

const CartBadge = styled.span`
  background-color: #4CAF50;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  margin-left: 5px;
`;

const NavBar = styled.nav`
  display: flex;
  padding: 0 5%;
`;

const NavLink = styled(Link)`
  padding: 15px 20px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  &:hover, &.active {
    color: #4CAF50;
  }
`;

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <HeaderContainer>
      <TopBar>
        <Logo>
          <Link to="/">
            <img src={logo} alt="SM Food Store" />
          </Link>
        </Logo>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton onClick={handleSearch}>
            <FaSearch />
          </SearchButton>
        </SearchContainer>
        <ContactInfo>
          <FaPhoneAlt />
          <span>(+91) 111-111-1111</span>
        </ContactInfo>
        <ActionItems>
          <ActionButton to={isAuthenticated ? "/account" : "/login"}>
            <FaUser />
            {isAuthenticated ? "Tài khoản" : "Login/Register"}
          </ActionButton>
          <ActionButton to="/cart">
            <FaShoppingCart />
            Giỏ hàng
            {cart.items.length > 0 && <CartBadge>{cart.items.length}</CartBadge>}
          </ActionButton>
        </ActionItems>
      </TopBar>
      <NavBar>
        <NavLink to="/">Trang chủ</NavLink>
        <NavLink to="/categories">Các loại thực phẩm</NavLink>
        <NavLink to="/promotions">Giảm giá</NavLink>
        <NavLink to="/about">Thông tin về chúng tôi</NavLink>
      </NavBar>
    </HeaderContainer>
  );
};

export default Header;