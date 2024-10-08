import mongoose from "mongoose";
import { Product } from "./Product.models";

const orderItemsSchema = mongoose.Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
  },
});
const orderSchema = mongoose.Schema(
  {
    orderPrice: {
      type: Number,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Cancelled", "Delivered"],
      default: "Pending",
    },
    orderItems: {
      type: [orderItemsSchema],
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
