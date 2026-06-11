package com.example.myapplication.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.myapplication.ui.Screen

@Composable
fun ProfileScreen(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
    ) {
        // User Name Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 24.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "User Name",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF2D3142) // Dark Navy/Black like in image
            )
        }

        HorizontalDivider(thickness = 0.5.dp, color = Color.LightGray)

        // Menu Items
        ProfileMenuItem(
            label = "Edit Profile",
            icon = Icons.Default.Edit,
            onClick = { navController.navigate(Screen.EditProfile.route) }
        )
        ProfileMenuItem(
            label = "Riwayat",
            icon = Icons.Default.History,
            onClick = { navController.navigate(Screen.Riwayat.route) }
        )
        ProfileMenuItem(
            label = "Katalog Paket Bunga",
            icon = Icons.Default.Inventory2,
            onClick = { navController.navigate(Screen.KatalogPaket.route) }
        )
        ProfileMenuItem(
            label = "Katalog Bunga",
            icon = Icons.Default.Settings,
            onClick = { navController.navigate(Screen.KatalogBunga.route) }
        )
        ProfileMenuItem(
            label = "Ulasan",
            icon = Icons.Default.RateReview,
            onClick = { navController.navigate(Screen.Ulasan.route) }
        )
        ProfileMenuItem(
            label = "Voucher Promo",
            icon = Icons.Default.ConfirmationNumber,
            onClick = { navController.navigate(Screen.Voucher.route) }
        )
        ProfileMenuItem(
            label = "Favorit Saya",
            icon = Icons.Default.Favorite,
            onClick = { navController.navigate(Screen.Wishlist.route) }
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Optional Logout Button
        TextButton(
            onClick = { /* Logout */ },
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .padding(bottom = 32.dp)
        ) {
            Text(
                "Keluar Akun",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.error,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

@Composable
fun ProfileMenuItem(
    label: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        color = Color.Transparent
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 18.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(24.dp),
                    tint = Color(0xFF2D3142)
                )
                Spacer(modifier = Modifier.width(20.dp))
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF2D3142),
                    modifier = Modifier.weight(1f)
                )
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = Color.Gray
                )
            }
            HorizontalDivider(
                thickness = 0.5.dp,
                color = Color.LightGray,
                modifier = Modifier.padding(horizontal = 0.dp)
            )
        }
    }
}
