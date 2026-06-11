package com.example.myapplication.data.model

import com.google.gson.annotations.SerializedName

data class ApiResponse<T>(
    val status: String,
    val message: String?,
    val data: T?
)

data class User(
    val id: Int,
    @SerializedName("full_name") val fullName: String?,
    @SerializedName("first_name") val firstName: String?,
    @SerializedName("mid_name") val midName: String?,
    @SerializedName("last_name") val lastName: String?,
    val username: String?,
    val email: String,
    @SerializedName("avatar_url") val avatarUrl: String?,
    val phone: String?,
    val whatsapp: String?,
    val address: String?,
    @SerializedName("ip_address") val ipAddress: String?,
    @SerializedName("login_city") val loginCity: String?,
    @SerializedName("login_region") val loginRegion: String?,
    @SerializedName("login_country") val loginCountry: String?,
    val latitude: Double?,
    val longitude: Double?,
    val budget: Double?,
    val gender: String?,
    @SerializedName("social_id") val socialId: String?,
    @SerializedName("social_type") val socialType: String?,
    @SerializedName("wedding_date") val weddingDate: String?,
    @SerializedName("theme_preference") val themePreference: String?,
    @SerializedName("color_preference") val colorPreference: String?,
    @SerializedName("event_concept") val eventConcept: String?,
    @SerializedName("dream_venue") val dreamVenue: String?,
    @SerializedName("active_status") val activeStatus: Boolean?
)

data class LoginResponse(
    val token: String,
    val user: User
)

data class Category(
    val id: Int,
    val name: String,
    val slug: String,
    val description: String?,
    val color: String?
)

data class Product(
    val id: Int,
    @SerializedName("category_id") val categoryId: Int?,
    val name: String,
    val slug: String,
    val description: String?,
    val price: Double,
    @SerializedName("discount_price") val discountPrice: Double?,
    val stock: Int,
    @SerializedName("is_active") val isActive: Boolean,
    @SerializedName("is_featured") val isFeatured: Boolean,
    val features: List<String>?,
    val theme: String?,
    val color: String?,
    @SerializedName("min_capacity") val minCapacity: Int?,
    @SerializedName("max_capacity") val maxCapacity: Int?,
    @SerializedName("image_url") val imageUrl: String?,
    @SerializedName("final_price") val finalPrice: Double?,
    @SerializedName("is_wishlisted") val isWishlisted: Boolean?,
    val category: Category?
)

data class Package(
    val id: Int,
    @SerializedName("category_id") val categoryId: Int?,
    val name: String,
    val slug: String,
    val description: String?,
    val price: Double,
    @SerializedName("discount_price") val discountPrice: Double?,
    val stock: Int,
    @SerializedName("is_active") val isActive: Boolean,
    @SerializedName("is_featured") val isFeatured: Boolean,
    val features: List<String>?,
    val theme: String?,
    val color: String?,
    @SerializedName("min_capacity") val minCapacity: Int?,
    @SerializedName("max_capacity") val maxCapacity: Int?,
    @SerializedName("image_url") val imageUrl: String?,
    @SerializedName("final_price") val finalPrice: Double?,
    @SerializedName("is_wishlisted") val isWishlisted: Boolean?,
    val category: Category?
)

data class Cart(
    val id: Int,
    @SerializedName("user_id") val userId: Int,
    @SerializedName("product_id") val productId: Int?,
    @SerializedName("package_id") val packageId: Int?,
    val quantity: Int,
    val subtotal: Double,
    val product: Product?,
    val `package`: Package?
)

data class Order(
    val id: Int,
    @SerializedName("order_number") val orderNumber: String,
    @SerializedName("user_id") val userId: Int,
    @SerializedName("package_id") val packageId: Int?,
    @SerializedName("product_id") val productId: Int?,
    @SerializedName("total_price") val totalPrice: Double,
    val status: String,
    @SerializedName("payment_status") val paymentStatus: String,
    @SerializedName("booking_date") val booking_date: String?,
    @SerializedName("booking_time") val booking_time: String?,
    val notes: String?,
    val quantity: Int,
    val product: Product?,
    val `package`: Package?
)

data class Review(
    val id: Int,
    @SerializedName("user_id") val userId: Int,
    @SerializedName("package_id") val packageId: Int?,
    @SerializedName("product_id") val productId: Int?,
    val rating: Int,
    val comment: String?,
    @SerializedName("created_at") val createdAt: String,
    val product: Product?,
    val `package`: Package?
)

data class History(
    val id: Int,
    @SerializedName("user_id") val userId: Int,
    @SerializedName("reference_number") val referenceNumber: String?,
    val type: String,
    val amount: Double,
    val info: String?,
    val status: String,
    val notes: String?,
    @SerializedName("created_at") val createdAt: String
)

data class Voucher(
    val id: Int,
    val code: String,
    val description: String?,
    @SerializedName("discount_amount") val discountAmount: Double,
    @SerializedName("discount_type") val discountType: String,
    @SerializedName("min_purchase") val minPurchase: Double,
    @SerializedName("expires_at") val expiresAt: String?,
    @SerializedName("is_active") val isActive: Boolean
)

data class Wishlist(
    val id: Int,
    @SerializedName("user_id") val userId: Int,
    @SerializedName("package_id") val packageId: Int?,
    @SerializedName("product_id") val productId: Int?,
    val product: Product?,
    val `package`: Package?
)

data class CbirResult(
    val type: String,
    val similarity: Double,
    val score: Double,
    val data: Product
)

data class CbirApiResponse(
    val success: Boolean,
    val results: List<CbirResult>,
    @SerializedName("total_results") val totalResults: Int,
    @SerializedName("query_time_seconds") val queryTimeSeconds: Double?
)

data class Inbox(
    val id: Int,
    @SerializedName("user_ids") val userIds: List<Int>,
    val title: String?,
    @SerializedName("created_at") val createdAt: String?,
    @SerializedName("updated_at") val updatedAt: String?,
    @SerializedName("inbox_title") val inboxTitle: String?,
    @SerializedName("primary_avatar") val primaryAvatar: String?,
    @SerializedName("other_users") val otherUsers: List<User>?
)

data class Message(
    val id: Int,
    @SerializedName("inbox_id") val inboxId: Int,
    @SerializedName("user_id") val userId: Int,
    val message: String?,
    @SerializedName("read_by") val readBy: List<Int>?,
    val meta: MessageMeta?,
    @SerializedName("created_at") val createdAt: String,
    val sender: User?
)

data class MessageMeta(
    val id: Int?,
    val type: String?, // "product", "package", "order"
    val name: String?,
    val price: Double?,
    val image: String?,
    val url: String?,
    @SerializedName("is_order") val isOrder: Boolean?,
    @SerializedName("order_id") val orderId: Int?,
    @SerializedName("order_number") val orderNumber: String?,
    @SerializedName("payment_status") val paymentStatus: String?,
    @SerializedName("is_cancellation") val isCancellation: Boolean?,
    @SerializedName("is_payment_update") val isPaymentUpdate: Boolean?
)

data class LegalContent(
    val heading: String,
    val body: String
)

data class LegalResponse(
    val id: Int,
    val title: String,
    val content: List<LegalContent>
)

data class LegalApiResponse(
    val success: Boolean,
    val message: String?,
    val data: LegalResponse?
)
