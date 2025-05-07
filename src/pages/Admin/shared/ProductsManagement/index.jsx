import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import TableProduct from "./TableProduct";
import { createProduct, handleUpload } from "./api";

import useProductForm from "./useProductForm";
import { validateProduct } from "./until";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  images: [],
};

const ProductsManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [reloadTable, setReloadTable] = useState(false);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productForm, setProductForm] = useState(initialFormState);

  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    sizes,
    selectedSizeId,
    setSelectedSizeId,
    colors,
    selectedColorId,
    setSelectedColorId,
  } = useProductForm();

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      const uploaded = await Promise.all(
        [...files].map((file) => handleUpload(file))
      );
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
      setErrors((prev) => ({ ...prev, productImage: undefined }));
    } catch (err) {
      console.error("Upload failed:", err);
      setErrors((prev) => ({
        ...prev,
        productImage: "Không thể upload ảnh",
      }));
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductForm(initialFormState);
    setSelectedCategoryId("");
    setSelectedSizeId([]);
    setSelectedColorId([]);
    setErrors({});
  };

  const handleSaveProduct = async () => {
    const validationErrors = validateProduct({
      ...productForm,
      selectedCategoryId,
      selectedSizeId,
      selectedColorId,
    });
    console.log("Validation Errors:", validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      quantity: Number(productForm.quantity),
      categoryId: Number(selectedCategoryId),
      colorIds: selectedColorId.map(Number),
      sizeIds: selectedSizeId.map(Number),
      imageIds: productForm.images.map((img) => img.id),
    };

    try {
      await createProduct(payload);
      handleCloseModal();
      setReloadTable((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm sản phẩm");
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Sản phẩm
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <FormControl fullWidth>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={category}
            label="Danh mục"
            onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            label="Trạng thái"
            onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="ACTIVE">Hoạt động</MenuItem>
            <MenuItem value="INACTIVE">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          sx={{ width: "400px" }}
          onClick={() => setOpenModal(true)}>
          Thêm sản phẩm
        </Button>
      </Box>

      <TableProduct rows={filteredProducts} reloadTrigger={reloadTable} />

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Thêm Sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            margin="dense"
            value={productForm.name}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, name: e.target.value }))
            }
            error={!!errors.productName}
            helperText={errors.productName}
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="dense"
            value={productForm.description}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            error={!!errors.productDes}
            helperText={errors.productDes}
          />
          <TextField
            label="Giá"
            fullWidth
            type="number"
            margin="dense"
            value={productForm.price}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, price: e.target.value }))
            }
            error={!!errors.productPrice}
            helperText={errors.productPrice}
          />
          <TextField
            label="Số lượng"
            fullWidth
            type="number"
            margin="dense"
            value={productForm.quantity}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, quantity: e.target.value }))
            }
            error={!!errors.productQuantity}
            helperText={errors.productQuantity}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              label="Danh mục">
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedCategoryId && (
              <Typography color="error" variant="caption">
                {errors.selectedCategoryId}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Kích thước</InputLabel>
            <Select
              multiple
              value={selectedSizeId}
              onChange={(e) => setSelectedSizeId(e.target.value)}
              label="Kích thước">
              {sizes.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedSizeId && (
              <Typography color="error" variant="caption">
                {errors.selectedSizeId}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Màu sắc</InputLabel>
            <Select
              multiple
              value={selectedColorId}
              onChange={(e) => setSelectedColorId(e.target.value)}
              label="Màu sắc">
              {colors.map((color) => (
                <MenuItem key={color.id} value={color.id}>
                  {color.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedColorId && (
              <Typography color="error" variant="caption">
                {errors.selectedColorId}
              </Typography>
            )}
          </FormControl>

          <Box mt={2}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.productImage && (
              <Typography variant="caption" color="error">
                {errors.productImage}
              </Typography>
            )}
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {productForm.images.map((img) => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  alt={`Uploaded ${img.id}`}
                  style={{
                    width: 100,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button onClick={handleSaveProduct}>Thêm</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayoutWrapper>
  );
};

export default ProductsManagement;
