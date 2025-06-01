# Storage System Documentation

## Overview

The new storage system provides a unified interface for storing and retrieving chat sessions across multiple storage providers (localStorage and IndexedDB) with transparent fallbacks, automatic synchronization, and improved error handling.

## Architecture

The system follows a modular design with these key components:

1. **Storage Interface** (`src/lib/storage/storage-interface.ts`)
   - Defines consistent interfaces for storage providers
   - Standardizes return types and error handling
   - Defines storage priorities for read/write operations

2. **Storage Providers**
   - `LocalStorageProvider`: Uses browser localStorage for persistent storage with compression
   - `IndexedDBProvider`: Uses IndexedDB for larger storage capacity

3. **Storage Manager** (`src/lib/storage/storage-manager.ts`)
   - Coordinates operations across multiple providers
   - Implements automatic fallback if primary provider fails
   - Handles synchronization between providers
   - Provides unified error handling

4. **React Hook** (`src/lib/hooks/use-storage.ts`)
   - Provides a React-friendly API for components to interact with storage
   - Handles user context and authentication
   - Manages UI state and error handling

## Key Features

### 1. Unified Storage Interface

All storage providers implement a common interface that standardizes:
- Session retrieval, saving and deletion
- Metadata management
- Storage statistics
- Error handling and reporting

### 2. Transparent Fallbacks

The system automatically tries multiple storage mechanisms:
- Uses localStorage first for better performance
- Falls back to IndexedDB for larger storage needs
- Handles errors and retries gracefully

### 3. Automatic Synchronization

The Storage Manager periodically synchronizes data between providers:
- Ensures data consistency across storage mechanisms
- Merges metadata keeping newer versions
- Handles conflicts based on timestamp resolution

### 4. Improved Error Handling

The system provides robust error handling:
- Standardized error reporting format
- Detailed error messages with source tracking
- Recovery mechanisms for corrupted data
- Graceful degradation when storage is unavailable

### 5. Storage Optimization

Implements strategies to optimize storage usage:
- Automatic compression for large sessions
- Session cleanup for old/unused data
- Storage quota monitoring
- Size estimation and reporting

## Usage

```typescript
import { useStorage } from '@/lib/hooks/use-storage';

function ChatPanel() {
  const { 
    sessions, 
    isLoading, 
    createSession,
    getSession,
    saveSession,
    deleteSession,
    renameSession
  } = useStorage();
  
  // Create a new session
  const handleCreateSession = async () => {
    const newSession = await createSession();
    if (newSession) {
      // Navigate to new session
    }
  };
  
  // Load an existing session
  const handleLoadSession = async (sessionId) => {
    const result = await getSession(sessionId);
    if (result.success) {
      // Use the session data
      const session = result.data;
    }
  };
  
  // Other operations...
}
```

## Implementation Details

### Storage Keys and Namespaces

Storage keys follow a consistent pattern:
- `desainr_chat_history_index_ls_v4_{userId}` - Session metadata index
- `desainr_chat_session_ls_v4_{userId}_{sessionId}` - Individual sessions
- `desainr_deleted_sessions_{userId}` - Tracks deleted sessions

### Data Compression

Large session data is automatically compressed:
- Uses LZ-String compression algorithm
- Compression applies when session size > 1000 bytes
- Handles edge cases like double compression
- Includes validation and recovery options

### Metadata Management

Session metadata is stored separately from full session data:
- Enables fast listing without loading full sessions
- Includes preview text, message count, and timestamps
- Used for sorting and filtering sessions
- Automatically updated when sessions change

### Storage Statistics

The system tracks and reports storage usage:
- Total number of sessions
- Total storage used
- Remaining quota estimation
- Oldest and newest sessions

## Future Improvements

1. **Firebase Integration**
   - Add Firebase provider for cloud backup
   - Implement cross-device synchronization
   - Add offline support with reconnect handling

2. **More Advanced Sync**
   - Implement differential sync to reduce bandwidth
   - Add conflict resolution strategies
   - Support selective sync options

3. **Performance Optimizations**
   - Implement lazy loading for large sessions
   - Add pagination for session lists
   - Further optimize compression algorithms 