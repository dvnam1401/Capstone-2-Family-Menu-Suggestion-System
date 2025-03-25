// src/services/mockService.js
import products from '../mock/products';
import categories from '../mock/categories';

// Simulated delay to mimic API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockService = {
  getProducts: async (params = {}) => {
    await delay(500);
    
    let result = [...products];
    
    // Filter by category
    if (params.category) {
      result = result.filter(product => product.categoryId === parseInt(params.category));
    }
    
    // Filter by search query
    if (params.query) {
      const query = params.query.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    if (params.minPrice) {
      result = result.filter(product => 
        (product.discountPrice || product.originalPrice) >= params.minPrice
      );
    }
    if (params.maxPrice) {
      result = result.filter(product => 
        (product.discountPrice || product.originalPrice) <= params.maxPrice
      );
    }
    
    // Sort products
    if (params.sort) {
      switch (params.sort) {
        case 'price-asc':
          result.sort((a, b) => 
            (a.discountPrice || a.originalPrice) - (b.discountPrice || b.originalPrice)
          );
          break;
        case 'price-desc':
          result.sort((a, b) => 
            (b.discountPrice || b.originalPrice) - (a.discountPrice || a.originalPrice)
          );
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }
    
    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    return {
      products: result.slice(startIndex, endIndex),
      total: result.length,
      page: parseInt(page),
      totalPages: Math.ceil(result.length / limit)
    };
  },
  
  getProductById: async (id) => {
    await delay(300);
    
    const product = products.find(p => p.id === parseInt(id));
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  },
  
  getProductBySlug: async (slug) => {
    await delay(300);
    
    const product = products.find(p => p.slug === slug);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  },
  
  getFeaturedProducts: async () => {
    await delay(500);
    
    // Return a random selection of products as "featured"
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  },
  
  getCategories: async () => {
    await delay(300);
    
    return categories;
  },
  
  getCategoryById: async (id) => {
    await delay(200);
    
    const category = categories.find(c => c.id === parseInt(id));
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    return category;
  },
  
  getCategoryBySlug: async (slug) => {
    await delay(200);
    
    const category = categories.find(c => c.slug === slug);
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    return category;
  },
  
  searchProducts: async (query, params = {}) => {
    await delay(500);
    
    if (!query) {
      return {
        products: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    }
    
    return mockService.getProducts({
      ...params,
      query
    });
  }
};

export default mockService;