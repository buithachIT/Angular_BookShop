import { CustomNamePipe } from './custom-name.pipe';

describe('CustomNamePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomNamePipe();
    expect(pipe).toBeTruthy();
  });
});
