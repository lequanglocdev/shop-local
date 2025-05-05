import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import banner from "@/assets/images/backgroundFashions/background-fashion.jpg";
import styles from "./style.module.css";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const passedImageUrl = location.state?.imageUrl || null;

  const [imageUrl, setImageUrl] = useState(passedImageUrl);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // Nếu không có imageUrl từ state (ví dụ người dùng reload), gọi lại API để lấy
    if (!imageUrl) {
      axios
        .get(`http://localhost:8080/adamstore/v1/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const fallbackUrl = res.data.result.productImages?.[0]?.imageUrl;
          setImageUrl(fallbackUrl);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin sản phẩm:", err);
        });
    }

    // Gọi variants
    axios
      .get(
        `http://localhost:8080/adamstore/v1/products/${id}/product-variants`,
        {
          params: { pageNo: 1, pageSize: 10 },
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const items = res.data.result.items;
        console.log(">>>>>>>", items);
        const grouped = items.reduce((acc, item) => {
          const colorName = item.color.name.trim();
          if (!acc[colorName]) {
            acc[colorName] = {
              color: item.color,
              productName: item.product.name,
              sizes: [],
            };
          }

          acc[colorName].sizes.push({
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            isAvailable: item.isAvailable,
          });

          return acc;
        }, {});

        setVariants(Object.values(grouped));
      })
      .catch((err) => {
        console.error("Lỗi khi lấy product variants:", err);
      });
  }, [id, imageUrl]);

  return (
    <>
      <Header />
      <img
        src={banner}
        alt="banner"
        width="100%"
        height={300}
        className={styles.image}
      />
      <Container
        sx={{
          width: "100%",
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}>
        {imageUrl && (
          <div className={styles.productLeft}>
            <img
              src={imageUrl}
              alt="Ảnh sản phẩm"
              className={styles.imageProductLeft}
            />
          </div>
        )}
        <div>
          <h3>ÁO VEST BE TRƠN - AV367</h3>
          <p>105 lượt mua</p>
          <p>2.555.555đ</p>
          <p>Loại áo: Áo sơ mi</p>
          <p>Size: M L S XL XLL</p>
          <p>số lượng 1</p>
        </div>

        {/* {variants.length === 0 ? (
          <Typography>Đang tải thông tin sản phẩm...</Typography>
        ) : (
          <Box>
            {variants.map((group, idx) => (
              <Box key={idx} sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary">
                  Màu: {group.color.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}>
                  {group.productName}
                </Typography>
                <Grid container spacing={2}>
                  {group.sizes.map((s, index) => (
                    <Grid item key={index}>
                      <Card sx={{ p: 2, minWidth: 150 }}>
                        <Typography>Kích thước: {s.size.name}</Typography>
                        <Typography>
                          Giá: {s.price.toLocaleString()}đ
                        </Typography>
                        <Typography>Số lượng: {s.quantity}</Typography>
                        <Typography>
                          {s.isAvailable ? "Còn hàng" : "Hết hàng"}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )} */}
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetails;
