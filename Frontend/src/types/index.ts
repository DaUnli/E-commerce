export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface ProductImage {
  public_id: string;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: ProductImage[];
  ratings: number;
  numOfReviews: number;
  stock: number;
}

export interface CartProduct {
  productId: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  userId: string;
  products: CartProduct[];
}

export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  totalPrice: number;
  shippingAddress: string;
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid";
  createdAt: string;
}
