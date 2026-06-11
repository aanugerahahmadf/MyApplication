package com.example.myapplication.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.example.myapplication.data.model.CbirResult
import com.example.myapplication.ui.components.AppSearchBar
import com.example.myapplication.ui.components.ProductCard

import androidx.compose.ui.tooling.preview.Preview
import com.example.myapplication.data.model.Product
import com.example.myapplication.ui.theme.WeddingTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    navController: NavController,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val context = LocalContext.current

    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let { viewModel.searchByImage(it, context) }
    }

    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        bitmap?.let { viewModel.searchByBitmap(it, context) }
    }

    HomeScreenContent(
        isLoading = viewModel.isLoading,
        cbirResults = viewModel.cbirResults,
        isCbirActive = viewModel.isCbirActive,
        user = viewModel.user,
        wishlistCount = viewModel.wishlistCount,
        voucherCount = viewModel.voucherCount,
        products = viewModel.products,
        packages = viewModel.packages,
        onCameraClick = { cameraLauncher.launch(null) },
        onFileClick = { galleryLauncher.launch("*/*") },
        onClearClick = { viewModel.clearCbir() },
        onCategoryClick = { route -> navController.navigate(route) }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreenContent(
    isLoading: Boolean,
    cbirResults: List<CbirResult>,
    isCbirActive: Boolean,
    user: com.example.myapplication.data.model.User?,
    wishlistCount: Int,
    voucherCount: Int,
    products: List<Product>,
    packages: List<com.example.myapplication.data.model.Package>,
    onCameraClick: () -> Unit,
    onFileClick: () -> Unit,
    onClearClick: () -> Unit,
    onCategoryClick: (String) -> Unit
) {
    var searchText by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            if (isCbirActive) {
                TopAppBar(
                    title = { Text("Hasil Pencarian Gambar", style = MaterialTheme.typography.titleMedium) },
                    navigationIcon = {
                        IconButton(onClick = onClearClick) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Kembali")
                        }
                    }
                )
            } else {
                AppSearchBar(
                    value = searchText,
                    onValueChange = { searchText = it },
                    onCameraClick = onCameraClick,
                    onFileClick = onFileClick,
                    onClearClick = { 
                        searchText = ""
                        onClearClick() 
                    },
                    showClearButton = isCbirActive
                )
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
        ) {
            if (isCbirActive) {
                Box(modifier = Modifier.fillMaxSize()) {
                    if (isLoading) {
                        CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                    } else if (cbirResults.isEmpty()) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "Tidak ada hasil ditemukan.",
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    } else {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(2),
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(cbirResults) { result ->
                                ProductCard(product = result.data)
                            }
                        }
                    }
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Welcome Card
                    item(span = { GridItemSpan(2) }) {
                        WelcomeCard(user = user)
                    }

                    // Stats Section
                    item {
                        StatCard(
                            label = "Favorite",
                            value = wishlistCount.toString(),
                            description = "Saved",
                            icon = Icons.Default.Favorite,
                            color = MaterialTheme.colorScheme.error,
                            onClick = { onCategoryClick("wishlist") }
                        )
                    }
                    item {
                        StatCard(
                            label = "Active Voucher",
                            value = voucherCount.toString(),
                            description = "Discounts",
                            icon = Icons.Default.ConfirmationNumber,
                            color = MaterialTheme.colorScheme.tertiary,
                            onClick = { onCategoryClick("vouchers") }
                        )
                    }

                    // Catalog Header
                    item(span = { GridItemSpan(2) }) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Katalog Terpadu",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    // Combined Catalog Items
                    if (isLoading && packages.isEmpty() && products.isEmpty()) {
                        item(span = { GridItemSpan(2) }) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(200.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator()
                            }
                        }
                    } else if (packages.isEmpty() && products.isEmpty()) {
                        item(span = { GridItemSpan(2) }) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "Belum ada produk atau paket tersedia.",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    } else {
                        items(packages) { pkg ->
                            ProductCard(product = pkg.toProduct())
                        }
                        items(products) { product ->
                            ProductCard(product = product)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun WelcomeCard(user: com.example.myapplication.data.model.User?) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Default.AutoAwesome,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimary
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Welcome, ${user?.fullName ?: user?.username ?: "User"}",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onPrimary,
                    fontWeight = FontWeight.Bold
                )
            }
            Text(
                text = "Make your special moment today",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.8f)
            )
        }
    }
}

@Composable
fun StatCard(
    label: String,
    value: String,
    description: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: androidx.compose.ui.graphics.Color,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick,
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Icon(
                    icon,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = color
                )
            }
            Text(
                text = value,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = description,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

// Extension to map Package to Product for unified display if needed
fun com.example.myapplication.data.model.Package.toProduct(): Product {
    return Product(
        id = this.id,
        categoryId = this.categoryId,
        name = this.name,
        slug = this.slug,
        description = this.description,
        price = this.price,
        discountPrice = this.discountPrice,
        stock = this.stock,
        isActive = this.isActive,
        isFeatured = this.isFeatured,
        features = this.features,
        theme = this.theme,
        color = this.color,
        minCapacity = this.minCapacity,
        maxCapacity = this.maxCapacity,
        imageUrl = this.imageUrl,
        finalPrice = this.finalPrice,
        isWishlisted = this.isWishlisted,
        category = this.category
    )
}

@Composable
fun CbirResultsGrid(results: List<CbirResult>, isLoading: Boolean) {
    if (isLoading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
    } else {
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(8.dp)
        ) {
            items(results) { result ->
                ProductCard(product = result.data)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    WeddingTheme {
        HomeScreenContent(
            isLoading = false,
            cbirResults = emptyList(),
            isCbirActive = false,
            user = null,
            wishlistCount = 0,
            voucherCount = 0,
            products = emptyList(),
            packages = emptyList(),
            onCameraClick = {},
            onFileClick = {},
            onClearClick = {},
            onCategoryClick = {}
        )
    }
}

@Preview(showBackground = true)
@Composable
fun HomeScreenCbirActivePreview() {
    WeddingTheme {
        HomeScreenContent(
            isLoading = false,
            cbirResults = emptyList(),
            isCbirActive = true,
            user = null,
            wishlistCount = 0,
            voucherCount = 0,
            products = emptyList(),
            packages = emptyList(),
            onCameraClick = {},
            onFileClick = {},
            onClearClick = {},
            onCategoryClick = {}
        )
    }
}
