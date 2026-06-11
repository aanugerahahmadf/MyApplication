package com.example.myapplication.ui.screens

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.api.ApiService
import com.example.myapplication.data.model.Inbox
import com.example.myapplication.data.model.Message
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ChatViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {

    var isLoading by mutableStateOf(false)
    var conversations by mutableStateOf<List<Inbox>>(emptyList())
    var activeMessages by mutableStateOf<List<Message>>(emptyList())
    var selectedInbox by mutableStateOf<Inbox?>(null)
    var currentUserId by mutableIntStateOf(0)
    
    private var isPolling = false

    fun loadConversations() {
        viewModelScope.launch {
            isLoading = true
            try {
                // Get current user profile to know our own ID
                val profileResponse = apiService.getProfile()
                currentUserId = profileResponse.data?.id ?: 0

                // Ensure chat with Admin exists (matching startConversation logic for customers)
                val startResponse = apiService.startConversation()
                val adminInboxId = startResponse.data?.get("id")

                if (adminInboxId != null) {
                    val response = apiService.getConversations()
                    val adminInbox = response.data?.find { it.id == adminInboxId }
                    
                    if (adminInbox != null) {
                        selectConversation(adminInbox)
                    }
                }
            } catch (e: Exception) {
                // handle error
            } finally {
                isLoading = false
            }
        }
    }

    fun selectConversation(inbox: Inbox) {
        selectedInbox = inbox
        loadMessages(inbox.id)
        startPolling(inbox.id)
    }

    fun loadMessages(inboxId: Int) {
        viewModelScope.launch {
            try {
                val response = apiService.getMessages(inboxId)
                activeMessages = response.data ?: emptyList()
            } catch (e: Exception) {}
        }
    }

    fun sendMessage(text: String) {
        val inboxId = selectedInbox?.id ?: return
        viewModelScope.launch {
            try {
                apiService.sendMessage(mapOf(
                    "inbox_id" to inboxId,
                    "message" to text
                ))
                loadMessages(inboxId) // Refresh after sending
            } catch (e: Exception) {}
        }
    }

    private fun startPolling(inboxId: Int) {
        if (isPolling) return
        isPolling = true
        viewModelScope.launch {
            while (isPolling && selectedInbox?.id == inboxId) {
                delay(5000) // Poll every 5 seconds
                loadMessages(inboxId)
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        isPolling = false
    }
}
