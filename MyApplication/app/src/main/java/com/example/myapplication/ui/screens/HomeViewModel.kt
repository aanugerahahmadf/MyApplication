package com.example.myapplication.ui.screens

import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.api.ApiService
import com.example.myapplication.data.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.io.FileOutputStream
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {

    var isLoading by mutableStateOf(false)
    var cbirResults by mutableStateOf<List<CbirResult>>(emptyList())
    var isCbirActive by mutableStateOf(false)

    var user by mutableStateOf<User?>(null)
    var products by mutableStateOf<List<Product>>(emptyList())
    var packages by mutableStateOf<List<Package>>(emptyList())
    var wishlistCount by mutableStateOf(0)
    var voucherCount by mutableStateOf(0)
    var orderCount by mutableStateOf(0)
    var cartCount by mutableStateOf(0)

    init {
        loadDashboardData()
    }

    fun loadDashboardData() {
        viewModelScope.launch {
            isLoading = true
            try {
                // Fetch User Profile
                val userResponse = apiService.getProfile()
                user = userResponse.data

                // Fetch Products and Packages
                val productsResponse = apiService.getProducts()
                products = productsResponse.data ?: emptyList()

                val packagesResponse = apiService.getPackages()
                packages = packagesResponse.data ?: emptyList()

                // Fetch Stats
                val wishlistResponse = apiService.getWishlists()
                wishlistCount = wishlistResponse.data?.size ?: 0

                val voucherResponse = apiService.getVouchers()
                voucherCount = voucherResponse.data?.size ?: 0

                val ordersResponse = apiService.getOrders()
                orderCount = ordersResponse.data?.size ?: 0

                val cartsResponse = apiService.getCarts()
                cartCount = cartsResponse.data?.size ?: 0

            } catch (e: Exception) {
                // handle error
            } finally {
                isLoading = false
            }
        }
    }

    fun clearCbir() {
        isCbirActive = false
        cbirResults = emptyList()
    }

    fun searchByImage(uri: Uri, context: Context) {
        viewModelScope.launch {
            isLoading = true
            isCbirActive = true
            try {
                val file = uriToFile(uri, context)
                val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())
                val body = MultipartBody.Part.createFormData("image", file.name, requestFile)
                val response = apiService.searchSimilar(body)
                cbirResults = response.results
            } catch (e: Exception) {
                // handle error
            } finally {
                isLoading = false
            }
        }
    }

    fun searchByBitmap(bitmap: Bitmap, context: Context) {
        viewModelScope.launch {
            isLoading = true
            isCbirActive = true
            try {
                val file = bitmapToFile(bitmap, context)
                val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())
                val body = MultipartBody.Part.createFormData("image", file.name, requestFile)
                val response = apiService.searchSimilar(body)
                cbirResults = response.results
            } catch (e: Exception) {
                // handle error
            } finally {
                isLoading = false
            }
        }
    }

    private fun uriToFile(uri: Uri, context: Context): File {
        val inputStream = context.contentResolver.openInputStream(uri)
        val file = File(context.cacheDir, "temp_image.jpg")
        FileOutputStream(file).use { output ->
            inputStream?.copyTo(output)
        }
        return file
    }

    private fun bitmapToFile(bitmap: Bitmap, context: Context): File {
        val file = File(context.cacheDir, "temp_camera_image.jpg")
        FileOutputStream(file).use { output ->
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, output)
        }
        return file
    }
}
