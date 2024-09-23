import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import ProductHd from "../components/ProductHd";
import ProductDisplay from "../components/ProductDisplay";
import ProductDescription from "../components/ProductDescription";
import RelatedProducts from "../components/RelatedProduct";

const Product = () => {
  const { allProducts } = useContext(ShopContext); // Corrected context key
  const { productId } = useParams(); // Get productId from the URL

  // Ensure allProducts is defined and valid
  if (!allProducts) {
    return <div>Loading...</div>; // Show loading state
  }

  const product = allProducts.find((e) => e.id === Number(productId)); // Find product by ID

  if (!product) {
    console.log("Product not found"); // Debugging if product is not found
    return <div>Product not found</div>;
  }

  return (
    <section className="max_padd_container py-28">
      <div>
        <ProductHd product={product} /> {/* Pass product data to ProductHd */}
        <ProductDisplay product={product} />
        <ProductDescription product={product} />
        <RelatedProducts />
      </div>
    </section>
  );
};

export default Product;
