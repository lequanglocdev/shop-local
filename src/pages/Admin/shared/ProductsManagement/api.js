export const fetchCategories = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://localhost:8080/adamstore/v1/categories/admin?pageNo=1&pageSize=10",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Lỗi khi lấy danh mục. Vui lòng kiểm tra token hoặc API.");
  }

  const data = await response.json();
  return data.result.items;
};

export const fetchSize = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://localhost:8080/adamstore/v1/sizes?pageNo=1&pageSize=10",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Lỗi khi lấy size. Vui lòng kiểm tra token hoặc API.");
  }

  const data = await response.json();
  return data.result.items;
};

export const fetchColor = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://localhost:8080/adamstore/v1/colors?pageNo=1&pageSize=100",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Lỗi khi lấy màu. Vui lòng kiểm tra token hoặc API.");
  }

  const data = await response.json();
  return data.result.items;
};

export const handleUpload = async (file) => {
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("fileImage", file);

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
    console.log("Response từ API:", data);

    if (data.code === 200 && data.result) {
      return {
        id: data.result.id,
        imageUrl: data.result.imageUrl,
      };
    } else {
      throw new Error(data.message || "Upload failed");
    }
  } catch (err) {
    console.error("Lỗi khi upload ảnh", err);
    throw err;
  }
};

export const createProduct = async (productData) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:8080/adamstore/v1/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("Thêm sản phẩm thất bại");
  }

  return await response.json();
};

export const fetchProducts = async () => {
  try {
    const res = await fetch(
      "http://localhost:8080/adamstore/v1/products/admin?pageNo=1&pageSize=100"
    );
    const data = await res.json();

    return data.result.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      available: item.isAvailable ? "Còn hàng" : "Hết hàng",
      averageRating: item.averageRating,
      sold: item.soldQuantity,
      totalReviews: item.totalReviews,
      stock: item.quantity,
      price: item.price.toLocaleString("vi-VN") + " ₫",
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      category: item.category?.name || "Không có danh mục",
      color: item.colors.map((c) => c.name).join(", ") || "Không có màu ",
      size: item.sizes.map((s) => s.name).join(", ") || "Không có kích thước",
      images: item.images,
      status: item.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động",
      actions: "", // Hoặc thêm các hành động khác nếu muốn
    }));
  } catch (err) {
    throw new Error("Lỗi khi fetch sản phẩm: " + err.message);
  }
};

export const deleteProduct = async (productId, token) => {
  try {
    const res = await fetch(
      `http://localhost:8080/adamstore/v1/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Đã có lỗi xảy ra");
    }
    return true;
  } catch (err) {
    throw new Error(err.message || "Lỗi kết nối khi xóa sản phẩm");
  }
};

export const restoreProduct = async (productId, token) => {
  try {
    const res = await fetch(
      `http://localhost:8080/adamstore/v1/products/${productId}/restore`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Lỗi không rõ");
    }
    return true;
  } catch (err) {
    throw new Error(err.message || "Lỗi kết nối khi khôi phục sản phẩm");
  }
};

export const fetchProductID = async (productId, token) => {
  try {
    const res = await fetch(
      `http://localhost:8080/adamstore/v1/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    const item = data.result;

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      available: item.isAvailable ? "Còn hàng" : "Hết hàng",
      averageRating: item.averageRating,
      sold: item.soldQuantity,
      totalReviews: item.totalReviews,
      stock: item.quantity,
      price: item.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      category: item.category,
      color: item.colors || [],
      sizes: item.sizes || [],
      images: item.images || [],
      status: item.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động",
    };
  } catch (err) {
    throw new Error("Lỗi khi fetch sản phẩm: " + err.message);
  }
};

export async function updateProduct(productId, payload, token) {
  const response = await fetch(
    `http://localhost:8080/adamstore/v1/products/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Lỗi khi cập nhật sản phẩm");
  }

  return await response.json(); // <- Quan trọng!
}
