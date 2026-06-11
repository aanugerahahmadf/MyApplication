package com.example.myapplication.data.api

import com.example.myapplication.data.model.*
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.http.*

interface ApiService {
    @POST("login")
    suspend fun login(@Body body: Map<String, String>): ApiResponse<LoginResponse>

    @POST("register")
    suspend fun register(@Body body: Map<String, String>): ApiResponse<LoginResponse>

    @POST("auth/send-otp")
    suspend fun sendOtp(@Body body: Map<String, String>): ApiResponse<Map<String, String>>

    @POST("auth/verify-otp")
    suspend fun verifyOtp(@Body body: Map<String, String>): ApiResponse<Map<String, String>>

    @POST("forgot-password")
    suspend fun forgotPassword(@Body body: Map<String, String>): ApiResponse<Map<String, String>>

    @POST("reset-password")
    suspend fun resetPassword(@Body body: Map<String, String>): ApiResponse<Map<String, String>>

    @GET("home")
    suspend fun getHome(): ApiResponse<Map<String, Any>>

    @GET("profile")
    suspend fun getProfile(): ApiResponse<User>

    @POST("profile")
    suspend fun updateProfile(@Body body: Map<String, @JvmSuppressWildcards Any?>): ApiResponse<User>

    @POST("profile/username")
    suspend fun updateUsername(@Body body: Map<String, String>): ApiResponse<User>

    @POST("profile/password")
    suspend fun updatePassword(@Body body: Map<String, String>): ApiResponse<Map<String, String>>

    @DELETE("profile")
    suspend fun deleteAccount(@Query("password") password: String): ApiResponse<Map<String, String>>

    @Multipart
    @POST("cbir/search")
    suspend fun searchSimilar(
        @Part image: MultipartBody.Part,
        @Part("top_k") topK: RequestBody? = null
    ): CbirApiResponse

    @GET("products")
    suspend fun getProducts(): ApiResponse<List<Product>>

    @GET("packages")
    suspend fun getPackages(): ApiResponse<List<Package>>

    @GET("cart")
    suspend fun getCarts(): ApiResponse<List<Cart>>

    @GET("orders")
    suspend fun getOrders(): ApiResponse<List<Order>>

    @GET("reviews/user")
    suspend fun getReviews(): ApiResponse<List<Review>>

    @GET("histories")
    suspend fun getHistories(): ApiResponse<List<History>>

    @GET("vouchers")
    suspend fun getVouchers(): ApiResponse<List<Voucher>>

    @GET("wishlist")
    suspend fun getWishlists(): ApiResponse<List<Wishlist>>

    @GET("legal/terms")
    suspend fun getTerms(): LegalApiResponse

    @GET("legal/privacy")
    suspend fun getPrivacy(): LegalApiResponse

    // Chat Endpoints
    @GET("messages/conversations")
    suspend fun getConversations(): ApiResponse<List<Inbox>>

    @GET("messages/conversations/{id}")
    suspend fun getMessages(@Path("id") inboxId: Int): ApiResponse<List<Message>>

    @GET("messages/unread-count")
    suspend fun getUnreadCount(): ApiResponse<Map<String, Int>>

    @POST("messages/send")
    suspend fun sendMessage(
        @Body body: Map<String, @JvmSuppressWildcards Any>
    ): ApiResponse<Message>

    @POST("messages/start")
    suspend fun startConversation(
        @Body body: Map<String, @JvmSuppressWildcards Any?> = emptyMap()
    ): ApiResponse<Map<String, Int>>
}
