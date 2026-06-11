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
import com.example.myapplication.ui.components.PackageCard
import com.example.myapplication.ui.components.ProductCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KatalogScreen(
    title: String,
    type: String, // "product" or "package"
    navController: NavController,
    viewModel: KatalogViewModel = hiltViewModel()
) {
    LaunchedEffect(Unit) {
        if (type == "product") {
            viewModel.loadProducts()
        } else {
            viewModel.loadPackages()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(title) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding).fillMaxSize()) {
            if (viewModel.isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(8.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    if (type == "product") {
                        items(viewModel.items) { item ->
                            ProductCard(product = item)
                        }
                    } else {
                        items(viewModel.packageItems) { pkg ->
                            PackageCard(pkg = pkg)
                        }
                    }
                }
            }
        }
    }
}
