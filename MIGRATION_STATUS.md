# 🚀 Complete AI Flows Migration Plan

## 📋 Overview
Migrate **27 AI flow files** from Genkit (`@genkit-ai/googleai`) to direct `@google/genai` SDK implementation.

**Total Files:** 27 flows + helper utilities + API routes
**Goal:** Remove Genkit completely, use direct SDK calls
**Benefits:** Better performance, simpler code, more control

## 🎯 Migration Strategy

### **Phase 1: Core Infrastructure** ✅
1. **Model IDs Update** - Remove `googleai/` prefix from all model configurations
2. **GenAI Helper Library** - Create reusable utilities for consistent API calls
3. **Key Management** - Ensure API key rotation works with new SDK

### **Phase 2: Critical Flow Migration** 🔄 (Priority 1-3)
4. **process-client-message.ts** - Main chat processing (COMPLETED)
5. **analyze-client-requirements.ts** - Requirements analysis (NEXT)
6. **generate-chat-title-flow.ts** - Chat title generation (DONE)

### **Phase 3: High-Traffic Flows** ⏳ (Priority 4-10)
7. **generate-engagement-pack-flow.ts** - Social media content
8. **generate-design-prompts-flow.ts** - Design prompts
9. **check-made-designs-flow.ts** - Design validation
10. **generate-platform-messages.ts** - Platform-specific content
11. **generate-editing-prompts-flow.ts** - Image editing prompts
12. **check-best-design-flow.ts** - Design ranking
13. **process-custom-instruction-flow.ts** - Custom instructions

### **Phase 4: Video & Media Flows** ⏳ (Priority 11-16)
14. **generate-chat-response-flow.ts** - Chat responses
15. **generate-video-prompts-flow.ts** - Video prompts
16. **generate-story-film-flow.ts** - Story film generation
17. **generate-ads-flow.ts** - Advertisement content
18. **generate-viral-video-flow.ts** - Viral video content
19. **generate-video-description-flow.ts** - Video descriptions

### **Phase 5: Utility Flows** ⏳ (Priority 17-27)
20. **prompt-to-replicate-flow.ts** - Prompt replication
21. **prompt-with-custom-sense-flow.ts** - Custom prompt enhancement
22. **prompt-for-microstock-flow.ts** - Microstock optimization
23. **suggest-client-replies.ts** - Reply suggestions
24. **generate-brief-flow.ts** - Project briefs
25. **generate-images-flow.ts** - Image generation
26. **extension-assist-flow.ts** - Extension assistance
27. **process-custom-instruction.ts** - Custom instruction processing

## 🛠 Technical Implementation Details

### **For Each Flow Migration:**

#### **Step 1: Input/Output Schema Extraction**
```typescript
// Keep existing interfaces for compatibility
export interface AnalyzeClientRequirementsInput {
  clientMessage: string;
  userName: string;
  communicationStyleNotes: string;
  attachedFiles?: AttachedFile[];
  // ... existing fields
}
```

#### **Step 2: Replace Genkit Implementation**
```typescript
// OLD: Genkit approach
const promptDef = instance.definePrompt({
  name: 'analyzeRequirements',
  input: { schema: InputSchema },
  output: { schema: OutputSchema },
  prompt: promptText
});
const { output } = await promptDef(inputData, { model: modelId });

// NEW: Direct SDK approach
const output = await generateJSON<OutputType>({
  modelId: modelId,
  temperature: 0.7,
  profile: profileForKeys
}, systemPrompt, userPrompt);
```

#### **Step 3: Error Handling Update**
```typescript
// Enhanced error handling with key rotation
try {
  const output = await generateJSON(config, systemPrompt, userPrompt);
  return output;
} catch (error) {
  // Log specific error types
  // Retry with different keys if needed
  throw new Error(`AI call failed in ${flowName}. ${error.message}`);
}
```

## 📊 Testing Strategy

### **Per-Flow Testing:**
1. **Unit Tests** - Test flow logic independently
2. **Integration Tests** - Test with real API keys
3. **Performance Tests** - Compare response times vs Genkit
4. **Error Handling** - Test quota limits, invalid keys, timeouts

### **System-Wide Testing:**
1. **Full Chat Flow** - End-to-end message processing
2. **Profile Integration** - Settings changes work
3. **Model Switching** - Different models work correctly
4. **Error Recovery** - Graceful handling of failures

## 🔧 Dependencies to Remove

After all migrations complete:

```bash
npm uninstall @genkit-ai/googleai @genkit-ai/next genkit
```

## 🚨 Risk Mitigation

### **Rollback Plan:**
1. **Keep Genkit backups** of all migrated files
2. **Gradual rollout** - Test each flow before moving to next
3. **Feature flags** - Can revert specific flows if needed

### **Common Issues & Solutions:**
1. **Model not found** → Check model IDs without `googleai/` prefix
2. **API key issues** → Ensure key rotation works with new SDK
3. **Response format** → JSON parsing errors in new SDK
4. **Timeout issues** → Adjust retry logic for new API patterns

## 📈 Success Metrics

- ✅ **All 27 flows migrated**
- ✅ **Build passes** without errors
- ✅ **Response times improved** vs Genkit
- ✅ **Memory usage reduced**
- ✅ **Zero breaking changes** for existing users

## 🎯 Next Steps After Migration

1. **Remove Genkit** from package.json
2. **Update documentation** with new implementation details
3. **Performance monitoring** to ensure improvements
4. **User acceptance testing** for all features
5. **Lab page 404 fix** and routing verification

---

**Status:** Phase 2 in progress (3/27 flows completed)
**ETA:** 2-3 days for complete migration
**Risk:** Medium - extensive testing needed

