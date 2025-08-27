# DesAInR Browser Extension

AI-powered writing assistant for Chrome/Edge with translation, refinement, and content analysis features.

## ✅ Features Implemented

### Core Functionality
- ✅ **Authentication**: Firebase-based secure sign-in with token management
- ✅ **Text Refinement**: Select any text and improve it with AI
- ✅ **Translation**: Translate selected text or entire pages (50+ languages)
- ✅ **Page Analysis**: Summarize and extract key points from web pages
- ✅ **AI Chat**: Overlay chat interface (Ctrl+M) with context awareness
- ✅ **Custom Actions**: Create and use custom AI prompts
- ✅ **Memo System**: Save important selections with tags
- ✅ **Form Support**: Works with input fields and contenteditable areas

### Accessibility & UX
- ✅ **ARIA Labels**: Full screen reader support
- ✅ **Keyboard Navigation**: Tab navigation and keyboard shortcuts
- ✅ **Focus Management**: Proper focus traps in overlays
- ✅ **High Contrast**: Accessible color schemes
- ✅ **Toast Notifications**: Non-intrusive status updates
- ✅ **Undo System**: Reversible text replacements
- ✅ **Confirmation Dialogs**: Prevent accidental actions

### Technical Features
- ✅ **Rate Limiting**: Client-side token bucket (100 requests/day)
- ✅ **Server Quotas**: Firestore-based usage tracking
- ✅ **Parallel Translation**: Side-by-side language comparison
- ✅ **Batch Processing**: Efficient API calls for page translation
- ✅ **Shadow DOM**: Isolated UI components
- ✅ **Hot Module Replacement**: Fast development iteration

## 🚀 Quick Start

### Installation for Development

1. **Clone and setup**:
```bash
cd extension
npm install
```

2. **Configure Firebase** (create `.env` file):
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

3. **Build the extension**:
```bash
npm run build
```

4. **Load in Chrome/Edge**:
   - Open `chrome://extensions` or `edge://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/dist` folder

### Usage

1. **Sign In**: Click extension icon → Sign in with DesAInR
2. **Select Text**: Highlight any text on a webpage
3. **Use Toolbar**: Choose Refine, Translate, or Custom action
4. **Open Overlay**: Press Ctrl+M (Cmd+M on Mac) for full chat
5. **Right-Click Menu**: Access all features via context menu

## 📁 Project Structure

```
extension/
├── src/
│   ├── background.ts       # Service worker, context menus
│   ├── contentScript.ts    # Page interaction, toolbar
│   ├── popup.ts           # Extension popup UI
│   ├── auth.ts            # Firebase authentication
│   ├── apiClient.ts       # Backend API client
│   ├── domReplace.ts      # Safe DOM manipulation
│   ├── formSupport.ts     # Form/input field support
│   ├── pageTranslate.ts   # Full page translation
│   ├── parallel.ts        # Parallel translation mode
│   ├── selection.ts       # Text selection utilities
│   ├── undoManager.ts     # Undo/redo functionality
│   └── overlay/
│       ├── App.tsx        # React overlay application
│       └── mount.tsx      # Shadow DOM mounting
├── public/
│   ├── manifest.json      # Extension manifest v3
│   ├── popup.html         # Popup UI
│   ├── options.html       # Options page
│   └── icons/             # Extension icons
├── dist/                  # Built extension (git-ignored)
└── .env                   # Firebase config (git-ignored)
```

## 🔑 Keyboard Shortcuts

- **Ctrl+M / Cmd+M**: Toggle AI overlay
- **Escape**: Close overlay or toolbar
- **Tab**: Navigate through UI elements
- **Enter**: Confirm actions
- **Ctrl+Z**: Undo last text replacement

## 🛠️ Development

### Commands
```bash
npm run dev    # Start dev server with HMR
npm run build  # Build for production
npm run check  # TypeScript type checking
```

### Testing Checklist
- [x] Sign-in flow works
- [x] Text selection toolbar appears
- [x] Refinement replaces text correctly
- [x] Translation works for selections
- [x] Page translation processes all text
- [x] Analyze extracts page summary
- [x] Chat overlay opens/closes
- [x] Custom actions execute
- [x] Undo functionality works
- [x] Form inputs are supported
- [x] Rate limiting enforced
- [x] Accessibility features work

## 📦 Chrome Web Store Submission

### Prerequisites
- [x] Icons created (16, 32, 48, 128px)
- [x] Privacy policy written
- [x] Store listing prepared
- [x] Manifest permissions minimized
- [x] Version set to 1.0.0

### Submission Steps
1. Create developer account at https://chrome.google.com/webstore/devconsole
2. Pay one-time $5 registration fee
3. Create new item
4. Upload `extension/dist` folder as ZIP
5. Fill in store listing details from STORE_LISTING.md
6. Add screenshots (min 1280x800 or 640x400)
7. Set privacy practices
8. Submit for review

### Review Guidelines
- No remote code execution
- Clear permission justifications
- Accurate description
- No misleading functionality
- Complies with all policies

## 🔒 Security

- Firebase Auth tokens stored securely
- All API calls use HTTPS
- Token refresh every 45 minutes
- No sensitive data in localStorage
- Content Security Policy enforced
- Minimal permissions requested

## 📊 Quotas & Limits

### Free Tier
- 100 API requests per day
- 10 custom templates
- 50 saved memos
- Basic support

### Pro Tier (Coming Soon)
- Unlimited requests
- Unlimited templates
- Unlimited memos
- Priority support
- Advanced features

## 🐛 Troubleshooting

### Sign-in Issues
- Check Firebase config in `.env`
- Ensure backend is running on port 9003
- Verify redirect URL matches

### Extension Not Working
- Check console for errors (F12)
- Ensure all permissions granted
- Try reloading the extension
- Clear browser cache

### API Errors
- Check network tab for failed requests
- Verify authentication token
- Check rate limits
- Ensure backend is accessible

## 📝 License

Proprietary - DesAInR © 2024

## 🤝 Support

- Email: support@desainr.com
- Documentation: https://desainr.com/docs
- Issues: GitHub Issues

## 🎯 Roadmap

- [ ] Firefox support
- [ ] Safari support
- [ ] Offline mode
- [ ] Team collaboration
- [ ] API access
- [ ] Mobile app integration

---

**Ready for Production!** The extension is fully functional with all core features implemented, accessibility support, and Chrome Web Store preparation complete.
