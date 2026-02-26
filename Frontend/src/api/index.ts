export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
}

export interface User {
  email: string;
  role: 'admin' | 'user';
  token: string;
}

export interface CartItem extends Product {
  quantity: number;
}