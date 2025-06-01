# localStorage Schema Documentation

## Key Prefixes

| Prefix | Description |
|--------|-------------|
| `desainr_chat_history_index_ls_v4_` | Stores metadata index of all chat sessions for a user |
| `desainr_chat_session_ls_v4_` | Stores individual chat sessions |
| `desainr_deleted_sessions_` | Tracks deleted session IDs |
| `desainr_last_active_session_id_` | Stores the ID of the last active session for a user |
| `desainr_user_profile_` | Stores user profile data (for anonymous users) |

## Data Structures

### Chat Session Metadata Index
Stores an array of metadata about all chat sessions for quick listing:

```typescript
[
  {
    id: string;              // Unique ID of the session
    name: string;            // Display name of the session 
    lastMessageTimestamp: number;  // Timestamp of last message
    preview: string;         // Short preview of the last message
    messageCount: number;    // Number of messages in the session
  }
]
```

### Chat Session
Stores the complete chat session including all messages:

```typescript
{
  id: string;                // Unique ID of the session
  name: string;              // Display name of the session
  messages: ChatMessage[];   // Array of messages in the conversation
  createdAt: number;         // Timestamp when session was created
  updatedAt: number;         // Timestamp when session was last updated
  userId: string;            // ID of the user who owns this session
  modelId: string;           // ID of the AI model used for this chat
}
```

### Chat Message
Individual message within a chat session:

```typescript
{
  id: string;                // Unique message ID
  role: 'user' | 'assistant' | 'system';  // Who sent the message
  content: string | ChatMessageContentPart[]; // Message content
  timestamp: number;         // When message was sent
  isLoading?: boolean;       // Whether message is still being processed
  isError?: boolean;         // Whether message encountered an error
  attachedFiles?: AttachedFile[]; // Files attached to this message
  canRegenerate?: boolean;   // Whether this message can be regenerated
  originalRequest?: {        // Data needed to regenerate the message
    actionType: string;
    messageText: string;
    notes?: string;
    attachedFilesData?: AttachedFile[];
    messageIdToRegenerate?: string;
  };
  promptedByMessageId?: string; // ID of the message that triggered this response
  linkedAssistantMessageId?: string; // For user messages, links to AI response
  editHistory?: EditHistoryEntry[]; // Previous versions if message was edited
}
```

## Storage Mechanisms

### Dual Storage System
The app uses both localStorage and IndexedDB:

1. **IndexedDB** - Used as primary storage for chat sessions due to larger storage limits
2. **localStorage** - Used as fallback and for storing metadata and smaller data

### Compression Strategy
To handle storage quota issues:

1. Check if data fits in localStorage
2. If quota exceeded, compress data using LZ-String
3. Store a flag `${key}_compressed` to indicate compression was used

### Error Handling Improvements

1. **Compression Detection**:
   - Multiple checks to identify compressed data
   - Character code analysis for high Unicode characters
   - JSON structure pattern recognition

2. **Decompression Fallbacks**:
   - Multiple decompression methods attempted when primary fails
   - Graceful handling of corrupt compressed data
   - Return original data when decompression fails but content appears valid

3. **JSON Parsing Protection**:
   - Enhanced safety checks before parsing
   - Removal of binary and special characters
   - Extraction of valid JSON from corrupted data

4. **Session Recovery**:
   - Creation of placeholder sessions when originals can't be loaded
   - Reconstruction from metadata when full data is corrupted
   - Improved error messages for diagnosing storage issues

## Current Issues

1. **Complex Naming Logic**: 
   - Uses AI to generate names for chat sessions
   - Queuing system for background name generation

2. **Inconsistent Storage Flow**:
   - Multiple paths for saving data (Firebase, IndexedDB, localStorage)
   - No clear priority order or fallback strategy

3. **Corrupted Data Handling**:
   - Several checks and cleanup utilities for corrupted data
   - Emergency fallbacks when data is corrupted

4. **Fragmented Storage Keys**:
   - Multiple version indicators in key prefixes
   - Inconsistent naming conventions 