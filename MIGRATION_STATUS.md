# AI Flows Migration Status

## Completed ✅
1. **process-client-message.ts** - Migrated to GenAI SDK
2. **generate-chat-title-flow.ts** - Partially migrated (needs GenAI SDK update)

## In Progress 🔄
3. **analyze-client-requirements.ts** - Next up

## Pending ⏳
4. generate-engagement-pack-flow.ts
5. generate-design-prompts-flow.ts
6. check-made-designs-flow.ts
7. generate-platform-messages.ts
8. generate-editing-prompts-flow.ts
9. check-best-design-flow.ts
10. prompt-to-replicate-flow.ts
11. generate-chat-response-flow.ts
12. generate-video-prompts-flow.ts
13. generate-story-film-flow.ts
14. generate-ads-flow.ts
15. generate-viral-video-flow.ts
16. prompt-with-custom-sense-flow.ts
17. prompt-for-microstock-flow.ts
18. process-custom-instruction-flow.ts
19. suggest-client-replies.ts
20. generate-video-description-flow.ts

## Strategy
- Migrate high-traffic flows first (analyze, process, generate)
- Use genai-helper.ts for consistent implementation
- Test after each critical migration
- Remove Genkit deps at the end

