package com.example.myapplication.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.example.myapplication.data.model.Voucher

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VoucherScreen(
    navController: NavController,
    viewModel: ResourceViewModel = hiltViewModel()
) {
    LaunchedEffect(Unit) {
        viewModel.loadVouchers()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Voucher Promo") },
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
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(padding),
                contentPadding = PaddingValues(16.dp)
            ) {
                items(viewModel.vouchers) { voucher ->
                    VoucherItem(voucher)
                }
            }
        }
    }
}

@Composable
fun VoucherItem(voucher: Voucher) {
    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = voucher.code, style = MaterialTheme.typography.headlineSmall, color = MaterialTheme.colorScheme.primary)
            Text(text = voucher.description ?: "No description", style = MaterialTheme.typography.bodyLarge)
            Text(text = "Potongan: ${if (voucher.discountType == "percentage") "${voucher.discountAmount}%" else "Rp ${voucher.discountAmount}"}", style = MaterialTheme.typography.bodyMedium)
            Text(text = "Berlaku s/d: ${voucher.expiresAt ?: "Selamanya"}", style = MaterialTheme.typography.bodySmall)
        }
    }
}
