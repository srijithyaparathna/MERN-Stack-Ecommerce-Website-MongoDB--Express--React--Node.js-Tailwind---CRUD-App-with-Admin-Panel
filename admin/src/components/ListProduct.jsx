import { useState, useEffect } from 'react';
import { TbTrash } from 'react-icons/tb'; // Assuming you're using this icon

const ListProduct = () => {
  const [allproducts, setAllproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/allproducts');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setAllproducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;

    try {
      const response = await fetch('http://localhost:5000/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to remove product');
      await fetchInfo(); // Refetch products after removal
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-2 box-border bg-white mb-0 rounded-sm mt-4 sm:p-4 sm:m-7">
      <h4 className="bold-22 p-5 uppercase">Products List</h4>
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12">
              <th className="p-2">Products</th>
              <th className="p-2">Title</th>
              <th className="p-2">Old Price</th>
              <th className="p-2">New Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {allproducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No products available.</td>
              </tr>
            ) : (
              allproducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-900/20 text-gray-900 p-6 medium-14">
                  <td className="flexStart sm:flexCenter">
                    <img
                      src={product.image}
                      alt={product.name}
                      height={43}
                      width={43}
                      className="rounded-lg ring-1 ring-slate-900/5 my-1"
                    />
                  </td>
                  <td>
                    <div className="line-clamp-3">{product.name}</div>
                  </td>
                  <td>${product.old_price}</td>
                  <td>${product.new_price}</td>
                  <td>{product.category}</td>
                  <td>
                    <div className="bold-22 pl-6 sm:pl-14">
                      <TbTrash onClick={() => remove_product(product.id)} className="cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;
