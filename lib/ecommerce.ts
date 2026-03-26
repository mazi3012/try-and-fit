/**
 * Professional Ecommerce Logic Layer
 * Separated from try-on logic to keep the codebase clean.
 */

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  category_id: string;
  image_url: string;
  images: string[];
  sizes: string[];
  brand: string;
  tags: string[];
  in_stock: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
};

export type CartItem = {
  id: string;
  product_id: string;
  product: Product;
  size: string;
  quantity: number;
};

// --- Product APIs ---

export async function getProducts(categoryId?: string, limit = 20) {
  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .eq('in_stock', true);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data as (Product & { categories: Category })[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as (Product & { categories: Category });
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Category[];
}

// --- Cart APIs ---

export async function getCart() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('user_id', user.id);

  if (error) throw error;
  return data as CartItem[];
}

export async function addToCart(productId: string, size: string, quantity = 1) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Auth required to add to cart");

  const { data, error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: user.id,
      product_id: productId,
      size,
      quantity
    }, { onConflict: 'user_id, product_id, size' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromCart(itemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
}

// --- Order APIs ---

export async function createOrder(payload: {
  total: number;
  shipping: {
    name: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
  }
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Auth required to place order");

  // Get cart items first
  const cart = await getCart();
  if (cart.length === 0) throw new Error("Cart is empty");

  // 1. Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total: payload.total,
      shipping_name: payload.shipping.name,
      shipping_address: payload.shipping.address,
      shipping_city: payload.shipping.city,
      shipping_pincode: payload.shipping.pincode,
      shipping_phone: payload.shipping.phone,
      status: 'confirmed'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order items
  const orderItems = cart.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    size: item.size,
    quantity: item.quantity,
    price_at_purchase: item.product.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // 3. Clear cart
  await supabase.from('cart_items').delete().eq('user_id', user.id);

  return order;
}
