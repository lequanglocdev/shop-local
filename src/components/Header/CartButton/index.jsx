import { SentimentDissatisfied } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Badge,
  badgeClasses,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  Button,
  Dialog, // Thêm Dialog
  DialogTitle, // Thêm DialogTitle
  DialogContent, // Thêm DialogContent
  DialogActions, // Thêm DialogActions
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartByUserQuery } from "@/services/api/cart";
import { selectUserId } from "@/store/redux/user/reducer";
import { removeFromCart } from "@/store/redux/cart/reducer";

const CartButton = () => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái mở Dialog
  const [itemToRemove, setItemToRemove] = useState(null); // Lưu sản phẩm cần xóa
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const { data: cartData, isLoading } = useGetCartByUserQuery(userId, {
    skip: !userId,
  });
  // console.log("Cart data from API:", cartData);

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const totalItems = useSelector((state) => state.cart?.cartTotalQuantity || 0);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Mở Dialog xác nhận xóa
  const handleOpenDialog = (item) => {
    setItemToRemove(item); // Lưu sản phẩm cần xóa
    setOpenDialog(true); // Mở Dialog
  };

  // Đóng Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setItemToRemove(null); // Xóa thông tin sản phẩm cần xóa
  };

  // Xác nhận xóa sản phẩm
  const handleConfirmRemove = () => {
    if (itemToRemove) {
      dispatch(
        removeFromCart({
          productId: itemToRemove.productId,
          color: itemToRemove.color,
          size: itemToRemove.size,
        })
      );
    }
    handleCloseDialog(); // Đóng Dialog sau khi xóa
  };

  const DrawerList = () => {
    return (
      <Box
        sx={{
          width: 400,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation">
        {/* Header */}
        <Box sx={{ flexShrink: 0 }}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon fontSize="large" />
          </IconButton>

          <Stack direction={"row"} alignItems={"center"}>
            <LocalMallIcon />
            <Typography variant="h5">GIỎ HÀNG CỦA BẠN</Typography>
          </Stack>
          <Divider />
        </Box>

        {/* Danh sách sản phẩm với thanh cuộn */}
        {isLoading ? (
          <Typography sx={{ p: 2, textAlign: "center" }}>
            Đang tải giỏ hàng...
          </Typography>
        ) : !userId ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}>
            <Typography variant="h6">VUI LÒNG ĐĂNG NHẬP!</Typography>
            <SentimentDissatisfiedIcon fontSize="large" />
          </Box>
        ) : cartItems.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}>
            <Typography variant="h6">CHƯA CÓ SẢN PHẨM NÀO!</Typography>
            <SentimentDissatisfiedIcon fontSize="large" />
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
              p: 2,
            }}>
            <Stack spacing={2}>
              {cartItems.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ borderBottom: "1px solid #ddd", pb: 1 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </Typography>
                  </Stack>
                  {/* Nút Xóa với xác nhận */}
                  <IconButton
                    onClick={() => handleOpenDialog(item)} // Mở Dialog xác nhận
                    sx={{ color: "black" }}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <Box sx={{ flexShrink: 0, p: 2 }}>
            <Button
              variant="contained"
              sx={{ width: "100%", backgroundColor: "black", color: "white" }}
              onClick={() => {
                toggleDrawer(false)();
              }}>
              Xem giỏ hàng
            </Button>
          </Box>
        )}

        {/* Dialog xác nhận xóa */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>{itemToRemove?.name}</strong> khỏi giỏ hàng?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Hủy
            </Button>
            <Button onClick={handleConfirmRemove} color="error" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <>
      <IconButton aria-label="shopping-cart" onClick={toggleDrawer(true)}>
        <ShoppingCartOutlinedIcon fontSize="large" />
        <CartBadge
          badgeContent={totalItems}
          color="primary"
          overlap="circular"
        />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList()}
      </Drawer>
    </>
  );
};

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
    background-color: black;
    color: white;
  }
`;

export default CartButton;
