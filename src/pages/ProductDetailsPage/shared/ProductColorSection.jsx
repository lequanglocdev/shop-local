import { Button, Skeleton, Stack } from "@mui/material";
import PropTypes from "prop-types";

const ProductColorSection = ({
  products,
  loading,
  colors,
  handleSelectColor,
}) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"row"} alignItems={"center"} sx={{ m: "30px 0" }}>
          <Button
            sx={{
              borderColor: "black",
              color: colors === "Trắng" ? "white" : "black",
              backgroundColor: colors === "Trắng" ? "black" : "white",
            }}
            variant="outlined"
            onClick={() => handleSelectColor("Trắng")}
          >
            Trắng
          </Button>
          <Button
            sx={{
              ml: 2,
              borderColor: "black",
              color: colors === "Đen" ? "white" : "black",
              backgroundColor: colors === "Đen" ? "black" : "white",
            }}
            variant="outlined"
            onClick={() => handleSelectColor("Đen")}
          >
            Đen
          </Button>
        </Stack>
      ) : null}
    </>
  );
};

ProductColorSection.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
  colors: PropTypes.string,
  handleSelectColor: PropTypes.func,
};

export default ProductColorSection;
