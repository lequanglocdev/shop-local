// OrderConfirmationPage.js
import { Typography, Button, Container, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { clearConfirmedOrder } from "@/store/redux/order/reducer";

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderStatus, confirmedOrder } = useSelector((state) => state.order);

  // Log để kiểm tra giá trị confirmedOrder khi render
  console.log("confirmedOrder trong OrderConfirmationPage:", confirmedOrder);

  const handleBackToHome = () => {
    dispatch(clearConfirmedOrder()); // Xóa confirmedOrder khi người dùng nhấn nút
    navigate("/");
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Stack alignItems={"center"} sx={{ m: "80px 0" }}>
          <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <Typography variant="h5" gutterBottom>
              Xác nhận đơn hàng
            </Typography>
            {confirmedOrder ? (
              orderStatus === "succeeded" ? (
                <>
                  <Typography gutterBottom>
                    Đơn hàng của bạn đã được đặt thành công!
                  </Typography>
                  <div style={{ marginBottom: "20px" }}>
                    <Typography variant="h6">Thông tin đơn hàng</Typography>
                    <Typography>
                      Sản phẩm: {confirmedOrder.name || "Không có thông tin"}
                    </Typography>
                    <Typography>
                      Đơn giá:{" "}
                      {confirmedOrder.price
                        ? confirmedOrder.price.toLocaleString()
                        : "0"}
                      đ
                    </Typography>
                    <Typography>
                      Số lượng: {confirmedOrder.quantity || "0"}
                    </Typography>
                    <Typography>
                      Màu sắc: {confirmedOrder.color || "Không có thông tin"}
                    </Typography>
                    <Typography>
                      Kích thước: {confirmedOrder.size || "Không có thông tin"}
                    </Typography>
                    <Typography>
                      Thành tiền:{" "}
                      {confirmedOrder.price && confirmedOrder.quantity
                        ? (
                            confirmedOrder.price * confirmedOrder.quantity
                          ).toLocaleString()
                        : "0"}
                      đ
                    </Typography>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <Typography variant="h6">Địa chỉ nhận hàng</Typography>
                    <Typography>
                      {confirmedOrder.address || "Không có thông tin"}
                    </Typography>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <Typography variant="h6">Phương thức thanh toán</Typography>
                    <Typography>
                      {confirmedOrder.paymentMethod || "Không có thông tin"}
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    onClick={handleBackToHome}
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      width: "100%",
                    }}
                  >
                    Quay lại trang chính
                  </Button>
                </>
              ) : (
                <>
                  <Typography>Đã có lỗi xảy ra, vui lòng thử lại.</Typography>
                  <Button
                    variant="contained"
                    onClick={handleBackToHome}
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      width: "100%",
                      marginTop: "20px",
                    }}
                  >
                    Quay lại trang chính
                  </Button>
                </>
              )
            ) : (
              <>
                <Typography>
                  Không có thông tin đơn hàng để hiển thị.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleBackToHome}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    width: "100%",
                    marginTop: "20px",
                  }}
                >
                  Quay lại trang chính
                </Button>
              </>
            )}
          </div>
        </Stack>
      </Container>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
