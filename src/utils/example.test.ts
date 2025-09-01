import { describe, it, expect } from 'vitest';

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings', () => {
    const message = 'Photo Picker';
    expect(message).toContain('Photo');
  });
});
