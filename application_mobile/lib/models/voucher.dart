class Voucher {
  final int id;
  final String code;
  final String? description;
  final String discountType;
  final double discountAmount;
  final double minPurchase;
  final DateTime? expiresAt;
  final bool isClaimed;

  Voucher({
    required this.id,
    required this.code,
    this.description,
    required this.discountType,
    required this.discountAmount,
    required this.minPurchase,
    this.expiresAt,
    this.isClaimed = false,
  });

  factory Voucher.fromJson(Map<String, dynamic> json) {
    return Voucher(
      id: json['id'],
      code: json['code'] ?? '',
      description: json['description'],
      discountType: json['discount_type'] ?? 'fixed',
      discountAmount: double.tryParse(json['discount_amount'].toString()) ?? 0.0,
      minPurchase: double.tryParse(json['min_purchase'].toString()) ?? 0.0,
      expiresAt: json['expires_at'] != null ? DateTime.tryParse(json['expires_at']) : null,
      isClaimed: json['is_claimed'] ?? false,
    );
  }

  String get discountLabel {
    if (discountType == 'percentage') {
      return '${discountAmount.toStringAsFixed(0)}%';
    }
    return 'Rp ${discountAmount.toStringAsFixed(0)}';
  }
}
