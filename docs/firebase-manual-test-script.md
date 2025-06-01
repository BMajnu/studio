# Firebase Integration Manual Test Script

This document outlines manual testing procedures for verifying the Firebase integration functions correctly.

## Prerequisites
- A test user account with login credentials
- Access to the Firebase console for monitoring
- Browser with developer tools (for checking network requests and console)

## Test Procedures

### 1. User Authentication

1. **Login Test**
   - Open application in a private/incognito window
   - Click "Login" button
   - Authenticate with test credentials
   - ✓ Verify user is logged in successfully
   - ✓ Check Firebase Auth console to confirm user session

2. **Session Persistence**
   - After successful login, refresh the page
   - ✓ Verify user remains logged in
   - ✓ Verify chat history is still accessible

3. **Logout Test**
   - Click "Logout" button
   - ✓ Verify user is logged out
   - ✓ Verify chat history is no longer accessible
   - ✓ Check Firebase Auth console to confirm session ended

### 2. Chat History CRUD Operations

1. **Create New Chat**
   - Login with test user
   - Click "New Chat" button
   - ✓ Verify new empty chat is created
   - ✓ Check Firebase console to confirm new chat document exists

2. **Send Message**
   - In the new chat, type a test message and send
   - ✓ Verify message appears in chat
   - ✓ Check Firebase console to confirm message was saved
   - ✓ Verify chat metadata (preview, message count) is updated

3. **Load Existing Chat**
   - Create multiple chat sessions with different messages
   - Navigate between chats using the sidebar
   - ✓ Verify correct chat content is loaded for each session
   - ✓ Verify chat switching is fast and responsive

4. **Rename Chat**
   - Select an existing chat
   - Rename it to a test name
   - ✓ Verify name updates in UI
   - ✓ Check Firebase console to confirm name was updated
   - ✓ Verify sidebar shows updated name

5. **Delete Chat**
   - Select an existing chat
   - Delete the chat
   - ✓ Verify chat is removed from sidebar
   - ✓ Check Firebase console to confirm both session and metadata documents are deleted

### 3. Migration Testing

1. **First-time Migration**
   - Create test data in local storage (may require direct localStorage manipulation)
   - Login with a fresh test account
   - ✓ Verify migration dialog appears
   - ✓ Confirm migration
   - ✓ Verify migration completes successfully
   - ✓ Check that all local data appears in Firebase

2. **Skip Migration**
   - Create test data in local storage
   - Login with a fresh test account
   - When migration dialog appears, click "Skip"
   - ✓ Verify dialog closes
   - ✓ Verify local data remains accessible
   - Later, trigger manual migration
   - ✓ Verify data is migrated correctly

3. **Large Data Migration**
   - Create many chat sessions in local storage (10+)
   - Login and trigger migration
   - ✓ Verify progress indicator works
   - ✓ Verify all sessions are migrated successfully

### 4. Performance Testing

1. **Chat List Loading**
   - Create 20+ chat sessions
   - Logout and login again
   - ✓ Measure and record time for chat list to load
   - ✓ Verify UI remains responsive during loading

2. **Individual Chat Loading**
   - Create a chat with 100+ messages
   - Navigate to other chats then back
   - ✓ Measure and record time for full chat to load
   - ✓ Verify scrolling performance with large chats

3. **Concurrent Actions**
   - Open application in two different browser windows
   - Make changes in both windows
   - ✓ Verify changes from one window appear in the other
   - ✓ Check for any conflicts or error messages

### 5. Error Handling

1. **Network Disconnection**
   - Login and open a chat
   - Disable network connection
   - Try to send a message
   - ✓ Verify appropriate error message
   - Restore network connection
   - ✓ Test if operation recovers or can be retried

2. **Permission Errors**
   - If possible, modify Firestore rules to deny access
   - Attempt operations that should fail
   - ✓ Verify appropriate error messages
   - ✓ Confirm application doesn't crash

3. **Quota Limits**
   - If possible, test with an account near quota limits
   - ✓ Verify appropriate error messages when limits are reached

## Test Results Recording

| Test ID | Description | Pass/Fail | Notes | Date | Tester |
|---------|-------------|-----------|-------|------|--------|
| AUTH-1  | Login       |           |       |      |        |
| AUTH-2  | Session Persistence |    |       |      |        |
| AUTH-3  | Logout      |           |       |      |        |
| CRUD-1  | Create Chat |           |       |      |        |
| CRUD-2  | Send Message |          |       |      |        |
| CRUD-3  | Load Chat   |           |       |      |        |
| CRUD-4  | Rename Chat |           |       |      |        |
| CRUD-5  | Delete Chat |           |       |      |        |
| MIG-1   | First Migration |        |       |      |        |
| MIG-2   | Skip Migration  |        |       |      |        |
| MIG-3   | Large Migration |        |       |      |        |
| PERF-1  | Chat List Loading |      |       |      |        |
| PERF-2  | Chat Loading     |       |       |      |        |
| PERF-3  | Concurrent Actions |     |       |      |        |
| ERR-1   | Network Disconnection |  |       |      |        |
| ERR-2   | Permission Errors   |    |       |      |        |
| ERR-3   | Quota Limits        |    |       |      |        | 