import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { TbTrash } from "react-icons/tb";


const Cartitems = () => {
  const {  getTotalCartAmount,all_products, cartItems, removeFromCart } = useContext(ShopContext);

  return (
    <section className="max_padd_container pt-28 " >
      <table className =" w-full mx-auto  " >
        <thead>
          <tr className="bg-slate-900/10 regular-18 sm:regular-22  text-start py-12  " >
            <th className="p-1 py-2">Products</th>
            <th className="p-1 py-2">Title</th>
            <th className="p-1 py-2">Price</th>
            <th className="p-1 py-2">Quantity</th>
            <th className="p-1 py-2">Total</th>
            <th className="p-1 py-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {all_products.map((e) => {
            if (cartItems[e.id] > 0) {
              const quantity = cartItems[e.id]; // Get quantity from cartItems
              const totalPrice = e.new_price * quantity; // Calculate total price

              return (
                <tr key={e.id} className="border-b border-slate-900/20 p-6 medium-14 text-center  " >
                  <td className="flexcenter"  >
                    <img src={e.image} className="rounded-lg ring-1 ring-slate-900/5 my-1 " alt="prdctImg" height={43} width={43} />
                  </td>
                  <td>
                    <div className="line-clamp-3" >{e.name}</div>
                  </td>
                  <td>{e.new_price}</td>
                  <td className="w-16 h-16 bg-white " >{quantity}</td> {/* Show quantity */}
                  <td>{totalPrice}</td> {/* Show total price */}
                  <td>
                    <div className="bold-22 pl-14" >
                    <TbTrash 
                      onClick={() => removeFromCart(e.id)} // Remove from cart functionality
                      className="remove-btn  "
                    >
                      Remove
                    </TbTrash> </div> 
                  </td>
                </tr>
              );
            }
            return null; // In case the product is not in the cart
          })}
        </tbody>
      </table>

      {/* cart details */}
<div className="flex flex-col gap-20 my-16 p-8 md:flex-row rounded-md bg-white w-full max-w-[666px]" >
  <div className=" flex flex-col gap-10 " >
    <h4 className="bold-20" >Summary</h4>
    <div>
      <div className="flexBetween py-4" >
        <h4 className="medium-16" >Subtotal:</h4>
        <h4 className="text-gray-30 font-semibold " >${ getTotalCartAmount()}</h4>
      </div>
      <hr />
      <div className="flexBetween py-4" >  
        <h4 className="medium-16" >Shipping Fee:</h4>
        <h4 className="text-gray-30 font-semibold " >Free</h4>
      </div>
      <hr />
      <div className="flexBetween py-4 " >
        <h4 className="bold-18" >Total:</h4>
        <h4 className="bold-18" >${ getTotalCartAmount()}</h4> 
      </div>
    </div>
    <button className="btn_dark_rounded w-44" >Checkout</button>
    <div className="flex flex-col gap-10" >
      <h4 className="bold-20 capitalize"  >Your coupon code enter</h4>

      <div className="flexBetween pl-5 h-12 bg-primary rounded ring-slate-900/10 " >
        < input type="text" placeholder="Coupon code" className="bg-transparent border-none outline-none " /> 
        <button className="btn_dark_rounded" >submit</button>
        </div>
    </div>
  </div>
</div>

    </section>
  );
};

export default Cartitems;
