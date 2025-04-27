import ContactsIcon from "@mui/icons-material/Contacts";
import HelpIcon from "@mui/icons-material/Help";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const listProducts = [
  {
    name: [
      "ÁO THUN",
      "ÁO SƠ MI",
      "ÁO KHOÁC",
      "QUẦN DÀI",
      "QUẦN SHORTS",
      "PHỤ KIỆN",
    ],
  },
];

const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const openCategoryMenu = Boolean(categoryMenuAnchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCategoryMenuAnchorEl(null); // Đóng cả hai menu
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        sx={{
          color: "inherit",
          "&:hover": {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
        component={Link}
        to="/">
        Trang chủ
      </Button>
      <Button
        onClick={handleCategoryMenuOpen}
        sx={{
          color: "inherit",
          "&:hover": {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}>
        Danh mục
      </Button>

      <Button
        sx={{
          color: "inherit",
          "&:hover": {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
        component={Link}
        to="/support">
        Hổ trợ
      </Button>

      <Button
        sx={{
          color: "inherit",
          "&:hover": {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
        component={Link}
        to="/contact">
        Liên hệ
      </Button>

      <Button
        sx={{
          color: "inherit",
          "&:hover": {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}>
        Về chúng tôi
      </Button>

      {/* Danh mục sản phẩm Menu */}
      <Menu
        anchorEl={categoryMenuAnchorEl}
        open={openCategoryMenu}
        onClose={handleMenuClose}>
        {listProducts.map((listProduct, index) =>
          listProduct.name.map((listProductName, idx) => (
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/listProducts"
              sx={{
                px: 3,
                py: 1.5,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "#333",
                  fontWeight: "bold",
                  color: "#fff", // màu xanh chủ đạo của MUI
                },
              }}
              key={idx}>
              {listProductName}
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default NavMenu;
