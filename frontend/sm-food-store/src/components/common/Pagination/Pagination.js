import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  margin: 0 4px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.active ? '#4CAF50' : '#ddd'};
  background-color: ${props => props.active ? '#4CAF50' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.active ? '#4CAF50' : '#4CAF50'};
    background-color: ${props => props.active ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #ddd;
    background-color: #f9f9f9;
    
    &:hover {
      background-color: #f9f9f9;
      border-color: #ddd;
    }
  }
`;

const PageInfo = styled.span`
  margin: 0 15px;
  color: #666;
  font-size: 14px;
`;

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5
}) => {
  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first and last page
      // Show pages around current page
      const leftSide = Math.floor(maxVisiblePages / 2);
      const rightSide = Math.ceil(maxVisiblePages / 2) - 1;
      
      // Calculate start and end page
      let startPage = Math.max(1, currentPage - leftSide);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust if we're at the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Add first page if needed
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add last page if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers.map((page, index) => {
      if (page === '...') {
        return <PageInfo key={`ellipsis-${index}`}>...</PageInfo>;
      }
      
      return (
        <PageButton 
          key={page} 
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </PageButton>
      );
    });
  };

  return (
    <PaginationContainer>
      <PageButton 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <FaChevronLeft />
      </PageButton>
      
      {showPageNumbers ? (
        renderPageNumbers()
      ) : (
        <PageInfo>
          {currentPage} / {totalPages}
        </PageInfo>
      )}
      
      <PageButton 
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <FaChevronRight />
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;