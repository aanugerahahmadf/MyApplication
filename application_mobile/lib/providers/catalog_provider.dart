import 'dart:io';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/product.dart';
import '../models/package.dart';
import '../models/cbir_item.dart';

class CatalogProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Product> _products = [];
  List<Package> _packages = [];
  List<CbirItem> _searchResults = [];
  bool _isLoading = false;

  List<Product> get products => _products;
  List<Package> get packages => _packages;
  List<CbirItem> get searchResults => _searchResults;
  bool get isLoading => _isLoading;

  Future<void> fetchCatalogs() async {
    _isLoading = true;
    notifyListeners();
    try {
      _products = await _apiService.getProducts();
      _packages = await _apiService.getPackages();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> searchByImage(File image) async {
    _isLoading = true;
    _searchResults = [];
    notifyListeners();
    try {
      _searchResults = await _apiService.searchByImage(image);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> searchByText(String query) async {
    _isLoading = true;
    _searchResults = [];
    notifyListeners();
    try {
      _searchResults = await _apiService.searchByText(query);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
