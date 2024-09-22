import { useState, useEffect } from 'react'; // Don't forget to import useState and useEffect
import Item from './Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]); // State to store popular products

  useEffect(() => {
    fetch("http://localhost:4000/popularproducts")
      .then((response) => response.json())
      .then((data) => setPopularProducts(data)) // Set the fetched data
      .catch((error) => console.error("Error fetching popular products:", error)); // Add error handling
  }, []);

  return (
    <section className='bg-primary'>
      <div className='max_padd_container py-12 xl:py-28 xl:w-[88%]'>
        <h3 className='h3 text-center'>Popular Products</h3>
        <hr className='h-[3px] md:w-1/2 mx-auto bg-gradient-to-l from-transparent via-black to-transparent mb-16' />
        
        {/* Container */}
        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
          {popularProducts.length > 0 ? (
            popularProducts.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                image={item.image}
                name={item.name}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            ))
          ) : (
            <p>Loading popular products...</p> // Optional: Show a loading message
          )}
        </div>
      </div>
    </section>
  );
};

export default Popular;
