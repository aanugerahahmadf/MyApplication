package com.example.myapplication.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.example.myapplication.data.model.Wishlist
import com.example.myapplication.ui.components.ProductCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WishlistScreen(
    navController: NavController,
    viewModel: ResourceViewModel = hiltViewModel()
) {
    LaunchedEffect(Unit) {
        viewModel.loadWishlists()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Favorit Saya") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Kembali")
                    }
                }
            )
        }
    ) { padding ->
        if (viewModel.isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.fillMaxSize().padding(padding),
                contentPadding = PaddingValues(8.dp)
            ) {
                items(viewModel.wishlists) { wishlist ->
                    val item = wishlist.product ?: wishlist.`package`
                    if (item != null) {
                        // Using a dummy conversion or separate card if needed, 
                        // for now assuming Product matches the UI expectations
                        val product = if (wishlist.product != null) wishlist.product else {
                            val pkg = wishlist.`package`!!
                            com.example.myapplication.data.model.Product(
                                pkg.id, pkg.categoryId, pkg.name, pkg.slug, pkg.description, pkg.price,
                                pkg.discountPrice, pkg.stock, pkg.isActive, pkg.isFeatured, pkg.features,
                                pkg.theme, pkg.color, pkg.minCapacity, pkg.maxCapacity, pkg.imageUrl,
                                pkg.finalPrice, pkg.isWishlisted, pkg.category
                            )
                        }
                        ProductCard(product = product)
                    }
                }
            }
        }
    }
}
