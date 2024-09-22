import { Routes, Route } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import AddProduct from '../components/AddProduct';
import ListProduct from '../components/ListProduct';

const Admin = () => {
  return (
    <div className="lg:flex">
      <Sidebar />
      <div  >
        <Routes>
          <Route path='addproduct' element={<AddProduct />} />
          <Route path='listproduct' element={<ListProduct />} />
        </Routes>
      </div>
    </div> 
  );
};

export default Admin;
