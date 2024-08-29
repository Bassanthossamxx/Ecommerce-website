import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from './../Context/ProductIDcontext';
import { ProductWishlistContext } from './../Context/ProductWishlistContext';
import { CartContext } from './../Context/CartContext';  // Import CartContext

export default function Product() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state
  const { setSelectedProductId } = useContext(ProductContext);
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(ProductWishlistContext);
  const { addToCart, removeFromCart, isProductInCart } = useContext(CartContext); // Use CartContext
  const navigate = useNavigate();

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
        setProducts(response.data.data);
        setFilteredProducts(response.data.data); // Initially show all products
        setLoading(false); // Data has been loaded
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false); // Stop loading on error
      }
    }

    getProducts();
  }, []);

  const handleSearchInputChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    // Filter products by title as user types
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId); // Set the selected product ID in context
    navigate('/productdetails'); // Navigate to the ProductDetails page
  };

  const handleWishlistClick = (productId) => {
    if (isProductInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleCartClick = (e, product) => {
    e.stopPropagation(); // Prevent triggering the product click event
    const { id, price, title, imageCover } = product;
    if (isProductInCart(id)) {
      removeFromCart(id);
    } else {
      addToCart(id, 1, price, title, imageCover); // Add product to cart
    }
  };

  return (
    <>
      <div className="sbar">
        <div className="sbar-section">
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchInputChange} 
          />
          <button className="search-button">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      {/* Display the spinner while loading */}
      {loading ? (
        <div className="spinner m-auto">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : (
        <div className="row w-[85%] m-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                className="w-1/5 cursor-pointer"
                key={product.id}
                onClick={() => handleProductClick(product.id)} // Handle product click
              >
                <div className="product mr-3 mb-5 ml-7">
                  <img src={product.imageCover} alt={product.title} className="w-full" />
                  <div className="flex flex-row justify-between mt-3">
                    <h3 className="text-green-500 text-base mb-3">{product.category.name}</h3>
                    <span
                      className={`fa-solid fa-heart text-2xl cursor-pointer ${
                        isProductInWishlist(product.id) ? 'text-red-500' : 'text-gray-900'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the product click event
                        handleWishlistClick(product.id);
                      }}
                    ></span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    {product.title.split(' ').slice(0, 2).join(' ')}
                  </h4>
                  <div className="flex flex-row justify-between mt-3">
                    <span>{product.price} EGP</span>
                    <span>
                      <span className="fa-solid fa-star text-yellow-400 mr-2"></span>
                      {product.ratingsAverage}
                    </span>
                  </div>
                </div>
                <button
                  className={`w-3/4 text-center ml-10 mb-4 py-2 text-white transition-colors duration-300 ease-in-out rounded ${
                    isProductInCart(product.id) ? 'bg-red-500 hover:bg-red-700' : 'bg-green-600 hover:bg-green-800'
                  }`}
                  onClick={(e) => handleCartClick(e, product)}
                >
                  {isProductInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </div>
            ))
          ) : (
            <p>No products found.</p> 
          )}
        </div>
      )}
    </>
  );
}
