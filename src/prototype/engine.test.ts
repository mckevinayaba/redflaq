import { describe, expect, it } from 'vitest';
import { analyse, extendTimer, minutesRemaining } from './engine';

describe('Exact prototype pattern weights and verdict thresholds',()=>{
  it.each([
    ['proof of payment',3],['deposit',3],['urgent',2],['whatsapp me',2],['PayShap',2],['courier',2],['overseas',2],['bank details have changed',3],['OTP',4],['https://example.com',1],['overpaid',3],
  ])('matches %s with weight %i',(message,score)=>{expect(analyse(message).score).toBe(score);});
  it('stops at eight points',()=>{const r=analyse('deposit urgent PayShap https://example.com');expect(r.score).toBe(8);expect(r.verdict.cls).toBe('stop');});
  it('pauses from three points to seven',()=>{const r=analyse('deposit urgent PayShap');expect(r.score).toBe(7);expect(r.verdict.cls).toBe('pause');expect(analyse('deposit').verdict.cls).toBe('pause');});
  it('does not mark a no-pattern message as verified',()=>{expect(analyse('Hello, how are you?').score).toBe(0);expect(analyse('Hello, how are you?').verdict.cls).toBe('go');});
});
describe('Prototype Meet Safe durations',()=>{
  it('adds exactly 15 minutes',()=>{expect(extendTimer(1_000_000)).toBe(1_900_000);});
  it('counts down a 45-minute timer',()=>{expect(minutesRemaining(2_700_000,0)).toBe(2700);});
  it('never counts below zero after expiry',()=>{expect(minutesRemaining(1000,2000)).toBe(0);});
});