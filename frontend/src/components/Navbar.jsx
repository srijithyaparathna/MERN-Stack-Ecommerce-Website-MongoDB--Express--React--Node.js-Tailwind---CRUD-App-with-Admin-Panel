import { NavLink } from "react-router-dom";
import { MdCategory, MdContacts, MdHomeFilled, MdShop2 } from "react-icons/md";
import PropTypes from 'prop-types';

function Navbar({ containerStyles }) {
  return (
    <nav className={containerStyles}>
      <div className="flex space-x-4"> {/* Adds space between links */}
        <NavLink to="/" className={({isActive})=> isActive ? "active_link":""} >
          <div className="flexCenter gap-x-1">
            <MdHomeFilled /> Home
          </div>
        </NavLink>
        <NavLink to="/mens" className={({isActive})=> isActive ? "active_link":""} >
          <div className="flexCenter gap-x-1">
            <MdCategory /> Men's
          </div>
        </NavLink>
        <NavLink to="/womens" className={({isActive})=> isActive ? "active_link":""} >
          <div className="flexCenter gap-x-1">
            <MdShop2 /> Women's
          </div>
        </NavLink>
        <NavLink to="/kids" className={({isActive})=> isActive ? "active_link":""} >
          <div className="flexCenter gap-x-1">
            <MdContacts /> Kid's
          </div>
        </NavLink>
      </div>
    </nav>
  );
}

// Define prop types for validation
Navbar.propTypes = {
  containerStyles: PropTypes.string.isRequired,
};

export default Navbar;
