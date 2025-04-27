import { Skeleton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductPrice = ({ products, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"row"} alignItems={"center"}>
          <Typography variant="h6">Giá: </Typography>
          <Typography variant="h5" sx={{ ml: 1 }}>
            {products.price ? `$${products.price}` : ""}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              textDecoration: "line-through",
              fontSize: "1rem",
              ml: 2,
            }}
          >
            {products.price ? `$${products.price}` : ""}
          </Typography>

          <Typography variant="body1" sx={{ ml: 2 }}>
            {products.minimumOrderQuantity
              ? `Đã bán: ${products.minimumOrderQuantity}`
              : ""}
          </Typography>
        </Stack>
      ) : null}
    </>
  );
};

ProductPrice.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProductPrice;
