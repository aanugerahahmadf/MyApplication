import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/product.dart';
import '../models/package.dart';
import '../models/user.dart';
import '../models/order.dart';
import '../models/cart.dart';
import '../models/voucher.dart';
import '../models/cbir_item.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api';

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<Map<String, String>> _getHeaders() async {
    final token = await getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // --- Auth ---
  Future<Map<String, dynamic>> login(String login, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: json.encode({'login': login, 'password': password}),
    );
    return _handleResponse(response, saveToken: true);
  }

  Future<Map<String, dynamic>> register({
    required String fullName,
    required String username,
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: json.encode({
        'full_name': fullName,
        'username': username,
        'email': email,
        'password': password,
        'password_confirmation': password,
      }),
    );
    return _handleResponse(response, saveToken: true);
  }

  Future<void> logout() async {
    await http.post(
      Uri.parse('$baseUrl/logout'),
      headers: await _getHeaders(),
    );
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  Future<Map<String, dynamic>> sendOtp(String email, String purpose) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/send-otp'),
      headers: await _getHeaders(),
      body: json.encode({'email': email, 'purpose': purpose}),
    );
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> verifyOtp(String email, String otp, String purpose) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/verify-otp'),
      headers: await _getHeaders(),
      body: json.encode({'email': email, 'otp': otp, 'purpose': purpose}),
    );
    return _handleResponse(response);
  }

  // --- Profile ---
  Future<User> getUserProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/profile'),
      headers: await _getHeaders(),
    );
    final data = _handleResponse(response);
    return User.fromJson(data['data']);
  }

  // --- Catalog ---
  Future<List<Product>> getProducts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/products'),
      headers: await _getHeaders(),
    );
    final data = _handleResponse(response);
    final List list = data['data'] ?? [];
    return list.map((e) => Product.fromJson(e)).toList();
  }

  Future<List<Package>> getPackages() async {
    final response = await http.get(
      Uri.parse('$baseUrl/packages'),
      headers: await _getHeaders(),
    );
    final data = _handleResponse(response);
    final List list = data['data'] ?? [];
    return list.map((e) => Package.fromJson(e)).toList();
  }

  // --- Cart ---
  Future<List<CartItem>> getCart() async {
    final response = await http.get(
      Uri.parse('$baseUrl/cart'),
      headers: await _getHeaders(),
    );
    final data = _handleResponse(response);
    final List list = data['data'] ?? [];
    return list.map((e) => CartItem.fromJson(e)).toList();
  }

  Future<void> addToCart({int? productId, int? packageId, int quantity = 1}) async {
    await http.post(
      Uri.parse('$baseUrl/cart/add'),
      headers: await _getHeaders(),
      body: json.encode({
        if (productId != null) 'product_id': productId,
        if (packageId != null) 'package_id': packageId,
        'quantity': quantity,
      }),
    );
  }

  Future<void> removeFromCart(int cartId) async {
    await http.delete(
      Uri.parse('$baseUrl/cart/$cartId'),
      headers: await _getHeaders(),
    );
  }

  // --- Wishlist ---
  Future<List<Product>> getWishlist() async {
    final response = await http.get(
      Uri.parse('$baseUrl/wishlist'),
      headers: await _getHeaders(),
    );
    final data = _handleResponse(response);
    final List list = data['data'] ?? [];
    return list.map((e) => Product.fromJson(e)).toList();
  }

  Future<void> toggleWishlist(int? productId, int? packageId) async {
    await http.post(
      Uri.parse('$baseUrl/wishlist/toggle'),
      headers: await _getHeaders(),
      body: json.encode({
        if (productId != null) 'product_id': productId,
        if (packageId != null) 'package_id': packageId,
      }),
    );
  }

  // --- Vouchers ---
  Future<List<Voucher>> getVouchers() async {
    final response = await http.get(
      Uri.parse('$baseUrl/vouchers'),
      headers: await _getHeaders(),
    );
    final data = _handleResponse(response);
    final List list = data['data'] ?? [];
    return list.map((e) => Voucher.fromJson(e)).toList();
  }

  Future<void> claimVoucher(int voucherId) async {
    await http.post(
      Uri.parse('$baseUrl/vouchers/$voucherId/claim'),
      headers: await _getHeaders(),
    );
  }

  // --- Orders ---
  Future<List<Order>> getOrders() async {
    final response = await http.get(
      Uri.parse('$baseUrl/orders'),
      headers: await _getHeaders(),
    );
    final data = _handleResponse(response);
    final List list = data['data'] ?? [];
    return list.map((e) => Order.fromJson(e)).toList();
  }

  // --- CBIR ---
  Future<List<CbirItem>> searchByImage(File image) async {
    var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/cbir/search'));
    request.headers.addAll(await _getHeaders());
    request.files.add(await http.MultipartFile.fromPath('image', image.path));
    var streamedResponse = await request.send();
    var response = await http.Response.fromStream(streamedResponse);
    final data = _handleResponse(response);
    final List list = data['results'] ?? []; // Corrected key to 'results'
    return list.map((e) => CbirItem.fromJson(e)).toList();
  }

  Future<List<CbirItem>> searchByText(String query) async {
    final response = await http.get(
      Uri.parse('$baseUrl/search?query=$query'),
      headers: await _getHeaders(),
    );
    final data = _handleResponse(response);
    final List list = data['data'] ?? [];
    // If search text returns generic products, we might need a separate handler 
    // but usually search results are mixed in this project
    return list.map((e) => CbirItem.fromJson({'type': 'product', 'data': e})).toList();
  }

  // --- Helpers ---
  dynamic _handleResponse(http.Response response, {bool saveToken = false}) {
    final data = json.decode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (saveToken && data['token'] != null) {
        _saveToken(data['token']);
      }
      return data;
    } else {
      throw Exception(data['message'] ?? 'Request failed');
    }
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }
}
