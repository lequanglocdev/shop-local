import { createSlice } from "@reduxjs/toolkit";
import { cartApi } from "@/services/api/cart";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [], // Danh sách sản phẩm trong giỏ hàng (không lưu quantity)
    cartTotalQuantity: 0, // Số lượng mặt hàng (dựa trên cartItems.length)
    cartTotalAmount: 0, // Tổng giá tiền
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) =>
          item.productId === newItem.productId &&
          item.color === newItem.color &&
          item.size === newItem.size
      );

      if (!existingItem) {
        // Chỉ thêm nếu sản phẩm chưa tồn tại
        state.cartItems.push(newItem);
      }

      state.cartTotalQuantity = state.cartItems.length; // Số lượng mặt hàng
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price,
        0
      );
    },
    removeFromCart: (state, action) => {
      const { productId, color, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.color === color &&
            item.size === size
          )
      );

      state.cartTotalQuantity = state.cartItems.length;
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price,
        0
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.getCartByUser.matchFulfilled,
      (state, action) => {
        const cartData = action.payload;
        // Nếu API trả về carts: [] nhưng cartItems đã có dữ liệu, giữ nguyên cartItems
        if (
          cartData &&
          cartData.carts &&
          cartData.carts.length === 0 &&
          state.cartItems.length > 0
        ) {
          return; // Giữ nguyên dữ liệu hiện tại
        }

        if (cartData && cartData.carts && cartData.carts.length > 0) {
          const serverCart = cartData.carts[0];
          state.cartItems = serverCart.products.map((product) => ({
            productId: product.id,
            image: product.thumbnail,
            name: product.title,
            price: product.price,
            color: "TRẮNG",
            size: "S",
          }));

          state.cartTotalQuantity = state.cartItems.length;
          state.cartTotalAmount = state.cartItems.reduce(
            (total, item) => total + item.price,
            0
          );
        } else {
          state.cartItems = [];
          state.cartTotalQuantity = 0;
          state.cartTotalAmount = 0;
        }
      }
    );

    // Không đồng bộ cartItems từ response của addToCart và updateCart
    builder.addMatcher(
      cartApi.endpoints.addToCart.matchFulfilled,
      (state) => {
        // Không làm gì, vì cartItems đã được cập nhật qua action addToCart
      }
    );

    builder.addMatcher(
      cartApi.endpoints.updateCart.matchFulfilled,
      (state) => {
        // Không làm gì, vì cartItems đã được cập nhật qua action addToCart
      }
    );

    builder.addMatcher(
      cartApi.endpoints.deleteCart.matchFulfilled,
      (state) => {
        state.cartItems = [];
        state.cartTotalQuantity = 0;
        state.cartTotalAmount = 0;
      }
    );
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;