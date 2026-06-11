package com.example.myapplication.ui.screens

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.api.ApiService
import com.example.myapplication.data.model.Package
import com.example.myapplication.data.model.Product
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class KatalogViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {

    var isLoading by mutableStateOf(false)
    var items by mutableStateOf<List<Product>>(emptyList())
    var packageItems by mutableStateOf<List<Package>>(emptyList())

    fun loadProducts() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getProducts()
                items = response.data ?: emptyList()
            } catch (e: Exception) {
                // handle error
            } finally {
                isLoading = false
            }
        }
    }

    fun loadPackages() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getPackages()
                packageItems = response.data ?: emptyList()
            } catch (e: Exception) {
                // handle error
            } finally {
                isLoading = false
            }
        }
    }
}
