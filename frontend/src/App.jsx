import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Footer from "./components/Footer";

// images
import bannermens from "../src/assets/bannermens.png";
import bannerwomen from "../src/assets/bannerwomens.png";
import bannerkids from "../src/assets/bannerkids.png";

export default function App() {
 // console.log("App Component");
  return (
    <main className="bg-primary text-tertiary">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/mens"
            element={<Category category="men" banner={bannermens} />}
          />
          <Route
            path="/womens"
            element={<Category category="women" banner={bannerwomen} />}
          />
          <Route
            path="/kids"
            element={<Category category="kid" banner={bannerkids} />}
          />
          <Route path="/products/:productId" element={<Product />} />
          <Route path="/cart-page" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </main>
  );
}
