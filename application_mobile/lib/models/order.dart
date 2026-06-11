class Order {
  final int id;
  final String orderNumber;
  final double totalPrice;
  final String status;
  final String paymentStatus;
  final String? bookingDate;
  final String? productName;
  final String? packageName;

  Order({
    required this.id,
    required this.orderNumber,
    required this.totalPrice,
    required this.status,
    required this.paymentStatus,
    this.bookingDate,
    this.productName,
    this.packageName,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      orderNumber: json['order_number'] ?? '',
      totalPrice: double.tryParse(json['total_price'].toString()) ?? 0.0,
      status: json['status'] ?? 'pending',
      paymentStatus: json['payment_status'] ?? 'pending',
      bookingDate: json['booking_date'],
      productName: json['product'] != null ? json['product']['name'] : null,
      packageName: json['package'] != null ? json['package']['name'] : null,
    );
  }
}
