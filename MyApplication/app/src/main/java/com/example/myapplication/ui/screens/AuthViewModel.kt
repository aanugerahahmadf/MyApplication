package com.example.myapplication.ui.screens

import android.content.SharedPreferences
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.api.ApiService
import com.example.myapplication.data.model.User
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val apiService: ApiService,
    private val prefs: SharedPreferences
) : ViewModel() {

    var isLoading by mutableStateOf(false)
    var error by mutableStateOf<String?>(null)
    var currentUser by mutableStateOf<User?>(null)
    var loginSuccess by mutableStateOf(false)
    var otpSent by mutableStateOf(false)
    var otpVerified by mutableStateOf(false)
    var passwordResetSuccess by mutableStateOf(false)
    var profileUpdateSuccess by mutableStateOf(false)
    var accountDeleted by mutableStateOf(false)

    // Legal Data
    var legalData by mutableStateOf<com.example.myapplication.data.model.LegalResponse?>(null)

    // Data from Social Buttons/Forms
    var agreementAgreed by mutableStateOf(false)
    var rememberMe by mutableStateOf(false)

    fun fetchProfile() {
        viewModelScope.launch {
            isLoading = true
            try {
                val response = apiService.getProfile()
                if (response.status == "success" && response.data != null) {
                    currentUser = response.data
                }
            } catch (e: Exception) {
                error = e.message
            } finally {
                isLoading = false
            }
        }
    }

    fun updateProfile(data: Map<String, Any?>) {
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = apiService.updateProfile(data)
                if (response.status == "success") {
                    currentUser = response.data
                    profileUpdateSuccess = true
                } else {
                    error = response.message
                }
            } catch (e: Exception) {
                error = e.message
            } finally {
                isLoading = false
            }
        }
    }

    fun updateUsername(username: String) {
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = apiService.updateUsername(mapOf("username" to username))
                if (response.status == "success") {
                    currentUser = response.data
                    profileUpdateSuccess = true
                } else {
                    error = response.message
                }
            } catch (e: Exception) {
                error = e.message
            } finally {
                isLoading = false
            }
        }
    }

    fun updatePassword(current: String, new: String, confirm: String) {
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = apiService.updatePassword(mapOf(
                    "current_password" to current,
                    "password" to new,
                    "password_confirmation" to confirm
                ))
                if (response.status == "success") {
                    profileUpdateSuccess = true
                } else {
                    error = response.message
                }
            } catch (e: Exception) {
                error = e.message
            } finally {
                isLoading = false
            }
        }
    }

    fun deleteAccount(password: String) {
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = apiService.deleteAccount(password)
                if (response.status == "success") {
                    prefs.edit().remove("auth_token").apply()
                    accountDeleted = true
                } else {
                    error = response.message
                }
            } catch (e: Exception) {
                error = e.message
            } finally {
                isLoading = false
            }
        }
    }

    fun fetchLegal(type: String) { // "terms" or "privacy"
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = if (type == "terms") apiService.getTerms() else apiService.getPrivacy()
                if (response.success && response.data != null) {
                    legalData = response.data
                } else {
                    error = response.message ?: "Gagal memuat konten"
                }
            } catch (e: Exception) {
                error = e.message ?: "Network error"
            } finally {
                isLoading = false
            }
        }
    }

    fun googleLogin() {
        if (!agreementAgreed || !rememberMe) {
            error = "Silakan centang opsi Ingat Saya dan Setujui Syarat & Ketentuan untuk melanjutkan."
            return
        }
        
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                // Mock Google Login Success
                kotlinx.coroutines.delay(1500)
                if (rememberMe) {
                    prefs.edit().putString("auth_token", "mock_google_token").apply()
                }
                loginSuccess = true
            } catch (e: Exception) {
                error = e.message ?: "Gagal masuk dengan Google"
            } finally {
                isLoading = false
            }
        }
    }

    fun login(login: String, pass: String) {
        if (!agreementAgreed || !rememberMe) {
            error = "Silakan centang opsi Ingat Saya dan Setujui Syarat & Ketentuan untuk melanjutkan."
            return
        }

        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val body = mapOf(
                    "login" to login,
                    "password" to pass,
                    "agreement" to "1",
                    "remember" to "1"
                )
                val response = apiService.login(body)
                if (response.status == "success" && response.data != null) {
                    if (rememberMe) {
                        prefs.edit().putString("auth_token", response.data.token).apply()
                    }
                    currentUser = response.data.user
                    loginSuccess = true
                } else {
                    error = response.message ?: "Otentikasi Gagal"
                }
            } catch (e: Exception) {
                error = e.message ?: "Network error"
            } finally {
                isLoading = false
            }
        }
    }

    fun register(
        username: String,
        email: String,
        pass: String,
        passConfirm: String,
        fullName: String,
        firstName: String,
        midName: String,
        lastName: String,
        whatsapp: String,
        gender: String,
        address: String
    ) {
        if (!agreementAgreed || !rememberMe) {
            error = "Silakan centang opsi Ingat Saya dan Setujui Syarat & Ketentuan untuk melanjutkan."
            return
        }

        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val body = mapOf(
                    "username" to username,
                    "email" to email,
                    "password" to pass,
                    "password_confirmation" to passConfirm,
                    "full_name" to fullName,
                    "first_name" to firstName,
                    "mid_name" to midName,
                    "last_name" to lastName,
                    "whatsapp" to whatsapp,
                    "gender" to gender,
                    "address" to address,
                    "agreement" to "1",
                    "remember" to "1"
                )
                val response = apiService.register(body)
                if (response.status == "success" && response.data != null) {
                    if (rememberMe) {
                        prefs.edit().putString("auth_token", response.data.token).apply()
                    }
                    currentUser = response.data.user
                    loginSuccess = true
                } else {
                    error = response.message ?: "Pendaftaran Gagal"
                }
            } catch (e: Exception) {
                error = e.message ?: "Network error"
            } finally {
                isLoading = false
            }
        }
    }

    fun forgotPassword(email: String) {
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = apiService.forgotPassword(mapOf("email" to email))
                if (response.status == "success") {
                    otpSent = true
                } else {
                    error = response.message ?: "Failed"
                }
            } catch (e: Exception) {
                error = e.message ?: "Network error"
            } finally {
                isLoading = false
            }
        }
    }

    fun verifyOtp(email: String, otp: String, purpose: String) {
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = apiService.verifyOtp(mapOf(
                    "email" to email,
                    "otp" to otp,
                    "purpose" to purpose
                ))
                if (response.status == "success") {
                    otpVerified = true
                } else {
                    error = response.message ?: "Invalid OTP"
                }
            } catch (e: Exception) {
                error = e.message ?: "Network error"
            } finally {
                isLoading = false
            }
        }
    }

    fun resetPassword(email: String, otp: String, pass: String, passConfirm: String) {
        viewModelScope.launch {
            isLoading = true
            error = null
            try {
                val response = apiService.resetPassword(mapOf(
                    "email" to email,
                    "otp" to otp,
                    "password" to pass,
                    "password_confirmation" to passConfirm
                ))
                if (response.status == "success") {
                    passwordResetSuccess = true
                } else {
                    error = response.message ?: "Failed"
                }
            } catch (e: Exception) {
                error = e.message ?: "Network error"
            } finally {
                isLoading = false
            }
        }
    }
}
