import { TbArrowRight } from "react-icons/tb";
import PropTypes from "prop-types";

const ProductHd = ({ product }) => {
  return (
    <div className="flex items-center flex-wrap gap-x-2 medium-16 my-4 capitalize " >
      Home <TbArrowRight /> Shop <TbArrowRight /> {product.category} <TbArrowRight /> {product.name}
    </div>
  );
};

// Define the expected prop types
ProductHd.propTypes = {
  product: PropTypes.shape({
    category: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductHd;
