package com.example.myapplication.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.myapplication.data.model.Message
import com.example.myapplication.data.model.MessageMeta

@Composable
fun ChatMessageBubble(
    message: Message,
    isMine: Boolean
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalAlignment = if (isMine) Alignment.End else Alignment.Start
    ) {
        if (!isMine && message.sender != null) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(start = 8.dp, bottom = 2.dp)
            ) {
                AsyncImage(
                    model = message.sender.avatarUrl ?: "https://ui-avatars.com/api/?name=${message.sender.fullName ?: "User"}",
                    contentDescription = null,
                    modifier = Modifier
                        .size(20.dp)
                        .clip(RoundedCornerShape(10.dp)),
                    contentScale = ContentScale.Crop
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = message.sender.fullName ?: "User",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.outline
                )
            }
        }

        Box(
            modifier = Modifier
                .widthIn(max = 280.dp)
                .background(
                    color = if (isMine) Color(0xFFEAB308) else MaterialTheme.colorScheme.surfaceVariant,
                    shape = RoundedCornerShape(
                        topStart = 16.dp,
                        topEnd = 16.dp,
                        bottomStart = if (isMine) 16.dp else 2.dp,
                        bottomEnd = if (isMine) 2.dp else 16.dp
                    )
                )
                .padding(12.dp)
        ) {
            Column {
                // If has metadata (product/package/order card)
                message.meta?.let { meta ->
                    ChatMetaCard(meta)
                    Spacer(modifier = Modifier.height(8.dp))
                }

                if (!message.message.isNullOrEmpty()) {
                    Text(
                        text = message.message,
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (isMine) Color(0xFF1C1917) else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        Text(
            text = message.createdAt, // Simplified time
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.outline,
            modifier = Modifier.padding(top = 2.dp, start = 4.dp, end = 4.dp),
            fontSize = 10.sp
        )
    }
}

@Composable
fun ChatMetaCard(meta: MessageMeta) {
    Card(
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF1E293B) // Matching dark card in web
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(modifier = Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
            AsyncImage(
                model = meta.image ?: "https://via.placeholder.com/150",
                contentDescription = null,
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Crop
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                if (meta.isOrder == true) {
                    Text(
                        text = "Pesanan #${meta.orderNumber}",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color(0xFFFACC15),
                        fontWeight = FontWeight.Bold
                    )
                }
                Text(
                    text = meta.name ?: "Item",
                    style = MaterialTheme.typography.labelMedium,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1
                )
                Text(
                    text = "Rp %,.0f".format(meta.price ?: 0.0),
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White
                )
            }
        }
    }
}
