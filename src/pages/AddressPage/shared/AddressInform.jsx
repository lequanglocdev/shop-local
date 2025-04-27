import {
  Box,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

const AddressInform = () => {
  const [user, setUser] = useState(null);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };

  const handleWardChange = (event) => {
    setWard(event.target.value);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Box
      sx={{
        border: "1px solid black",
        width: "100%",
        pt: 4,
        borderRadius: 5,
      }}
    >
      {user && (
        <>
          <Box sx={{ m: "24px 0 24px 64px" }}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={13}
            >
              <Typography variant="h6">Tỉnh/Thành phố: </Typography>

              <FormControl sx={{ m: 1, width: "300px" }} size="small">
                <InputLabel id="demo-simple-select-label" color="default">
                  Tỉnh/Thành phố
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={city}
                  label="Tỉnh/Thành phố"
                  onChange={handleCityChange}
                  color="default"
                >
                  <MenuItem value={"Hồ Chí Minh"}>Hồ Chí Minh</MenuItem>
                  <MenuItem value={"Hà Nội"}>Hà Nội</MenuItem>
                  <MenuItem value={"Đà Nẵng"}>Đà Nẵng</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={17}
            >
              <Typography variant="h6">Quận/Huyện: </Typography>

              <FormControl sx={{ m: 1, width: "300px" }} size="small">
                <InputLabel id="demo-simple-select-label" color="default">
                  Quận/Huyện
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={district}
                  label="Quận/Huyện"
                  onChange={handleDistrictChange}
                  color="default"
                >
                  <MenuItem value={"Quận 12"}>Quận 12</MenuItem>
                  <MenuItem value={"Quận Gò Vấp"}>Quận Gò Vấp</MenuItem>
                  <MenuItem value={"Quận Bình Thạnh"}>Quận Bình Thạnh</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={19}
            >
              <Typography variant="h6">Phường xã: </Typography>

              <FormControl sx={{ m: 1, width: "300px" }} size="small">
                <InputLabel id="demo-simple-select-label" color="default">
                  Phường xã
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={ward}
                  label="Phường xã"
                  onChange={handleWardChange}
                  color="default"
                >
                  <MenuItem value={"Phường Đông Hưng Thuận"}>
                    Phường Đông Hưng Thuận
                  </MenuItem>
                  <MenuItem value={"Phường Tân Thới Hiệp"}>
                    Phường Tân Thới Hiệp
                  </MenuItem>
                  <MenuItem value={"Phường Trung Mỹ Tây"}>
                    Phường Trung Mỹ Tây
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={23}
            >
              <Typography variant="h6">Địa chỉ: </Typography>
              <TextField
                variant="outlined"
                label="Nhập địa chỉ"
                size="small"
                color="default"
                sx={{ width: "300px" }}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--footer-background-color)",
                marginBottom: 6,
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
              }}
            >
              Cập nhật
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AddressInform;
