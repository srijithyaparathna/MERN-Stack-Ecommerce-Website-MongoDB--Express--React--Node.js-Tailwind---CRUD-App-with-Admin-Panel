import { Link } from 'react-router-dom';
import addProduct from '../assets/assets/addproduct.png'; // Ensure the path is correct
import listProduct from '../assets/assets/productlist.png'; // Ensure the path is correct

const Sidebar = () => {
  return (
    //lg:h-screen 
    <div className='py-7 justify-center gap-x-1 gap-y-5 w-full bg-blue-600 sm:gap-x-4 lg:flex-col lg:pt-20 lg:h-screen  lg:max-w-60 lg:justify-start lg:pl-6'>
      <Link to='addproduct'>
        <button className='flexCenter gap-2 rounded-md bg-primary h-14 w-44 medium-14 sm:medium-16 mb-5'>
          <img src={addProduct} alt="Add Product" height={55} width={55} />
          <span>Add Product</span>
        </button>
      </Link>
      <Link to='listproduct'>
        <button className='flexCenter gap-2 rounded-md bg-primary h-14 w-44 medium-14'>
          <img src={listProduct} alt="List Product" height={55} width={55} />
          <span>List Product</span>
        </button>
      </Link>
    </div>
  );
};

export default Sidebar;
