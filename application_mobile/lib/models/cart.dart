import 'product.dart';
import 'package:application_mobile/models/package.dart';

class CartItem {
  final int id;
  final int? productId;
  final int? packageId;
  final int quantity;
  final Product? product;
  final Package? package;

  CartItem({
    required this.id,
    this.productId,
    this.packageId,
    required this.quantity,
    this.product,
    this.package,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'],
      productId: json['product_id'],
      packageId: json['package_id'],
      quantity: json['quantity'] ?? 1,
      product: json['product'] != null ? Product.fromJson(json['product']) : null,
      package: json['package'] != null ? Package.fromJson(json['package']) : null,
    );
  }

  double get subtotal {
    if (product != null) return product!.finalPrice * quantity;
    if (package != null) return package!.finalPrice * quantity;
    return 0.0;
  }

  String get name => product?.name ?? package?.name ?? 'Unknown Item';
  String? get imageUrl => product?.imageUrl ?? package?.imageUrl;
}
