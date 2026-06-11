import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../models/user.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  User? _user;
  String? _token;
  bool _isLoading = false;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null;

  AuthProvider() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    if (_token != null) {
      try {
        await fetchProfile();
      } catch (e) {
        logout();
      }
    }
    notifyListeners();
  }

  Future<void> login(String login, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _apiService.login(login, password);
      _token = response['data']['token']; // Fixed path based on Laravel response
      await fetchProfile();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String fullName,
    required String username,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _apiService.register(
        fullName: fullName,
        username: username,
        email: email,
        password: password,
      );
      _token = response['data']['token']; // Fixed path based on Laravel response
      await fetchProfile();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchProfile() async {
    _user = await _apiService.getUserProfile();
    notifyListeners();
  }

  Future<void> logout() async {
    await _apiService.logout();
    _token = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    notifyListeners();
  }
}
