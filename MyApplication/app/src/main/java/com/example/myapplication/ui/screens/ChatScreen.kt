package com.example.myapplication.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.example.myapplication.ui.components.ChatInputBar
import com.example.myapplication.ui.components.ChatMessageBubble

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    viewModel: ChatViewModel = hiltViewModel()
) {
    LaunchedEffect(Unit) {
        viewModel.loadConversations()
    }

    val selectedInbox = viewModel.selectedInbox

    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (selectedInbox != null) {
                            AsyncImage(
                                model = selectedInbox.primaryAvatar ?: "https://ui-avatars.com/api/?name=${selectedInbox.inboxTitle ?: "Admin"}",
                                contentDescription = null,
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(androidx.compose.foundation.shape.CircleShape),
                                contentScale = ContentScale.Crop
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                        }
                        Text(
                            text = if (selectedInbox != null) {
                                selectedInbox.inboxTitle ?: "Chat dengan Admin"
                            } else {
                                "Pesan Chat"
                            }
                        )
                    }
                }
            )
        },
        bottomBar = {
            if (selectedInbox != null) {
                ChatInputBar(onSendMessage = { viewModel.sendMessage(it) })
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when {
                viewModel.isLoading && viewModel.conversations.isEmpty() -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
                selectedInbox == null -> {
                    if (viewModel.conversations.isEmpty()) {
                        EmptyChatState()
                    } else {
                        ConversationList(
                            conversations = viewModel.conversations,
                            onSelect = { viewModel.selectConversation(it) }
                        )
                    }
                }
                else -> {
                    MessageList(
                        messages = viewModel.activeMessages,
                        currentUserId = viewModel.currentUserId
                    )
                }
            }
        }
    }
}

@Composable
fun EmptyChatState() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.Chat,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Belum Ada Percakapan",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Hubungi admin atau vendor untuk mulai bertanya.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.outline
            )
        }
    }
}

@Composable
fun ConversationList(
    conversations: List<com.example.myapplication.data.model.Inbox>,
    onSelect: (com.example.myapplication.data.model.Inbox) -> Unit
) {
    LazyColumn(modifier = Modifier.fillMaxSize()) {
        items(conversations) { inbox ->
            ListItem(
                headlineContent = { Text(inbox.inboxTitle ?: "Chat") },
                supportingContent = { Text("Klik untuk melihat pesan") },
                modifier = Modifier.clickable { onSelect(inbox) }
            )
            HorizontalDivider()
        }
    }
}

@Composable
fun MessageList(
    messages: List<com.example.myapplication.data.model.Message>,
    currentUserId: Int
) {
    // Reverse messages to show most recent at bottom
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        reverseLayout = true
    ) {
        items(messages.reversed()) { message ->
            ChatMessageBubble(
                message = message,
                isMine = message.userId == currentUserId
            )
        }
    }
}
