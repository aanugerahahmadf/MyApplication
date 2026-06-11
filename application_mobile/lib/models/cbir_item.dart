import 'product.dart';
import 'package:application_mobile/models/package.dart';

class CbirItem {
  final String type; // 'package' or 'product'
  final double similarity;
  final int id;
  final String name;
  final String? description;
  final double price;
  final double discountPrice;
  final String? imageUrl;
  final String? category;

  CbirItem({
    required this.type,
    required this.similarity,
    required this.id,
    required this.name,
    this.description,
    required this.price,
    required this.discountPrice,
    this.imageUrl,
    this.category,
  });

  factory CbirItem.fromJson(Map<String, dynamic> json) {
    final data = json['data'] ?? {};
    return CbirItem(
      type: json['type'] ?? 'product',
      similarity: double.tryParse(json['similarity'].toString()) ?? 0.0,
      id: data['id'],
      name: data['name'] ?? '',
      description: data['description'],
      price: double.tryParse(data['price'].toString()) ?? 0.0,
      discountPrice: double.tryParse(data['discount_price'].toString()) ?? 0.0,
      imageUrl: data['image_url'],
      category: data['category'],
    );
  }

  double get finalPrice => (discountPrice > 0) ? discountPrice : price;

  // Helpers to convert to existing models if needed for detail screens
  Product toProduct() {
    return Product(
      id: id,
      name: name,
      description: description,
      price: price,
      discountPrice: discountPrice,
      imageUrl: imageUrl,
      stock: 1, // CBIR results might not have stock info in data map
      categoryName: category,
    );
  }

  Package toPackage() {
    return Package(
      id: id,
      name: name,
      description: description,
      price: price,
      discountPrice: discountPrice,
      imageUrl: imageUrl,
      categoryName: category,
    );
  }
}
