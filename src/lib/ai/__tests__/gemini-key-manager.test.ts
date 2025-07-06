import { GeminiKeyManager } from '../gemini-key-manager';

const mockProfile = {
  userId: 'u1',
  name: 'Test',
  services: [],
  geminiApiKeys: ['KEY1', 'KEY2', 'KEY3']
} as any;

describe('GeminiKeyManager', () => {
  it('cycles through keys when quota errors reported', () => {
    const mgr = new GeminiKeyManager(mockProfile, 0.001); // 0.06s cool-off for test
    const k1 = mgr.getActiveKey();
    expect(k1).toBe('KEY1');
    mgr.reportQuotaError(k1!);
    const k2 = mgr.getActiveKey();
    expect(k2).toBe('KEY2');
    mgr.reportQuotaError(k2!);
    const k3 = mgr.getActiveKey();
    expect(k3).toBe('KEY3');
  });

  it('returns undefined when all keys cooling', () => {
    const mgr = new GeminiKeyManager(mockProfile, 60); // long cool-off
    const k = mgr.getActiveKey();
    mgr.reportQuotaError(k!);
    mgr.reportQuotaError('KEY2');
    mgr.reportQuotaError('KEY3');
    expect(mgr.getActiveKey()).toBeUndefined();
  });

  it('permanently excludes a key when reported as invalid', () => {
    const mgr = new GeminiKeyManager(mockProfile, 60); // long cool-off
    const k1 = mgr.getActiveKey();
    expect(k1).toBe('KEY1');
    
    // Report KEY1 as invalid
    mgr.reportInvalidKey(k1!);
    
    // The next key should be KEY2
    const k2 = mgr.getActiveKey();
    expect(k2).toBe('KEY2');
    
    // Report quota errors on the other keys
    mgr.reportQuotaError(k2!);
    const k3 = mgr.getActiveKey();
    expect(k3).toBe('KEY3');
    mgr.reportQuotaError(k3!);
    
    // No keys should be available now. KEY1 is invalid, others are cooling.
    expect(mgr.getActiveKey()).toBeUndefined();
  });
}); 