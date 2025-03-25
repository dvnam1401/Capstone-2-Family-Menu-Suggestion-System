
// src/pages/ProductDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar, FaShoppingCart, FaHeart, FaShareAlt, FaMinus, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button/Button';
import ProductCard from '../components/common/ProductCard/ProductCard';
import { CartContext } from '../context/CartContext';
import productService from '../services/productService';

const ProductContainer = styled.div`
  margin-bottom: 40px;
`;

const BreadcrumbNav = styled.nav`
  margin-bottom: 20px;
  
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-right: 5px;
      
      &:after {
        content: '/';
        margin-left: 5px;
        color: #999;
      }
      
      &:last-child:after {
        content: '';
      }
      
      a {
        color: #666;
        text-decoration: none;
        
        &:hover {
          color: #4CAF50;
        }
      }
      
      &:last-child a {
        color: #333;
        font-weight: 500;
      }
    }
  }
`;

const ProductDetailLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 20px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Thumbnails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 480px) {
    flex-direction: row;
    order: 2;
  }
  
  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid transparent;
    
    &.active {
      border-color: #4CAF50;
    }
  }
`;

const MainImage = styled.div`
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div``;

const ProductTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0 0 15px;
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  .rating {
    display: flex;
    align-items: center;
    
    svg {
      color: #FFD700;
      margin-right: 2px;
    }
    
    span {
      margin-left: 5px;
      color: #666;
    }
  }
  
  .divider {
    margin: 0 15px;
    color: #ddd;
  }
  
  .stock {
    color: ${props => props.inStock ? '#4CAF50' : '#d32f2f'};
  }
`;

const ProductPrice = styled.div`
  margin-bottom: 20px;
  
  .current {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
  }
  
  .original {
    margin-left: 10px;
    font-size: 1.2rem;
    color: #999;
    text-decoration: line-through;
  }
  
  .discount {
    display: inline-block;
    margin-left: 10px;
    padding: 3px 8px;
    background-color: #FF8C00;
    color: white;
    border-radius: 4px;
    font-size: 0.9rem;
  }
`;

const ProductDescription = styled.div`
  margin-bottom: 20px;
  line-height: 1.6;
  color: #666;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    cursor: pointer;
    
    &:hover {
      background-color: #eee;
    }
    
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
    
    &:last-child {
      border-radius: 0 4px 4px 0;
    }
  }
  
  input {
    width: 60px;
    height: 36px;
    text-align: center;
    border: 1px solid #ddd;
    border-left: none;
    border-right: none;
    
    &:focus {
      outline: none;
    }
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
  button {
    flex: 1;
  }
`;

const ProductTabs = styled.div`
  margin-top: 40px;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#4CAF50' : 'transparent'};
  color: ${props => props.active ? '#4CAF50' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #4CAF50;
  }
`;

const TabContent = styled.div`
  line-height: 1.6;
`;

const RelatedProducts = styled.div`
  margin-top: 60px;
`;

const ReviewSection = styled.div`
  margin-top: 20px;
`;

const Review = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  .user {
    font-weight: 600;
  }
  
  .date {
    color: #999;
    font-size: 0.9rem;
  }
`;

const ReviewRating = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  svg {
    color: #FFD700;
    margin-right: 2px;
  }
`;

const ReviewContent = styled.p`
  margin: 0;
  color: #666;
`;

const Accordion = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const AccordionHeader = styled.div`
  padding: 15px;
  background-color: #f9f9f9;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
`;

const AccordionContent = styled.div`
  padding: ${props => props.open ? '15px' : '0 15px'};
  max-height: ${props => props.open ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 15px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: #4CAF50;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        setActiveImage(0);
        
        // Fetch related products
        const related = await productService.getProducts({ 
          category: data.categoryId,
          limit: 4,
          exclude: data.id
        });
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const toggleFaq = (index) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  if (loading) {
    return (
      <MainLayout>
        <p>Loading product details...</p>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <p>Product not found</p>
      </MainLayout>
    );
  }
  
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100) 
    : 0;
  
  return (
    <MainLayout>
      <ProductContainer>
        <BreadcrumbNav>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to={`/categories/${product.categoryId}`}>{product.category}</Link></li>
            <li><Link to="#">{product.name}</Link></li>
          </ul>
        </BreadcrumbNav>
        
        <ProductDetailLayout>
          <ImageGallery>
            <Thumbnails>
              {product.images.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`${product.name} - thumbnail ${index + 1}`}
                  className={index === activeImage ? 'active' : ''}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </Thumbnails>
            <MainImage>
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
              />
            </MainImage>
          </ImageGallery>
          
          <ProductInfo>
            <ProductTitle>{product.name}</ProductTitle>
            <ProductMeta inStock={product.inStock}>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < Math.floor(product.rating) ? "#FFD700" : "#e4e5e9"} />
                ))}
                <span>({product.reviewCount})</span>
              </div>
              <span className="divider">|</span>
              <div className="stock">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </ProductMeta>
            
            <ProductPrice>
              <span className="current">{product.discountPrice || product.originalPrice}đ</span>
              {product.discountPrice && (
                <>
                  <span className="original">{product.originalPrice}đ</span>
                  <span className="discount">{discountPercentage}% OFF</span>
                </>
              )}
            </ProductPrice>
            
            <ProductDescription>
              {product.shortDescription}
            </ProductDescription>
            
            <QuantitySelector>
              <button onClick={decreaseQuantity}>
                <FaMinus />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button onClick={increaseQuantity}>
                <FaPlus />
              </button>
            </QuantitySelector>
            
            <ActionsRow>
              <Button 
                variant="primary" 
                size="large" 
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Thêm vào giỏ hàng
              </Button>
              <Button variant="outline">
                <FaHeart />
              </Button>
              <Button variant="outline">
                <FaShareAlt />
              </Button>
            </ActionsRow>
            
            {/* Product specifications */}
            <div>
              {product.specifications && product.specifications.map((spec, index) => (
                <Accordion key={index}>
                  <AccordionHeader onClick={() => toggleFaq(index)}>
                    {spec.name}
                    {expandedFaqs[index] ? <FaChevronUp /> : <FaChevronDown />}
                  </AccordionHeader>
                  <AccordionContent open={expandedFaqs[index]}>
                    {spec.value}
                  </AccordionContent>
                </Accordion>
              ))}
            </div>
          </ProductInfo>
        </ProductDetailLayout>
        
        <ProductTabs>
          <TabButtons>
            <TabButton 
              active={activeTab === 'description'} 
              onClick={() => setActiveTab('description')}
            >
              Mô tả
            </TabButton>
            <TabButton 
              active={activeTab === 'reviews'} 
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá ({product.reviewCount})
            </TabButton>
            <TabButton 
              active={activeTab === 'shipping'} 
              onClick={() => setActiveTab('shipping')}
            >
              Thông tin vận chuyển
            </TabButton>
          </TabButtons>
          
          <TabContent>
            {activeTab === 'description' && (
              <div>
                {product.description}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <ReviewSection>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <Review key={index}>
                      <ReviewHeader>
                        <span className="user">{review.user}</span>
                        <span className="date">{review.date}</span>
                      </ReviewHeader>
                      <ReviewRating>
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < review.rating ? "#FFD700" : "#e4e5e9"} />
                        ))}
                      </ReviewRating>
                      <ReviewContent>{review.content}</ReviewContent>
                    </Review>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}
              </ReviewSection>
            )}
            
            {activeTab === 'shipping' && (
              <div>
                <p>Shipping information for this product:</p>
                <ul>
                  <li>Free shipping for orders over 200.000đ</li>
                  <li>Standard shipping: 2-3 business days</li>
                  <li>Express shipping: 1 business day (additional fee)</li>
                  <li>Returns accepted within 30 days of purchase</li>
                </ul>
              </div>
            )}
          </TabContent>
        </ProductTabs>
        
        <RelatedProducts>
          <SectionTitle>Sản phẩm liên quan</SectionTitle>
          <ProductGrid>
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </RelatedProducts>
      </ProductContainer>
    </MainLayout>
  );
};

export default ProductDetail;