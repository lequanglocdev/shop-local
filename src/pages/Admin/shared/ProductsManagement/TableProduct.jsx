/* eslint-disable import/order */
/* eslint-disable react/prop-types */
import * as React from "react";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { columns, customLocaleText } from "./until";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  deleteProduct,
  fetchProductID,
  fetchProducts,
  restoreProduct,
  updateProduct,
} from "./api";
import { set } from "lodash";
import useProductForm from "./useProductForm";

const paginationModel = { page: 0, pageSize: 5 };

export default function TableProduct({ reloadTrigger }) {
  const [rows, setRows] = React.useState([]);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState("");

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);

  const [restoreConfirmOpen, setRestoreConfirmOpen] = React.useState(false);
  const [productToRestore, setProductToRestore] = React.useState(null);
  const [productToRestoreName, setProductToRestoreName] = React.useState("");

  const [editOpen, setEditOpen] = React.useState(false);

  const {
    categories,

    sizes,

    colors,
  } = useProductForm();

  const [selectedProduct, setSelectedProduct] = React.useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: null,
    sizes: [],
    colors: [],
    images: [],
  });
  React.useEffect(() => {
    const getData = async () => {
      try {
        const products = await fetchProducts();
        setRows(
          products.map((p) => ({
            ...p,
            onEdit: handleEdit,
            onDelete: handleDelete,
            onRestoreClick: handleRestoreClick,
          }))
        );
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadTrigger]);

  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const token = localStorage.getItem("accessToken");

    try {
      const success = await deleteProduct(productToDelete, token);
      if (success) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === productToDelete
              ? { ...row, status: "Ngưng hoạt động" }
              : row
          )
        );
        showDialog("Sản phẩm đã được chuyển sang trạng thái ngưng hoạt động!");
      }
    } catch (err) {
      showDialog("Xóa thất bại: " + err.message);
    } finally {
      setConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const showDialog = (message) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const handleRestoreClick = (productId, productName) => {
    console.log("Handling restore for:", productId, productName);
    setProductToRestore(productId);
    setProductToRestoreName(productName);
    setRestoreConfirmOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (!productToRestore) return;
    const token = localStorage.getItem("accessToken");

    try {
      const success = await restoreProduct(productToRestore, token);
      if (success) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === productToRestore ? { ...row, status: "Hoạt động" } : row
          )
        );
        showDialog(`Sản phẩm "${productToRestoreName}" đã được khôi phục.`);
      }
    } catch (err) {
      showDialog("Khôi phục thất bại: " + err.message);
    } finally {
      setRestoreConfirmOpen(false);
      setProductToRestore(null);
    }
  };

  const handleEdit = async (product) => {
    const token = localStorage.getItem("accessToken");
    try {
      const productDetail = await fetchProductID(product.id, token);
      console.log("Fetched detail:", productDetail);
      setSelectedProduct({
        ...productDetail,
        sizes: productDetail.sizes || [], // Đảm bảo sizes là mảng
      });
      setEditOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error.message);
      showDialog("Không thể lấy thông tin sản phẩm!");
    }
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
  };

  const handleUpdateProduct = async () => {
    const token = localStorage.getItem("accessToken");

    // Chuẩn hóa dữ liệu để khớp với backend yêu cầu
    const payload = {
      ...selectedProduct,
      category: selectedProduct.category
        ? { id: selectedProduct.category.id }
        : null,
      sizes: selectedProduct.sizes.map((s) => ({ id: s.id })),
      colors: selectedProduct.colors.map((c) => ({ id: c.id })),
      images: selectedProduct.images.map((img) => ({
        id: img.id,
        fileName: img.fileName,
        imageUrl: img.imageUrl,
      })),
    };

    try {
      const updated = await updateProduct(selectedProduct.id, payload, token);
      showDialog("Sản phẩm đã được cập nhật thành công!");
      setEditOpen(false);

      // Cập nhật hàng trong bảng nếu cần
      setRows((prev) =>
        prev.map((row) =>
          row.id === updated.id ? { ...row, ...updated } : row
        )
      );
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
      showDialog("Cập nhật sản phẩm thất bại!");
    }
  };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        localeText={customLocaleText}
        sx={{ border: 0 }}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={restoreConfirmOpen}
        onClose={() => setRestoreConfirmOpen(false)}>
        <DialogTitle>Xác nhận khôi phục</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn khôi phục sản phẩm không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreConfirmOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirmRestore} color="success">
            Khôi phục
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        {console.log("SelectedProduct.sizes:", selectedProduct.sizes)}
        {console.log("All sizes list:", sizes)}
        <DialogTitle>Cập nhật sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            margin="dense"
            value={selectedProduct?.name}
            onChange={(e) =>
              setSelectedProduct((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="dense"
            value={selectedProduct?.description}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <TextField
            label="Giá"
            fullWidth
            type="number"
            margin="dense"
            value={selectedProduct.price}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
          />

          <TextField
            label="Số lượng"
            fullWidth
            type="number"
            margin="dense"
            value={selectedProduct.quantity}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                quantity: e.target.value,
              }))
            }
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedProduct.category}
              label="Danh mục"
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              renderValue={(selected) => selected?.name || "Không có danh mục"}>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Kích thước</InputLabel>
            <Select
              multiple
              value={selectedProduct.sizes.map((size) => size?.id)} // Chỉ lấy id của các kích thước được chọn
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  sizes: e.target.value.map((id) => {
                    return sizes.find((size) => size?.id === id); // Tìm kích thước từ mảng sizes dựa trên id
                  }),
                }))
              }
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const size = sizes.find((s) => s?.id === id);

                    return size ? size?.name : "";
                  })
                  .join(", ")
              }>
              {sizes.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Màu sắc</InputLabel>
            <Select
              value={selectedProduct.colors}
              label="Màu sắc"
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  colors: e.target.value,
                }))
              }
              renderValue={(selected) =>
                selected.map((c) => c.name).join(", ")
              }>
              {colors.map((color) => (
                <MenuItem key={color.id} value={color}>
                  {color.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={2}>
            <input type="file" multiple accept="image/*" />

            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {selectedProduct.images.map((img, index) => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  alt={`preview-${index}`}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEdit}>Hủy</Button>
          <Button onClick={handleUpdateProduct}>Cập nhật</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
