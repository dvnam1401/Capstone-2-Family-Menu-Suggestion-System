import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/common/ProductCard/ProductCard';
import Pagination from '../components/common/Pagination/Pagination';
import productService from '../services/productService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CategoryHeader = styled.div`
  margin-bottom: 30px;
`;

const CategoryTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const CategoryDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #666;
`;

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryData = await productService.getCategoryById(id);
        setCategory(categoryData);
        
        // Fetch products by category
        const data = await productService.getProductsByCategory(id, {
          page: currentPage,
          limit: 12
        });
        
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to fetch category products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryAndProducts();
  }, [id, currentPage]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  if (loading && !category) {
    return (
      <MainLayout>
        <Container>
          <p>Loading category...</p>
        </Container>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Container>
        <CategoryHeader>
          <CategoryTitle>{category?.name || 'Category'}</CategoryTitle>
          <CategoryDescription>{category?.description}</CategoryDescription>
        </CategoryHeader>
        
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <>
            <ProductGrid>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <NoProducts>
            <p>No products found in this category.</p>
          </NoProducts>
        )}
      </Container>
    </MainLayout>
  );
};

export default CategoryProducts;