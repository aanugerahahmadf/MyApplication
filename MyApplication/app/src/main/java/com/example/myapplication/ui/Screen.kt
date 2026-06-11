package com.example.myapplication.ui

sealed class Screen(val route: String) {
    object Welcome : Screen("welcome")
    object Login : Screen("login")
    object Register : Screen("register")
    object ForgotPassword : Screen("forgot_password")
    object VerifyOtp : Screen("verify_otp")
    object ResetPassword : Screen("reset_password")
    object Home : Screen("home")
    object Pesanan : Screen("pesanan")
    object Keranjang : Screen("keranjang")
    object Chat : Screen("chat")
    object Profile : Screen("profile")
    object CbirResults : Screen("cbir_results")
    object EditProfile : Screen("edit_profile")
    object Riwayat : Screen("riwayat")
    object KatalogPaket : Screen("katalog_paket")
    object KatalogBunga : Screen("katalog_bunga")
    object Ulasan : Screen("ulasan")
    object Voucher : Screen("voucher")
    object Wishlist : Screen("wishlist")
}
