import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from './../Context/CategoryContext';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { setSelectedCategoryId } = useContext(CategoryContext);
  const navigate = useNavigate(); // Use the navigate hook

  async function getCategories() {
    try {
      const res = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
      setCategories(res.data.data);
      setLoading(false); // Stop loading once data is fetched
      console.log(res.data.data);
    } catch (error) {
      console.log("Error in fetching data");
      setLoading(false); // Stop loading even if there's an error
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    console.log("Selected Category ID:", categoryId);
    setSelectedCategoryId(categoryId); // Set the category ID in context
    navigate(`/subcategories`); // Navigate to the subcategory page
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="spinner m-auto">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap flex-row m-16 ml-52">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="w-1/5 m-2 ml-5 mr-5 mb-12 item"
              onClick={() => handleCategoryClick(category._id)} // Trigger the click event
            >
              <div className="overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-96 object-cover" 
                />
              </div>
              <h3 className="text-center mt-2 text-2xl font-bold text-gray-900 mb-7">{category.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
