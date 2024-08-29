import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from './../Context/ProductIDcontext';
import { CartContext } from './../Context/CartContext';
import { ProductWishlistContext } from './../Context/ProductWishlistContext';

export default function Recent() {
  const [products, setProducts] = useState([]);
  const { setSelectedProductId } = useContext(ProductContext);
  const { addToCart, removeFromCart, isProductInCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(ProductWishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('https://ecommerce.routemisr.com/api/v1/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    navigate('/productdetails');
  };

  const handleWishlistClick = (e, productId) => {
    e.stopPropagation();
    if (isProductInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleCartClick = (e, product) => {
    e.stopPropagation();
    const { id, price, title, imageCover } = product;
    if (isProductInCart(id)) {
      removeFromCart(id);
    } else {
      addToCart(id, 1, price, title, imageCover); // Pass all necessary details
    }
  };

  return (
    <div className="row w-[85%] m-auto">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            className="w-1/5 cursor-pointer hover:bg-gray-100 transition-colors duration-300 ease-in-out rounded-lg"
            key={product.id}
            onClick={() => handleProductClick(product.id)}
          >
            <div className="product mr-3 mb-5 ml-7">
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full rounded-lg hover:opacity-90 transition-opacity duration-300 ease-in-out"
              />
              <div className="flex flex-row justify-between mt-3">
                <h3 className="text-green-500 text-base mb-3 hover:text-green-800">
                  {product.category.name}
                </h3>
                <span
                  className={`fa-solid fa-heart text-2xl cursor-pointer ${
                    isProductInWishlist(product.id) ? 'text-red-500' : 'text-gray-800'
                  }`}
                  onClick={(e) => handleWishlistClick(e, product.id)}
                ></span>
              </div>
              <h4 className="font-semibold text-gray-900 hover:text-gray-800">
                {product.title.split(' ').slice(0, 2).join(' ')}
              </h4>
              <div className="flex flex-row justify-between mt-3">
                <span className="hover:text-gray-800">{product.price} EGP</span>
                <div>
                  <span className="fa-solid fa-star text-yellow-400 ml-3 hover:text-yellow-500"></span>
                  {product.ratingsAverage}
                </div>
              </div>
            </div>
            <button
              className={`w-3/4 text-center ml-9 mb-4 py-2 text-white transition-colors duration-300 ease-in-out rounded ${
                isProductInCart(product.id)
                  ? 'bg-red-500 hover:bg-red-800'
                  : 'bg-green-600 hover:bg-green-800'
              }`}
              onClick={(e) => handleCartClick(e, product)}
            >
              {isProductInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
            </button>
          </div>
        ))
      ) : (
        <div className="spinner m-auto">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      )}
    </div>
  );
}
