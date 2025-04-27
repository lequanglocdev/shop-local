import { useEffect, useState } from "react";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductImagesManagement = () => {
  const [images, setImages] = useState([]);

  // Hàm fetch danh sách ảnh
  const fetchImages = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:8080/adamstore/v1/file/all?pageNo=1&pageSize=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.code === 200) {
        setImages(data.result?.items);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách ảnh", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Hàm xử lý upload ảnh
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("fileImage", file); // tên field là "image"

    try {
      const res = await fetch(
        "http://localhost:8080/adamstore/v1/file/upload/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (data.code === 200) {
        setImages((prev) => [...prev, data.result]);
      }
    } catch (err) {
      console.error("Lỗi khi upload ảnh", err);
    }
  };

  // Hàm xử lý xoá ảnh
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/adamstore/v1/file/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.code === 200) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch (err) {
      console.error("Lỗi khi xoá ảnh", err);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Hình ảnh Sản phẩm
      </Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" color="primary" component="label">
          Tải lên hình ảnh
          <input type="file" accept="image/*" hidden onChange={handleUpload} />
        </Button>
        <Button variant="outlined" color="primary" onClick={fetchImages}>
          Làm mới
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên file</TableCell>
            <TableCell>Hình ảnh</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {images.map((img) => (
            <TableRow key={img.id}>
              <TableCell>{img.id}</TableCell>
              <TableCell>{img.fileName}</TableCell>
              <TableCell>
                <img src={img.imageUrl} alt={img.fileName} width={100} />
              </TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => handleDelete(img.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardLayoutWrapper>
  );
};

export default ProductImagesManagement;
