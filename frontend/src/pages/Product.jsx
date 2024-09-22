import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import ProductHd from "../components/ProductHd";
import ProductDisplay from "../components/ProductDisplay";
import ProductDescription from "../components/ProductDescription";
import RelatedProducts from "../components/RelatedProduct";

const Product = () => {
  const { all_products } = useContext(ShopContext); // Access products from context
  const { productId } = useParams(); // Get productId from the URL
  
  // console.log("All products:", all_products); // Check products in context
  //console.log("Product ID from URL:", productId); // Check if productId is correct
  
  const product = all_products?.find((e) => e.id === Number(productId)); // Add null check for all_products

  if (!product) {
    console.log("Product not found"); // Debugging if product is not found
    return <div>Product not found</div>;
  }

  return (
    <section className="max_padd_container py-28 " >
      <div>
        <h1>Product</h1>
        <ProductHd product={product} /> {/* Pass product data to ProductHd */}
        <ProductDisplay product={product} />
        <ProductDescription product={product} />
        <RelatedProducts /> 

      </div>
    </section>
  );
};

export default Product;
