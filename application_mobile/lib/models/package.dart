class Package {
  final int id;
  final String name;
  final String? description;
  final double price;
  final double? discountPrice;
  final String? imageUrl;
  final bool isFeatured;
  final String? categoryName;
  final String? theme;
  final String? color;

  Package({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    this.discountPrice,
    this.imageUrl,
    this.isFeatured = false,
    this.categoryName,
    this.theme,
    this.color,
  });

  factory Package.fromJson(Map<String, dynamic> json) {
    return Package(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'],
      price: double.tryParse(json['price'].toString()) ?? 0.0,
      discountPrice: json['discount_price'] != null ? double.tryParse(json['discount_price'].toString()) : null,
      imageUrl: json['image_url'],
      isFeatured: json['is_featured'] ?? false,
      categoryName: json['category'] != null ? json['category']['name'] : null,
      theme: json['theme'],
      color: json['color'],
    );
  }

  double get finalPrice => (discountPrice != null && discountPrice! > 0) ? discountPrice! : price;
}
