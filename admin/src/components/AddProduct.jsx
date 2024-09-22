import { useState } from 'react'; 
import upload_area from '../assets/assets/upload_area.svg';
import { MdAdd } from 'react-icons/md';

const AddProduct = () => {
  const [ProductDetails, setProductDetails] = useState({
    name: '',
    image: null,
    category: 'women',
    new_price: '',
    old_price: '',
  });

  // Handle image input
  const imageHandler = (e) => {
    const file = e.target.files[0];
    setProductDetails({ ...ProductDetails, image: file });
  };

  // Handle text input changes
  const changeHandler = (e) => {
    setProductDetails({ ...ProductDetails, [e.target.name]: e.target.value });
  };

  // Function to add the product
  const Add_Product = async () => {
    let responseData;
    const product = ProductDetails;

    let formData = new FormData();
    formData.append('name', product.name);
    formData.append('image', product.image);

    try {
      const imageUploadResponse = await fetch('http://localhost:5000/products', { 
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      responseData = await imageUploadResponse.json();

      if (responseData.success) {
        product.image = responseData.image_url;

        const productResponse = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        const productData = await productResponse.json();

        if (productData.success) {
          alert("Product Added");
        } else {
          alert("Upload Failed");
        }
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error occurred while adding the product.");
    }
  };

  return (
    <div className='p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7'>
      {/* Product title */}
      <div className='mb-3'>
        <h4 className='text-lg font-bold pb-2'>Product title:</h4>
        <input
          value={ProductDetails.name}
          onChange={changeHandler}
          type="text"
          name='name'
          placeholder='Type here..'
          className='bg-primary outline-none max-w-full w-full py-3 px-4 rounded-md'
        />
      </div>

      {/* Price */}
      <div className='mb-3'>
        <h4 className='text-lg font-bold pb-2'>Price:</h4>
        <input
          value={ProductDetails.old_price}
          onChange={changeHandler}
          type="number"
          name='old_price'
          placeholder='Type here..'
          className='bg-primary outline-none max-w-full w-full py-3 px-4 rounded-md'
        />
      </div>

      {/* Offer Price */}
      <div className='mb-3'>
        <h4 className='text-lg font-bold pb-2'>Offer price:</h4>
        <input
          value={ProductDetails.new_price}
          onChange={changeHandler}
          type="number"
          name='new_price'
          placeholder='Type here..'
          className='bg-primary outline-none max-w-full w-full py-3 px-4 rounded-md'
        />
      </div>

      {/* Product Category */}
      <div className='mb-3 flex items-center gap-x-4'>
        <h4 className='bold-18 pb-2'>Product Category:</h4>
        <select
          value={ProductDetails.category}
          onChange={changeHandler}
          name="category"
          className="bg-primary w-full py-3 px-4 rounded-md"
        >
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Kid">Kid</option>
        </select>
      </div>

      {/* Image Upload */}
      <div className='mb-3'>
        <h4 className='text-lg font-bold pb-2'>Product Image:</h4>
        <label htmlFor='file-input' className='cursor-pointer'>
          <img 
            src={ProductDetails.image ? URL.createObjectURL(ProductDetails.image) : upload_area} 
            alt="upload" 
            className='w-20 rounded-sm inline-block' 
          />
        </label>
        <input 
          onChange={imageHandler} 
          type="file" 
          name='image' 
          id='file-input' 
          hidden 
        />
      </div>

      {/* Add Product Button */}
      <button onClick={Add_Product} className='btn_dark_rounded mt-4 flexCenter gap-x-1'>
        <MdAdd /> Add Product
      </button>
    </div>
  );
};

export default AddProduct;
