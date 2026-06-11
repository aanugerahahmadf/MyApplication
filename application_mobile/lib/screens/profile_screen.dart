import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/user.dart';
import 'order_history_screen.dart';
import 'history_screen.dart';
import 'edit_profile_screen.dart';
import 'reviews_screen.dart';
import 'catalog_list_screen.dart';
import 'wishlist_screen.dart';
import 'voucher_screen.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final apiService = Provider.of<ApiService>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.red),
            onPressed: () async {
              await apiService.logout();
              if (context.mounted) {
                Navigator.pushReplacementNamed(context, '/login');
              }
            },
          ),
        ],
      ),
      body: FutureBuilder<User>(
        future: apiService.getUserProfile(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final user = snapshot.data!;
          return SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 20),
                Center(
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 60,
                        backgroundColor: Colors.grey[200],
                        backgroundImage: user.avatarUrl != null ? NetworkImage(user.avatarUrl!) : null,
                        child: user.avatarUrl == null ? const Icon(Icons.person, size: 60, color: Colors.grey) : null,
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFF6366F1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.edit, color: Colors.white, size: 20),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  user.name,
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                Text(
                  user.email,
                  style: const TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 24),
                
                _buildProfileItem(
                  context,
                  icon: Icons.person_outline,
                  title: 'Edit Profile',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => EditProfileScreen(user: user))),
                ),
                _buildProfileItem(
                  context,
                  icon: Icons.history,
                  title: 'Riwayat',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const HistoryScreen())),
                ),
                _buildProfileItem(
                  context,
                  icon: Icons.inventory_2_outlined,
                  title: 'Katalog Paket Bunga',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const CatalogListScreen(title: 'Paket Bunga', isPackage: true))),
                ),
                _buildProfileItem(
                  context,
                  icon: Icons.local_florist_outlined,
                  title: 'Katalog Bunga',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const CatalogListScreen(title: 'Bunga'))),
                ),
                _buildProfileItem(
                  context,
                  icon: Icons.rate_review_outlined,
                  title: 'Ulasan',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const ReviewsScreen())),
                ),
                _buildProfileItem(
                  context,
                  icon: Icons.confirmation_number_outlined,
                  title: 'Voucher & Promo',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const VoucherScreen())),
                ),
                _buildProfileItem(
                  context,
                  icon: Icons.favorite_border,
                  title: 'Wishlist',
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const WishlistScreen())),
                ),
                const SizedBox(height: 32),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildProfileItem(BuildContext context, {required IconData icon, required String title, required VoidCallback onTap}) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color(0xFF6366F1).withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: const Color(0xFF6366F1)),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.chevron_right, size: 20),
      onTap: onTap,
    );
  }
}
