# DesAInR Extension Setup Guide

## 🔥 Firebase Configuration Required

The extension needs Firebase credentials to work. You have two options:

### Option 1: Get Firebase Config from Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your DesAInR project
3. Click the gear icon ⚙️ → Project Settings
4. Scroll down to "Your apps" → Web app
5. Copy the Firebase config object

### Option 2: Copy from Your Main App (if you have .env.local)
Check if you have Firebase credentials in your main app's `.env.local` file at:
`E:\Developing Projects\DesAInR\studio\.env.local`

## 📝 Setting Up Extension Config

1. **Create .env file in extension directory:**
   ```bash
   cd extension
   copy .env.example .env
   ```

2. **Edit the .env file** and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

3. **Rebuild the extension:**
   ```bash
   npm run build
   ```

4. **Reload the extension in Chrome/Edge:**
   - Go to chrome://extensions/ or edge://extensions/
   - Find DesAInR extension
   - Click the refresh icon 🔄

## ⚠️ Important Notes

- The extension MUST use the **same Firebase project** as your main Next.js app
- Never commit the .env file to version control
- The .env file is already in .gitignore for security

## 🧪 Testing Firebase Connection

After setup, test by:
1. Click the extension icon in toolbar
2. Click "Sign In" button
3. Complete authentication flow
4. If successful, you'll see "Signed in as: [your email]"

## 🐛 Troubleshooting

If you see `auth/invalid-api-key` error:
- Double-check your API key in .env file
- Make sure there are no extra spaces or quotes
- Rebuild the extension after changing .env
- Hard refresh the extension (Ctrl+Shift+R on extensions page)
