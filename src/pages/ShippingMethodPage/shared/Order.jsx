import PaymentsIcon from "@mui/icons-material/Payments";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setAddress,
  setPaymentMethods,
  setOrderStatus,
  setError,
  setConfirmedOrder,
  clearOrderData,
} from "@/store/redux/order/reducer";

const API_URL = "https://dummyjson.com/users";

const headerInfos = ["Sản phẩm", "Đơn giá", "Số lượng", "Thành tiền"];

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderData, address, paymentMethods, orderStatus, error } =
    useSelector((state) => state.order);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    "Thanh toán tiền mặt"
  );
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  useEffect(() => {
    if (!orderData && !isOrderPlaced) {
      navigate("/");
      return;
    }

    const fetchAddress = async () => {
      try {
        const response = await axios.get(`${API_URL}/1`);
        const userAddress = response.data.address;
        const formattedAddress = `${userAddress.address}, ${userAddress.city}, ${userAddress.state}, ${userAddress.postalCode}`;
        dispatch(setAddress(formattedAddress || "Địa chỉ không khả dụng"));
      } catch (error) {
        console.log("Error fetching address:", error);
        dispatch(setAddress("Địa chỉ không khả dụng"));
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        dispatch(setPaymentMethods(["Thanh toán tiền mặt", "MoMo", "ZaloPay"]));
      } catch (error) {
        console.log("Error fetching payment methods:", error);
        dispatch(setPaymentMethods(["Thanh toán tiền mặt", "MoMo", "ZaloPay"]));
      }
    };

    fetchAddress();
    fetchPaymentMethods();
  }, [orderData, dispatch, navigate, isOrderPlaced]);

  const handleConfirmOrder = async () => {
    if (!address || address === "Địa chỉ không khả dụng") {
      alert("Không thể đặt hàng vì địa chỉ không khả dụng!");
      return;
    }

    if (!selectedPaymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    const finalOrder = {
      ...orderData,
      address,
      paymentMethod: selectedPaymentMethod,
    };

    try {
      dispatch(setOrderStatus("loading"));
      dispatch(setError(null));

      console.log("Dữ liệu đơn hàng sẽ được gửi lên API:", finalOrder);

      const mockResponse = { data: { success: true } }; // Giả lập response thành công

      if (mockResponse.data.success) {
        dispatch(setOrderStatus("succeeded"));
        dispatch(setConfirmedOrder(finalOrder)); // Lưu finalOrder vào confirmedOrder
        // Log để kiểm tra giá trị confirmedOrder ngay sau khi lưu
        console.log("confirmedOrder sau khi lưu:", finalOrder);
        dispatch(clearOrderData());
        setIsOrderPlaced(true);
        // Đảm bảo navigate được gọi sau khi tất cả action hoàn tất
        setTimeout(() => {
          navigate("/orderConfirmation");
        }, 100);
      } else {
        dispatch(setOrderStatus("failed"));
        dispatch(
          setError(mockResponse.data.message || "Đặt hàng không thành công!")
        );
      }
    } catch (error) {
      console.log("Error creating order:", error);
      dispatch(setOrderStatus("failed"));
      dispatch(setError(error.response?.data?.message || "Đã có lỗi xảy ra!"));
    }
  };

  if (!orderData && !isOrderPlaced) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      {orderData ? (
        <div
          style={{
            width: "100%",
            height: 654,
            border: "1px solid var(--border-color)",
            borderRadius: 5,
            marginTop: "50px",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-around"}
            sx={{ borderBottom: "1px solid var(--border-color)" }}
          >
            {headerInfos.map((headerInfo, index) => (
              <h1
                key={index}
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                }}
              >
                {headerInfo}
              </h1>
            ))}
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ ml: 2, mt: 2 }}
          >
            <Stack direction={"row"} alignItems={"center"}>
              <img src={orderData.image} alt={orderData.name} width={90} />
              <p
                style={{
                  color: "var(--text-color)",
                  marginLeft: 16,
                }}
              >
                {orderData.name}
              </p>
            </Stack>

            <Stack direction={"row"} alignItems={"center"} sx={{ mr: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  textDecoration: "line-through",
                  fontSize: "1rem",
                }}
              >
                {orderData.price ? `$${orderData.price}` : ""}
              </Typography>

              <Typography variant="h6" sx={{ ml: 2 }}>
                {orderData.price ? `$${orderData.price}` : ""}
              </Typography>
            </Stack>

            <Typography variant="body1" sx={{ mr: 10 }}>
              {orderData.quantity}
            </Typography>
            <Typography variant="h6" sx={{ mr: 15 }}>
              $
              {orderData.price && orderData.quantity
                ? (orderData.price * orderData.quantity).toLocaleString()
                : "0"}
            </Typography>
          </Stack>

          <Stack direction={"column"} sx={{ m: "30px 0 30px 50px" }}>
            <Stack direction={"row"} alignItems={"center"}>
              <PlaceIcon />
              <Typography variant="h6" sx={{ ml: 2 }}>
                Địa chỉ nhận hàng
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ m: "20px" }}>
              {address}
            </Typography>

            <Stack direction={"row"} alignItems={"center"} sx={{ mt: 2 }}>
              <PaymentsIcon />
              <Typography variant="h6" sx={{ ml: 2 }}>
                Phương thức thanh toán
              </Typography>
            </Stack>
            <RadioGroup
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              sx={{ m: "20px" }}
            >
              {paymentMethods.map((method) => (
                <FormControlLabel
                  key={method}
                  value={method}
                  control={<Radio color="default" />}
                  label={method}
                />
              ))}
            </RadioGroup>
          </Stack>

          {error && (
            <Typography color="error" style={{ marginBottom: "10px" }}>
              Lỗi: {error}
            </Typography>
          )}

          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"end"}
            sx={{ m: "50px 100px " }}
          >
            <Typography variant="h6">Tổng số tiền: </Typography>
            <Typography variant="h5" sx={{ m: "0 50px 0 10px" }}>
              $
              {orderData.price && orderData.quantity
                ? (orderData.price * orderData.quantity).toLocaleString()
                : "0"}
            </Typography>
            <Button
              variant="contained"
              onClick={handleConfirmOrder}
              disabled={orderStatus === "loading"}
              sx={{ backgroundColor: "black", color: "white", p: "10px 30px" }}
            >
              {orderStatus === "loading" ? "Đang xử lý..." : "Đặt ngay"}
            </Button>
          </Stack>
        </div>
      ) : (
        <Typography>Đang xử lý đơn hàng...</Typography>
      )}
    </>
  );
};

export default Order;
