import { Typography, Box, Card, CardContent, CardMedia } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ProductLists = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;

    const token = localStorage.getItem("accessToken");
    axios
      .get(
        `http://localhost:8080/adamstore/v1/categories/${categoryId}/products`,
        {
          params: { pageNo: 1, pageSize: 10 },
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setProducts(res.data.result.items);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
      });
  }, [categoryId]);

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" p={2} textAlign="center">
        DANH SÁCH SẢN PHẨM
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product-detail/${product.id}`}
            state={{ imageUrl: product.productImages?.[0]?.imageUrl }}
            style={{ textDecoration: "none", color: "inherit" }}>
            <Card sx={{ borderRadius: "6px", cursor: "pointer", width: 270 }}>
              {product.productImages?.[0]?.imageUrl && (
                <CardMedia
                  component="img"
                  height="400"
                  image={product.productImages[0].imageUrl}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
                  {product.description}
                </Typography>
                <Typography style={{ fontSize: "16px" }} color="text.secondary">
                  Giá:{" "}
                  {product.price?.toLocaleString() + "đ" || "Đang cập nhật"}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default ProductLists;
