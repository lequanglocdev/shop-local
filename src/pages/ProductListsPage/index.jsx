import { Typography, Box, Card, CardContent, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";

const ProductLists = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        setIsLoading(true);
        const res = await fetch(
          "http://localhost:8080/adamstore/v1/products?pageNo=1&pageSize=100",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setProducts(data.result.items || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <Typography textAlign="center">Đang tải sản phẩm...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" p={2} textAlign="center">
        DANH SÁCH SẢN PHẨM
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {products.map((product) => (
          <Card key={product.id} sx={{ width: 250 }}>
            {product.productImages && product.productImages.length > 0 && (
              <CardMedia
                component="img"
                height="200"
                image={product.productImages[0].imageUrl}
                alt={product.name}
              />
            )}
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Giá: {product.price?.toLocaleString() + "đ" || "Đang cập nhật"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProductLists;
