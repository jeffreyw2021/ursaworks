import { describe, it, expect } from 'vitest';
import loadImage from '../loadImages';

describe('loadImage', () => {
  it('resolves a known robot image to a URL', () => {
    expect(loadImage('robots', 'hero.png')).toBeTruthy();
  });

  it('returns null for a missing image', () => {
    expect(loadImage('robots', 'nope.png')).toBeNull();
  });
});
