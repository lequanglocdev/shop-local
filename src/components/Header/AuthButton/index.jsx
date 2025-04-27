// HeaderAuthButtons.js
import {
  Stack,
  Typography,
  Menu,
  MenuItem,
  alpha,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { resetStore } from "@/store";
import { selectUser } from "@/store/redux/user/reducer";

const AuthButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const storedUser = useSelector(selectUser);
  console.log("storedUser:", storedUser);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(resetStore());
    handleMenuClose();
    navigate("/");
  };

  return (
    <Stack direction="row" alignItems="center">
      {storedUser ? (
        <>
          <Stack
            direction="row"
            alignItems="center"
            onClick={handleMenuOpen}
            sx={{ cursor: "pointer" }}
          >
            <Avatar src={storedUser.avatarUrl} alt={storedUser.result.email} />
            <Typography sx={{ marginLeft: "5px" }}>
              {storedUser.result.email}
            </Typography>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate("/accountInform/profile")}>
              Thông tin tài khoản
            </MenuItem>
            <MenuItem onClick={() => navigate("/myOrders")}>
              Đơn hàng của tôi
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </>
      ) : (
        <Stack
          direction={"row"}
          spacing={2}
          display={"flex"}
          alignItems={"center"}
        >
          <Button
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "#d9d9d9",
              borderRadius: 5,
              width: 125,
              height: 40,
              "&:hover": {
                backgroundColor: alpha("#d9d9d9", 0.5),
              },
            }}
            component={Link}
            to="/login"
          >
            Đăng nhập
          </Button>

          <Button
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "black",
              borderRadius: 5,
              width: 125,
              height: 40,
              "&:hover": {
                backgroundColor: alpha("#333"),
              },
            }}
            component={Link}
            to="/register"
          >
            Đăng ký
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default AuthButton;
