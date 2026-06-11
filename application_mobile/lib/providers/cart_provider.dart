import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/cart.dart';

class CartProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  List<CartItem> _items = [];
  bool _isLoading = false;

  List<CartItem> get items => _items;
  bool get isLoading => _isLoading;

  double get totalAmount {
    return _items.fold(0.0, (sum, item) => sum + item.subtotal);
  }

  Future<void> fetchCart() async {
    _isLoading = true;
    notifyListeners();
    try {
      _items = await _apiService.getCart();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addToCart({int? productId, int? packageId}) async {
    await _apiService.addToCart(productId: productId, packageId: packageId);
    await fetchCart();
  }

  Future<void> removeItem(int cartId) async {
    await _apiService.removeFromCart(cartId);
    _items.removeWhere((item) => item.id == cartId);
    notifyListeners();
  }
}
