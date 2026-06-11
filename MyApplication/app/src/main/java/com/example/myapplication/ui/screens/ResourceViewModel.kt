package com.example.myapplication.ui.screens

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.api.ApiService
import com.example.myapplication.data.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ResourceViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {

    var isLoading by mutableStateOf(false)
    
    var carts by mutableStateOf<List<Cart>>(emptyList())
    var orders by mutableStateOf<List<Order>>(emptyList())
    var reviews by mutableStateOf<List<Review>>(emptyList())
    var histories by mutableStateOf<List<History>>(emptyList())
    var vouchers by mutableStateOf<List<Voucher>>(emptyList())
    var wishlists by mutableStateOf<List<Wishlist>>(emptyList())

    fun loadCarts() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getCarts()
                carts = response.data ?: emptyList()
            } catch (e: Exception) {} finally { isLoading = false }
        }
    }

    fun loadOrders() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getOrders()
                orders = response.data ?: emptyList()
            } catch (e: Exception) {} finally { isLoading = false }
        }
    }

    fun loadReviews() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getReviews()
                reviews = response.data ?: emptyList()
            } catch (e: Exception) {} finally { isLoading = false }
        }
    }

    fun loadHistories() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getHistories()
                histories = response.data ?: emptyList()
            } catch (e: Exception) {} finally { isLoading = false }
        }
    }

    fun loadVouchers() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getVouchers()
                vouchers = response.data ?: emptyList()
            } catch (e: Exception) {} finally { isLoading = false }
        }
    }

    fun loadWishlists() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getWishlists()
                wishlists = response.data ?: emptyList()
            } catch (e: Exception) {} finally { isLoading = false }
        }
    }
}
