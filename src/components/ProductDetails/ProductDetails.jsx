import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ProductContext } from './../Context/ProductIDcontext';
import { ProductWishlistContext } from './../Context/ProductWishlistContext';
import { CartContext } from './../Context/CartContext'; // Import CartContext

export default function ProductDetails() {
  const { selectedProductId } = useContext(ProductContext);
  const { wishlist, addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(ProductWishlistContext);
  const { addToCart, removeFromCart, isProductInCart } = useContext(CartContext); // Use CartContext
  const [productDetails, setProductDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (selectedProductId) {
      axios.get(`https://ecommerce.routemisr.com/api/v1/products/${selectedProductId}`)
        .then((res) => {
          setProductDetails(res.data.data);
        })
        .catch((error) => {
          console.log("Error in fetching product details");
        });
    }
  }, [selectedProductId]);

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productDetails.images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === productDetails.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleWishlistClick = () => {
    if (isProductInWishlist(selectedProductId)) {
      removeFromWishlist(selectedProductId);
    } else {
      addToWishlist(selectedProductId);
    }
  };

  const handleCartClick = () => {
    if (productDetails) {
      const { id, price, title, imageCover } = productDetails;
      if (isProductInCart(id)) {
        removeFromCart(id);
      } else {
        addToCart(id, 1, price, title, imageCover); // Add product to cart with necessary details
      }
    }
  };

  return (
    <div>
      {productDetails ? (
        <div className="flex flex-wrap">
          <div className="relative">
            <img
              src={productDetails.images[currentImageIndex]}
              alt={`Product image ${currentImageIndex + 1}`}
              className="w-full imagedet"
            />
            <button
              onClick={previousImage}
              className="absolute top-1/2 lefttag transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            >
              {"<"}
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 righttag transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full ml-40"
            >
              {">"}
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {productDetails.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full cursor-pointer ${index === currentImageIndex ? 'bg-gray-800' : 'bg-gray-400'}`}
                  onClick={() => goToImage(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className="details mt-56 ml-44">
            <h1 className="text-4xl font-bold text-gray-900"> 
              {productDetails.title.split(' ').slice(0, 4).join(' ')}
            </h1>
            <p className="font-base text-gray-700 mt-4 text-lg">
              {productDetails.description.split(' ').slice(0, 8).join(' ')}
            </p>
            <div className="flex flex-row justify-between mt-3">
              <span className="text-xl">{productDetails.price} EGP</span>
              <span className="text-xl">
                <span className="fa-solid fa-star text-yellow-400 mr-2 text-xl"></span>
                {productDetails.ratingsAverage}
              </span>
            </div>
            <div className="flex flex-row justify-between mt-6">
              <button
                className={`w-4/5 text-center ml-10 mb-4 py-2 text-white transition-colors duration-300 ease-in-out rounded ${
                  isProductInCart(productDetails.id) ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'
                }`}
                onClick={handleCartClick}
              >
                {isProductInCart(productDetails.id) ? 'Remove from Cart' : 'Add to Cart'}
              </button>
              <span
                className={`fa-solid fa-heart text-2xl cursor-pointer ${isProductInWishlist(selectedProductId) ? 'text-red-500' : 'text-gray-900'}`}
                onClick={handleWishlistClick}
              ></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="spinner m-auto">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      )}
    </div>
  );
}
