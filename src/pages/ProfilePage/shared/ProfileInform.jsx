import { useUpdateUserMutation } from "@/services/api/auth";
import { setUser } from "@/store/redux/user/reducer";
import { Upload } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const ProfileInform = () => {
  const dispatch = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const user = useSelector((state) => state.user.user);
  const { handleSubmit } = useForm();

  const handleGenderChange = (event) => {
    event.preventDefault();
  };

  const handleDateChange = (event) => {
    event.preventDefault();
  };

  const handleMonthChange = (event) => {
    event.preventDefault();
  };

  const handleYearChange = (event) => {
    event.preventDefault();
  };

  // useEffect((user) => {
  //   if (user) {
  //     setFormData({
  //       username: user.username || "",
  //       firstName: user.firstName || "",
  //       lastName: user.lastName || "",
  //       gender: user.gender || "",
  //       image: user.image || "",
  //       phone: user.phone || "",
  //       birthDate: {
  //         date: user.birthDate?.date || "",
  //         month: user.birthDate?.month || "",
  //         year: user.birthDate?.year || "",
  //       },
  //     });
  //   }
  // }, []);

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);
      const response = await updateUser({
        image: data?.image,
        username: data?.username,
        firstName: data?.firstName,
        lastName: data?.lastName,
        email: data?.email,
        phone: data?.phone,
        gender: data?.gender,
        birthDate: {
          date: data?.birthDate.date,
          month: data?.birthDate.month,
          year: data?.birthDate.year,
        },
        address: data?.address,
      }).unwrap();

      console.log("API response:", response);

      if (response) {
        const userData = {
          id: response.id,
          email: response.email,
          fullName: `${response.firstName} ${response.lastName}`,
          image: response.image,
          gender: response.gender,
          birthDate: {
            date: response.birthDate.date,
            month: response.birthDate.month,
            year: response.birthDate.year,
          },
        };
        console.log("User data:", userData);

        dispatch(updateUser(userData));
      }
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid black",
        width: "100%",
        pt: 16,
        borderRadius: 5,
      }}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      {user && (
        <>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              sx={{
                borderColor: "black",
                color: "black",
                "&:hover": {
                  backgroundColor: alpha("#d9d9d9", 0.5),
                },
              }}
            >
              Chọn ảnh
              <input
                type="file"
                accept="image/*"
                hidden
                // onChange={(event) => {
                //   const file = event.target.files[0];
                //   if (file) {
                //     const reader = new FileReader();
                //     reader.onloadend = () => {
                //       setFormData({
                //         ...formData,
                //         image: reader.result,
                //       });
                //     };
                //     reader.readAsDataURL(file);
                //   }
                // }}
              />
            </Button>
          </Stack>

          <Box sx={{ m: "24px 0 24px 64px" }}>
            {/* <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={13}
            >
              <Typography variant="h6">Tên đăng nhập: </Typography>
              <Typography variant="body1">{user.username}</Typography>
            </Stack> */}

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={24}
            >
              <Typography variant="h6">Email: </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={26}
            >
              <Typography variant="h6">Tên: </Typography>
              <TextField
                variant="outlined"
                label="Nhập tên"
                size="small"
                color="default"
                sx={{ width: "300px" }}
              />
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={15}
            >
              <Typography variant="h6">Số điện thoại: </Typography>
              <TextField
                variant="outlined"
                label="Số điện thoại"
                size="small"
                color="default"
                sx={{ width: "300px" }}
              />
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={21}
            >
              <Typography variant="h6">Giới tính:</Typography>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group"
                name="row-radio-buttons-group"
                value={updateUser.gender}
                onChange={handleGenderChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio color="default" />}
                  label="Nam"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio color="default" />}
                  label="Nữ"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio color="default" />}
                  label="Khác"
                />
              </RadioGroup>
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
            >
              <Typography variant="h6" sx={{ width: "29%" }}>
                Ngày sinh:{" "}
              </Typography>

              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-simple-select-label" color="default">
                  Ngày
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={user.birthDate}
                  label="Ngày"
                  onChange={handleDateChange}
                  color="default"
                ></Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-simple-select-label" color="default">
                  Tháng
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={user.birthDate}
                  label="Tháng"
                  onChange={handleMonthChange}
                  color="default"
                ></Select>
              </FormControl>

              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-simple-select-label" color="default">
                  Năm
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={user.birthDate}
                  label="Năm"
                  onChange={handleYearChange}
                  color="default"
                ></Select>
              </FormControl>
            </Stack>

            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              sx={{ m: "40px 0" }}
              spacing={22}
            >
              <Typography variant="h6">Địa chỉ: </Typography>
              <Typography variant="body1">
                {user.address ? `${user.address}` : ""}
              </Typography>
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
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={34} color="inherit" />
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProfileInform;
