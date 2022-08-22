import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PersonIcon from "@material-ui/icons/Person";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { NavContainer, ButtonContainer, StyledLink } from "./Header.elements";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";
import SearchBox from "../SearchBox";
import { TweenMax, Power3 } from "gsap";

function Header() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.currentUser.userInfo);
  console.log(userInfo);

  const handleLogout = () => {
    console.log("clicked");
    dispatch(logout());
  };

  //ProfileMenu Toggle
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //AdminMenu Toggle
  const [anchorElAdmin, setAnchorElAdmin] = useState(null);
  const handleAdminMenuOpen = (event) => {
    setAnchorElAdmin(event.currentTarget);
  };
  const handleAdminMenuClose = () => {
    setAnchorElAdmin(null);
  };

  let headerRef = useRef(null);
  useEffect(() => {
    TweenMax.from(headerRef, 0.8, {
      opacity: 0,
      y: -50,
      ease: Power3.easeOut,
      delay: 1.2,
    });
  }, []);

  return (
    <header>
      <AppBar position="static" color="primary">
        <Toolbar style={{ zIndex: "1" }}>
          <NavContainer ref={(el) => (headerRef = el)}>
            <Typography variant="h6">
              <StyledLink to="/">
                <img
                  src={"http://localhost:3000/icons/open-book.png"}
                  alt="logo"
                />
              </StyledLink>
            </Typography>
            <SearchBox />
            <ButtonContainer>
              <StyledLink to="/cart">
                <Button color="inherit">
                  <ShoppingCartIcon />
                  <p className="nav-label">Cart</p>
                </Button>
              </StyledLink>
              {userInfo ? (
                <div>
                  <Button color="inherit" onClick={handleMenuOpen}>
                    <PersonIcon />
                    <p className="nav-label">{userInfo.name.split(" ")[0]}</p>
                    <ArrowDropDownIcon />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <StyledLink to="/profile">Profile</StyledLink>
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </div>
              ) : (
                <StyledLink to="/login">
                  <Button color="inherit">
                    <PersonIcon />
                    <p className="nav-label">Login</p>
                  </Button>
                </StyledLink>
              )}
              {userInfo && userInfo.isAdmin && (
                <>
                  <Button color="inherit" onClick={handleAdminMenuOpen}>
                    Admin
                    <ArrowDropDownIcon />
                  </Button>
                  <Menu
                    anchorEl={anchorElAdmin}
                    keepMounted
                    open={Boolean(anchorElAdmin)}
                    onClose={handleAdminMenuClose}
                  >
                    <MenuItem onClick={handleAdminMenuClose}>
                      <StyledLink to="/admin/userlist">Users</StyledLink>
                    </MenuItem>
                    <MenuItem onClick={handleAdminMenuClose}>
                      <StyledLink to="/admin/productlist/page/1">
                        Products
                      </StyledLink>
                    </MenuItem>
                    <MenuItem onClick={handleAdminMenuClose}>
                      <StyledLink to="/admin/orderlist">Orders</StyledLink>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </ButtonContainer>
          </NavContainer>
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default Header;
