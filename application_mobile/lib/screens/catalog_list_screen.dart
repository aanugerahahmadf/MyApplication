import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import 'home_screen.dart';

class CatalogListScreen extends StatelessWidget {
  final String title;
  final bool isPackage;

  const CatalogListScreen({super.key, required this.title, this.isPackage = false});

  @override
  Widget build(BuildContext context) {
    final apiService = Provider.of<ApiService>(context, listen: false);

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: FutureBuilder<dynamic>(
        future: isPackage ? apiService.getPackages() : apiService.getProducts(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const Center(child: Text('Failed to load data'));
          }
          final items = snapshot.data ?? [];
          return GridView.builder(
            padding: const EdgeInsets.all(16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.75,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: items.length,
            itemBuilder: (context, index) {
              return isPackage ? PackageCard(package: items[index]) : ProductCard(product: items[index]);
            },
          );
        },
      ),
    );
  }
}
