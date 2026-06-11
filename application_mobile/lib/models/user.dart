class User {
  final int id;
  final String name;
  final String email;
  final String? avatarUrl;
  final String? phone;
  final double balance;
  final double? budget;
  final DateTime? weddingDate;
  final DateTime? emailVerifiedAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    this.phone,
    this.balance = 0.0,
    this.budget,
    this.weddingDate,
    this.emailVerifiedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['full_name'] ?? json['name'] ?? '',
      email: json['email'] ?? '',
      avatarUrl: json['avatar_url'],
      phone: json['phone'],
      balance: double.tryParse(json['balance'].toString()) ?? 0.0,
      budget: json['budget'] != null ? double.tryParse(json['budget'].toString()) : null,
      weddingDate: json['wedding_date'] != null ? DateTime.tryParse(json['wedding_date']) : null,
      emailVerifiedAt: json['email_verified_at'] != null ? DateTime.tryParse(json['email_verified_at']) : null,
    );
  }
}
