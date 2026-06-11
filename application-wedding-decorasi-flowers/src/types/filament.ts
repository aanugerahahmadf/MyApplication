export interface FilamentResource {
  id: string | number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Product extends FilamentResource {
  description: string;
  price: number;
  discount_price: number;
  final_price: number;
  image_url: string;
  stock: number;
  category_id: number;
  category?: Category;
  rating?: string | number;
  discount_pct?: number;
}

export interface Package extends FilamentResource {
  description: string;
  price: number;
  discount_price: number;
  final_price: number;
  image_url: string;
  category?: Category;
  rating?: string | number;
}

export interface Category extends FilamentResource {
  icon?: string;
}

export interface Order extends FilamentResource {
  order_number: string;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  booking_date: string;
  quantity: number;
  product?: Product;
}

export interface Review extends FilamentResource {
  rating: number;
  comment: string;
  user_id: number;
  product_id: number;
  product?: Product;
  date: string;
}
