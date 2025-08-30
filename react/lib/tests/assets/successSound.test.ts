import fs from 'fs';
import path from 'path';
import successSound from '../../assets/success.mp3.json';

describe('success.mp3 and success.mp3.json', () => {
  it('match: JSON base64 equals mp3 data URI', () => {
    const mp3Path = path.resolve(__dirname, '../../assets/success.mp3');
    const mp3Buffer = fs.readFileSync(mp3Path);
    const dataUri = 'data:audio/mpeg;base64,' + mp3Buffer.toString('base64');
    expect(successSound.base64).toBe(dataUri);
  });
});



