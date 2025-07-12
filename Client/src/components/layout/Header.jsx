import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, Link as RouterLink } from "react-router-dom";

import logo from "../../assets/logo.png";
import profileImage from "../../assets/profile.png";
import { useDashboard } from "../../hooks/react-query/query-hooks/authQuery";
import ThemeToggle from "./ThemeToggle";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Transactions", href: "/expenses" },
  { name: "Budgets", href: "/budgets" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
  { name: "Pricing", href: "/pricing" },
];

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = (open) => () => setMobileOpen(open);

  const isLoggedIn = !!localStorage.getItem("token");
  const { data } = useDashboard(isLoggedIn);

  // Convert image path to valid URL
  const imagePath = data?.data?.image;
  const fixedImageURL = imagePath
    ? `https://expensifybackend.onrender.com/${imagePath.replace(/\\/g, "/")}`
    : null;

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#FFFFFFcc",
            backdropFilter: "blur(10px)",
            boxShadow: "none",
            borderBottom: "1px solid #F3F4F6",
            color: "#1F2937",
          }}
        >
          <Toolbar
            sx={{
              maxWidth: 1250,
              mx: "auto",
              width: "100%",
              minHeight: { xs: 72, md: 88 },
              px: { xs: 2, sm: 3 },
            }}
          >
            {/* Logo */}
            <RouterLink
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ height: 38, marginRight: 12 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#4F46E5" }}
              >
                Expensi<span style={{ color: "#10B981" }}>Fy</span>
              </Typography>
            </RouterLink>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Nav */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  component={NavLink}
                  to={item.href}
                  sx={{
                    color: "#1F2937",
                    textTransform: "none",
                    px: 2,
                    "&.active": {
                      color: "#4F46E5",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}

              {/* Profile Image */}
              <IconButton
                component={RouterLink}
                to="/profile"
                sx={{ p: 0, ml: 2 }}
              >
                <img
                  src={fixedImageURL || profileImage}
                  onError={(e) => (e.target.src = profileImage)}
                  alt="Profile"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </IconButton>
            </Box>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { md: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon sx={{ color: "#1F2937" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ p: 2, width: "75vw", bgcolor: "#ffffff", height: "100%" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ color: "#1F2937" }}>
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer(false)} sx={{ color: "#1F2937" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ mt: 3 }}>
            {navigation.map((item) => (
              <ListItem
                key={item.name}
                button
                component={NavLink}
                to={item.href}
                onClick={toggleDrawer(false)}
                sx={{
                  color: "#1F2937",
                  borderRadius: 1,
                  "&.active": { color: "#4F46E5" },
                }}
              >
                <ListItemText primary={item.name} />
              </ListItem>
            ))}

            <ListItem
              button
              component={RouterLink}
              to="/profile"
              onClick={toggleDrawer(false)}
              sx={{ mt: 2 }}
            >
              <img
                src={fixedImageURL || profileImage}
                onError={(e) => (e.target.src = profileImage)}
                alt="Profile"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  marginRight: 10,
                  objectFit: "cover",
                }}
              />
              <ListItemText primary="Profile" sx={{ color: "#1F2937" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
