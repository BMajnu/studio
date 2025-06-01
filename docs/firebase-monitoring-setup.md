# Firebase Monitoring Setup Guide

This guide outlines how to set up monitoring for the Firebase backend to ensure reliable operation of the chat application.

## Firebase Console Monitoring

### Firestore Usage Monitoring

1. **Access Firestore Usage Dashboard**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to Firestore -> Usage

2. **Set Up Alerts**
   - Click on "Alerts" tab
   - Create the following alerts:
     - Daily read operations exceeding 80% of quota
     - Daily write operations exceeding 80% of quota
     - Daily delete operations exceeding 80% of quota

3. **Key Metrics to Monitor**
   - Document reads per day
   - Document writes per day
   - Network egress
   - Storage size growth trend

### Authentication Monitoring

1. **Access Authentication Dashboard**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Navigate to Authentication

2. **Monitor Login Activity**
   - Review "Users" tab regularly
   - Check for unusual login patterns
   - Monitor failed login attempts

3. **Configure Authentication Alerts**
   - Enable email alerts for suspicious activity
   - Set up monitoring for high volume of authentication requests

## Application Performance Monitoring

### Set Up Firebase Performance SDK

1. **Install Performance Monitoring SDK**
   ```bash
   npm install firebase/performance
   ```

2. **Initialize in Application**
   ```javascript
   import { getPerformance } from "firebase/performance";
   
   const perf = getPerformance();
   ```

3. **Create Custom Traces for Key Operations**
   ```javascript
   import { getPerformance, trace } from "firebase/performance";
   
   const perf = getPerformance();
   
   // Create a trace for chat loading operation
   const chatLoadTrace = trace(perf, "chat_session_load");
   
   async function loadChatSession(sessionId) {
     // Start the trace
     chatLoadTrace.start();
     
     try {
       // Load chat session
       const session = await FirebaseChatStorage.getSession(userId, sessionId);
       
       // Record success
       chatLoadTrace.putAttribute("success", "true");
       chatLoadTrace.putMetric("message_count", session.messages.length);
       
       return session;
     } catch (error) {
       // Record failure
       chatLoadTrace.putAttribute("success", "false");
       chatLoadTrace.putAttribute("error", error.message);
       throw error;
     } finally {
       // Stop the trace
       chatLoadTrace.stop();
     }
   }
   ```

4. **Key Operations to Monitor**
   - Chat session loading time
   - Message sending latency
   - Chat history listing load time
   - Migration process duration

### Error Monitoring with Firebase Crashlytics

1. **Install Crashlytics SDK**
   ```bash
   npm install firebase/crashlytics
   ```

2. **Initialize in Application**
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getAnalytics } from "firebase/analytics";
   import { initializeCrashlytics, recordError } from 'firebase/crashlytics';
   
   const firebaseApp = initializeApp(firebaseConfig);
   const analytics = getAnalytics(firebaseApp);
   const crashlytics = initializeCrashlytics();
   ```

3. **Record Errors**
   ```javascript
   try {
     // Some operation that might fail
     await saveSession(session);
   } catch (error) {
     // Record the error
     recordError(crashlytics, error);
     
     // Show user-friendly error
     toast.error("Failed to save chat session");
   }
   ```

4. **Set User Properties**
   ```javascript
   import { setUserId, setCustomKey } from 'firebase/crashlytics';
   
   // When user logs in
   function onUserLogin(user) {
     setUserId(crashlytics, user.uid);
     setCustomKey(crashlytics, "premium_user", user.isPremium);
     setCustomKey(crashlytics, "account_type", user.accountType);
   }
   ```

## Custom Application Monitoring

### Client-Side Metrics

1. **Operation Success Rates**
   - Track success/failure of key operations:
     - Chat creation
     - Message sending
     - Session loading
     - Migration completion

2. **Performance Timing**
   - Implement client-side timing for:
     - Time to first message render
     - Chat switching latency
     - Total page load time
     - Migration duration per session

3. **User Experience Metrics**
   - Track user interaction patterns:
     - Session duration
     - Messages per session
     - Feature usage frequency
     - Error encounter rate

### Server-Side Monitoring

1. **Set Up Cloud Functions Monitoring**
   - Deploy logging functions for critical operations
   - Monitor Cloud Functions execution counts and errors
   - Set up alerts for function failures

2. **Database Health Metrics**
   - Monitor database connection status
   - Track query performance
   - Set up alerts for slow queries
   - Monitor security rule evaluation performance

## Logging Configuration

### Implement Structured Logging

```javascript
function logEvent(category, action, data = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    category,
    action,
    userId: currentUser?.uid || 'anonymous',
    sessionId: currentSessionId,
    ...data
  }));
  
  // Also log to Firebase Analytics
  logEvent(analytics, action, {
    category,
    ...data
  });
}

// Usage
logEvent('chat', 'session_loaded', { 
  messageCount: session.messages.length,
  loadTimeMs: endTime - startTime
});
```

### Key Events to Log

1. **User Events**
   - Login/logout
   - Profile updates
   - Settings changes

2. **Chat Events**
   - Session creation
   - Message sending
   - Chat switching
   - Chat deletion

3. **Migration Events**
   - Migration start/completion
   - Per-session migration status
   - Migration errors

4. **Error Events**
   - Firebase operation failures
   - UI rendering errors
   - Network connectivity issues

## Dashboard Setup

### Firebase Dashboard

1. **Create Custom Dashboard**
   - Go to Firebase Console
   - Select "Monitoring" section
   - Create a new dashboard
   - Add the following widgets:
     - Firestore read/write operations
     - Authentication activity
     - Error counts by type
     - Performance metrics

2. **Set Up Regular Reports**
   - Configure weekly email reports
   - Include key usage metrics and error rates

### Operational Procedures

1. **Daily Monitoring Routine**
   - Check error logs for recurring patterns
   - Review performance metrics for degradation
   - Verify Firebase quota usage

2. **Weekly Analysis**
   - Review usage patterns
   - Identify optimization opportunities
   - Document findings and action items

3. **Incident Response**
   - Define severity levels for issues
   - Create escalation paths for critical errors
   - Document resolution steps for common problems 