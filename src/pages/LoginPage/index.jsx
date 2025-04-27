import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useLoginMutation, useGetMyInfoQuery } from "@/services/api/auth";
import { setUser } from "@/store/redux/user/reducer";
import customTheme from "@/components/CustemTheme";

const Login = () => {
  const outerTheme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [userData, setUserData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    data: myInfo,
    isLoading: isMyInfoLoading,
    error: myInfoError,
    refetch: refetchMyInfo,
  } = useGetMyInfoQuery(undefined, {
    skip: !userData,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleShowSnackbar = (success, message = "") => {
    setSnackbar({
      open: true,
      message:
        message || (success ? "Đăng nhập thành công" : "Đăng nhập thất bại !"),
      severity: success ? "success" : "error",
    });
  };

  useEffect(() => {
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message || "",
        severity: location.state.severity || "success",
      });
    }
    window.history.replaceState({}, document.title);
  }, [location]);

  useEffect(() => {
    if (myInfoError) {
      // Xử lý lỗi khi gọi /v1/auth/myInfo
      handleShowSnackbar(false, "Không thể lấy thông tin người dùng!");
      return;
    }

    if (myInfo && userData) {
      const role = myInfo?.result?.roles?.[0]?.name || "USER";
      const updatedUserData = {
        ...userData,
        result: {
          ...userData.result,
          role: role,
        },
      };

      dispatch(setUser(updatedUserData));

      // Hiển thị thông báo thành công trước khi điều hướng
      handleShowSnackbar(true);

      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1500);
    }
  }, [myInfo, myInfoError, userData, dispatch, navigate]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    setError("");

    try {
      const response = await login({
        email: data?.email,
        password: data?.password,
      }).unwrap();

      if (response) {
        localStorage.setItem("accessToken", response.result.accessToken);

        const newUserData = {
          code: response.code,
          message: response.message,
          result: {
            accessToken: response.result.accessToken,
            refreshToken: response.result.refreshToken,
            authenticated: response.result.authenticated,
            email: response.result.email,
          },
        };

        setUserData(newUserData);
        refetchMyInfo(); // Gọi /v1/auth/myInfo sau khi đăng nhập thành công
      }
    } catch (error) {
      // Chỉ hiển thị "Đăng nhập thất bại !" nếu lỗi từ login (đăng nhập sai)
      handleShowSnackbar(false);
      console.log("Login failed:", error);
    }
  };

  return (
    <div className={styles.wrappers}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", p: "10px 20px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Stack>
        <Stack
          sx={{
            backgroundColor: "white",
            width: 500,
            height: 500,
            borderRadius: 4,
            boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
          }}>
          <div>
            <h2
              style={{
                textAlign: "center",
                margin: "46px 0 20px 0",
                fontWeight: "inherit",
              }}>
              ĐĂNG NHẬP
            </h2>

            <Stack
              sx={{ padding: "0px 36px" }}
              component={"form"}
              onSubmit={handleSubmit(onSubmit)}>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Stack className={styles.formLabelInput}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    disabled={isLoginLoading || isMyInfoLoading}
                    {...register("email", {
                      required: "Email không được để trống",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                  />
                </ThemeProvider>
                {errors.email && (
                  <p className={styles.errorMessage}>{errors.email.message}</p>
                )}
              </Stack>

              <Stack className={styles.formLabelInput}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="password"
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    disabled={isLoginLoading || isMyInfoLoading}
                    {...register("password", {
                      required: "Mật khẩu không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                            disabled={isLoginLoading || isMyInfoLoading}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </ThemeProvider>
                {errors.password && (
                  <p className={styles.errorMessage}>
                    {errors.password.message}
                  </p>
                )}
              </Stack>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "6px 16px",
                  marginTop: "14px",
                  fontSize: "1.2rem",
                  fontWeight: "regular",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
                type="submit"
                disabled={isLoginLoading || isMyInfoLoading}>
                {isLoginLoading || isMyInfoLoading ? (
                  <CircularProgress size={34} color="inherit" />
                ) : (
                  "ĐĂNG NHẬP"
                )}
              </Button>
            </Stack>

            <Stack sx={{ display: "flex", alignItems: "center" }}>
              <Link className={styles.forgotPassword} to="forgotPassword">
                Bạn quên mật khẩu?
              </Link>

              <span style={{ margin: "12px 0 0 0" }}>
                Bạn chưa có tài khoản?
                <Link className={styles.createAccount} to="/register">
                  Tạo tài khoản ngay
                </Link>
              </span>

              <Link className={styles.backToHome} to="/">
                Trở về trang chủ
              </Link>
            </Stack>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default Login;
