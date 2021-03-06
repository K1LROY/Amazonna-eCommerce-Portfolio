import React, { useContext, useState, useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
  InputBase,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { getError } from "../utils/error";
import { useSnackbar } from "notistack";
import axios from "axios";
import { styled } from "@mui/styles";

const Navbar = styled(AppBar)({
  backgroundColor: "#203041",
  "& a": {
    color: "#ffffff",
    marginLeft: 10,
  },
});
const MainContainer = styled(Container)({
  marginTop: 10,
  minHeight: "80vh",
});
const Brand = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.5rem",
});

const Footer = styled("footer")({
  textAlign: "center",
  marginTop: 10,
});

const LoginButton = styled(Button)({
  color: "#ffffff",
  textTransform: "initial",
});
const MenuButton = styled(Button)({
  padding: 0,
});
const NewIconButton = styled(Button)({
  padding: 5,
  borderRadius: "0 5px 5px 0",
  "& span": {
    color: "#000000",
  },
});
const NavbarButton = styled(MenuIcon)({
  color: "#ffffff",
  textTransform: "initial",
});
const NewToolbar = styled(Toolbar)({
  justifyContent: "space-between",
});
// const SearchForm = styled("form")({
//   border: "1px solid #ffffff",
//   backgroundColor: "#ffffff",
//   borderRadius: 5,
// });
const SearchSection = styled("div")({
  display: "flex",
});
const SearchInput = styled(InputBase)({
  paddingLeft: 5,
  color: "#000000",
  "& ::placeholder": {
    color: "#606060",
  },
});

const Layout = ({ title, description, children }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
      Tertiary: {
        main: "#DEDADE",
      },
    },
  });

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`);
      setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  const [query, setQuery] = useState("");
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    Cookies.remove("shippingAddress");
    Cookies.remove("paymentMethod");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazonna` : "Next Amazonna"}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar position="static">
          <NewToolbar>
            <Box display="flex" alignItems="center">
              <MenuButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
              >
                <NavbarButton />
              </MenuButton>
              <NextLink href="/" passHref>
                <Link>
                  <Brand>Amazonna</Brand>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <SearchSection>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  border: "1px solid #ffffff",
                  backgroundColor: "#ffffff",
                  borderRadius: 3,
                }}
              >
                <form onSubmit={submitHandler}>
                  <SearchInput
                    name="query"
                    placeholder="Search products"
                    onChange={queryChangeHandler}
                  />
                  <NewIconButton type="submit" aria-label="search">
                    <SearchIcon />
                  </NewIconButton>
                </form>
              </Box>
            </SearchSection>
            <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
                        badgeContent={cart.cartItems.length}
                      >
                        Cart
                      </Badge>
                    ) : (
                      "Cart"
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <LoginButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                  >
                    {userInfo.name}
                  </LoginButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, "/order-history")
                      }
                    >
                      Order Hisotry
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/admin/dashboard")
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                    <Typography component="span">Login</Typography>
                  </Link>
                </NextLink>
              )}
            </div>
          </NewToolbar>
        </Navbar>

        <MainContainer>{children}</MainContainer>

        <Footer>
          <Typography>All rights reserved. Next Amazonna</Typography>
        </Footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
