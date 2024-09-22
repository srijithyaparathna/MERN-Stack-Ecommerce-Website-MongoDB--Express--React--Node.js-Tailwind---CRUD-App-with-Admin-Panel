import { Link, NavLink } from "react-router-dom"; // Importing Link and NavLink from react-router-dom for routing
import { useState,useContext } from "react"; // Importing useState for handling the mobile menu state
import { MdMenu, MdClose } from "react-icons/md"; // Importing menu icons (hamburger and close) from react-icons
import { FaOpencart } from "react-icons/fa"; // Importing cart icon from react-icons
import logo from "../assets/logo.svg"; // Importing logo image
import logout from "../assets/logout.svg"; // Importing logout icon
import Navbar from "./Navbar"; // Importing Navbar component for the navigation links
import user from "../assets/user.svg"; // Importing user icon
import { ShopContext } from "../Context/ShopContext";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false); // State to manage whether the mobile menu is open or not
  const toggleMenu = () => setMenuOpened(!menuOpened); // Function to toggle mobile menu open/close state
const {getTotalCartItems} = useContext(ShopContext);
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="px-2 flexBetween py-4 max-xs:px-2">
        {/* Wrapper for logo and navbar with padding and responsive styling */}

        <div>
          {/* Link to homepage, clicking the logo takes you to the home route */}
          <Link to="/">
            <img src={logo} alt="logo" height={66} width={66} />
            {/* Logo image with defined height and width */}
          </Link>
        </div>

        {/* Navbar for larger screens */}
        { <Navbar
          containerStyles="hidden md:flex flex-row gap-x-6"
          // Navbar is hidden on small screens and displayed as a horizontal flex container on medium and larger screens
        /> }

        <div className="flexBetween sm:gap-x-6 bold-16">
          {/* Section containing mobile menu toggle and cart/logout links */}

          {!menuOpened ? (
            <MdMenu
              className="md:hidden cursor-pointer hover:text-secondary mr-2 p-1 ring-1 ring-slate-900/30 h-8 w-8 rounded-full"
              onClick={toggleMenu}
              // Mobile menu icon (hamburger) is displayed when the menu is closed.
              // It's only shown on mobile screens (`md:hidden`).
            />
          ) : (
            <MdClose
              className="md:hidden cursor-pointer hover:text-secondary mr-2 p-1 ring-1 ring-slate-900/30 h-8 w-8 rounded-full"
              onClick={toggleMenu}
              // Close icon shown when the menu is open (replaces MdMenu when `menuOpened` is true)
            />
          )}

          {/* Navbar for mobile screens, displayed when menuOpened is true */}
          {menuOpened && (
            <Navbar
              containerStyles={
                "flex items-start flex-col gap-y-12 fixed top-20 right-8 p-12 bg-blue-500 rounded-3xl shadow-md w-100 medium-16 ring-1 ring-slate-900/5 transition-all duration-300"
              }
              // Mobile navbar styled as a fixed, right-aligned, vertically stacked list when the menu is opened
            />
          )}

          <div className="flexBetween sm:gap-x-6 px-1 "  >
            {/* Cart icon and count, always visible */}
            <NavLink to="/cart-page" className="flex">
              <FaOpencart className="p-1 h-8 w-8 ring-slate-900/30 ring-1 rounded-full" />
              {/* Cart icon with a badge */}
              <span className="relative flexCenter w-5 h-5 rounded-full bg-secondary text-white medium-14 -top-2">
                {getTotalCartItems()}
              </span>
              {/* Badge displaying the number of items in the cart (currently hardcoded as 10) */}
            </NavLink>

            {/* Logout button, always visible */}
            {/* <NavLink to="logout" className="btn_secondary_rounded flexCenter"> */}
              {/* <img src={logout} alt="Logout" height={19} width={19} /> */}
              {/* Logout icon next to the text */}
              {/* Logout */}
            {/* </NavLink> */}

            {/* Login button, always visible */}
            <NavLink to="login" className="btn_secondary_rounded flexCenter">
              <img src={user} alt="Login" height={19} width={19} />
              {/* Login icon next to the text */}
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
