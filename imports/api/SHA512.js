import crypto from 'crypto';

export const SHA512 = (input) => crypto.createHash('sha512').update(input).digest('hex');