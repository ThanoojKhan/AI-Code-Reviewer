import crypto from 'crypto';

export const hashCode = (code) => crypto.createHash('sha256').update(code).digest('hex');
