import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import SwiperProducts from "../../components/SwiperProducts";

import { Alert, Container, Grid, Snackbar, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import styles from "./index.module.css";
import { useEffect, useState } from "react";

const slides = [
  "/src/assets/images/backgroundFashions/backgroundHomePage.jpg",
  "/src/assets/images/backgroundFashions/backgroundHomePage-1.jpg",
  "/src/assets/images/backgroundFashions/backgroundHomePage-2.jpg",
  "/src/assets/images/backgroundFashions/backgroundHomePage-3.jpg",
];

const categories = [
  { src: "/src/assets/images/categories/T-shirt.jpg", title: "ÁO THUN" },
  { src: "/src/assets/images/categories/Shirt.jpg", title: "ÁO SƠ MI" },
  { src: "/src/assets/images/categories/Jacket.jpg", title: "ÁO KHOÁC" },
  { src: "/src/assets/images/categories/Trouser.jpg", title: "QUẦN DÀI" },
  { src: "/src/assets/images/categories/Shorts.jpg", title: "QUẦN SHORTS" },
  { src: "/src/assets/images/categories/Accessories.jpg", title: "PHỤ KIỆN" },
];

const Home = () => {
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* Show message when login successfully */}
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

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        style={{ width: "100%", height: "400px", color: "#fff" }}>
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              style={{
                objectFit: "cover",
                height: "100%",
                width: "100%",
              }}
              src={slide}
              alt={`Slide ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Container maxWidth="lg">
        <Grid container spacing={12}>
          {categories.map((item, index) => (
            <Grid
              sx={{
                marginTop: 6,
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              item
              xl={4}
              lg={4}
              sm={6}
              xs={12}
              key={index}>
              <Link to="/listProducts">
                <Stack className={styles.wrapperImg}>
                  <img
                    className={styles.mediaImg}
                    src={item.src}
                    alt={item.title}
                  />
                  <Stack className={styles.contentImg}>
                    <h2
                      style={{ fontSize: 32, fontWeight: 500, color: "white" }}>
                      {item.title}
                    </h2>
                  </Stack>
                </Stack>
              </Link>
            </Grid>
          ))}
        </Grid>

        <SwiperProducts />
      </Container>
    </>
  );
};

export default Home;
