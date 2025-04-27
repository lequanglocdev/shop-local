import {
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header";

import ProductActions from "./shared/ProductActions";
import ProductBrand from "./shared/ProductBrand";
import ProductColorSection from "./shared/ProductColorSection";
import ProductImage from "./shared/ProductImage";
import ProductPrice from "./shared/ProductPrice";
import ProductQuantitySelection from "./shared/ProductQuantitySelection";
import ProductSizeSelection from "./shared/ProductSizeSelection";
import ProductStockKeepingUnit from "./shared/ProductStockKeepingUnit";
import ProductTitle from "./shared/ProductTitle";
import { useGetProductByIdQuery } from "@/services/api/product";

const buttonOptionSizes = ["S", "M", "L", "XL"];

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");

  // Gọi API để lấy chi tiết sản phẩm
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSelectColor = (color) => {
    setColors(color);
  };

  const handleSelectSize = (size) => {
    setSizes(size);
  };

  // Xử lý trạng thái loading và lỗi
  if (isLoading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg">
          <Stack
            sx={{
              m: "80px 0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Đang tải sản phẩm...</Typography>
          </Stack>
        </Container>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <Container maxWidth="lg">
          <Typography align="center" color="error" sx={{ m: "80px 0" }}>
            {error
              ? `Lỗi khi tải sản phẩm: ${
                  error?.data?.message || "Lỗi không xác định"
                }`
              : "Sản phẩm không tồn tại"}
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Stack sx={{ m: "80px 0" }}>
          <Grid container spacing={4}>
            <Grid item xl={6} lg={6}>
              <ProductImage products={product} loading={isLoading} />
            </Grid>

            <Grid item xl={6} lg={6}>
              <ProductTitle products={product} loading={isLoading} />

              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{ m: "30px 0" }}
              >
                <ProductPrice products={product} loading={isLoading} />
              </Stack>

              <ProductStockKeepingUnit products={product} loading={isLoading} />
              <ProductBrand />
              <ProductColorSection
                products={product}
                loading={isLoading}
                colors={colors}
                handleSelectColor={handleSelectColor}
              />
              <ProductQuantitySelection
                products={product}
                loading={isLoading}
                quantity={quantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
              />
              <ProductSizeSelection
                products={product}
                loading={isLoading}
                sizes={sizes}
                buttonOptionSizes={buttonOptionSizes}
                handleSelectSize={handleSelectSize}
              />
              <ProductActions
                products={product}
                loading={isLoading}
                selectedQuantity={quantity}
                selectedColor={colors}
                selectedSize={sizes}
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetails;
