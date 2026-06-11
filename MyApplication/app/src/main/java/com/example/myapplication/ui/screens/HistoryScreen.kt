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
import com.example.myapplication.data.model.History

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    navController: NavController,
    viewModel: ResourceViewModel = hiltViewModel()
) {
    LaunchedEffect(Unit) {
        viewModel.loadHistories()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Histori Transaksi") },
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
                items(viewModel.histories) { history ->
                    HistoryItem(history)
                }
            }
        }
    }
}

@Composable
fun HistoryItem(history: History) {
    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = history.referenceNumber ?: "N/A", style = MaterialTheme.typography.titleMedium)
            Text(text = "Tipe: ${history.type}", style = MaterialTheme.typography.bodyMedium)
            Text(text = "Status: ${history.status}", style = MaterialTheme.typography.bodyMedium)
            Text(text = "- Rp ${history.amount}", color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodyLarge)
            Text(text = history.createdAt, style = MaterialTheme.typography.bodySmall)
        }
    }
}
