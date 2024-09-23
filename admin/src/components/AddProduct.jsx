import { useState } from 'react';
import upload_area from '../assets/assets/upload_area.svg';
import { MdAdd } from 'react-icons/md';

const AddProduct = () => {
  const [ProductDetails, setProductDetails] = useState({
    name: '',
    image: null,
    category: 'Women', // Default to 'Women' for consistency
    new_price: '',
    old_price: '',
  });

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setProductDetails({ ...ProductDetails, image: file });
  };

  const changeHandler = (e) => {
    setProductDetails({ ...ProductDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    const { name, category, new_price, old_price, image } = ProductDetails;

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append('product', image); // Change 'image' to 'product' to match backend

    try {
      const imageUploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const responseData = await imageUploadResponse.json();

      if (imageUploadResponse.ok && responseData.success) {
        const product = {
          name,
          image: responseData.image_url,
          category,
          new_price: parseFloat(new_price), // Convert to number
          old_price: parseFloat(old_price), // Convert to number
        };

        const productResponse = await fetch('http://localhost:5000/addproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        const productData = await productResponse.json();

        if (productResponse.ok && productData.success) {
          alert("Product Added Successfully");
          // Reset form after successful addition
          setProductDetails({
            name: '',
            image: null,
            category: 'Women',
            new_price: '',
            old_price: '',
          });
        } else {
          alert("Upload Failed: " + productData.message);
        }
      } else {
        alert("Image upload failed: " + (responseData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error occurred while adding the product: " + error.message);
    }
  };

  return (
    <div className='p-8 box-border bg-white w-full rounded-sm mt-4 lg:m-7'>
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

      <div className='mb-3'>
        <h4 className='text-lg font-bold pb-2'>Old Price:</h4>
        <input
          value={ProductDetails.old_price}
          onChange={changeHandler}
          type="number"
          name='old_price'
          placeholder='Type here..'
          className='bg-primary outline-none max-w-full w-full py-3 px-4 rounded-md'
        />
      </div>

      <div className='mb-3'>
        <h4 className='text-lg font-bold pb-2'>New Price:</h4>
        <input
          value={ProductDetails.new_price}
          onChange={changeHandler}
          type="number"
          name='new_price'
          placeholder='Type here..'
          className='bg-primary outline-none max-w-full w-full py-3 px-4 rounded-md'
        />
      </div>

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
          accept="image/*" // Allow only image files
        />
      </div>

      <button onClick={Add_Product} className='btn_dark_rounded mt-4 flexCenter gap-x-1'>
        <MdAdd /> Add Product
      </button>
    </div>
  );
};

export default AddProduct;
