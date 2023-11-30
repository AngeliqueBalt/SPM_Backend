import { argon2id, Options as Argon2HashingOptions } from 'argon2';

/**
 * Default password hashing options.
 */
export const studentProgressMonitorHashingOptions: Argon2HashingOptions & { raw?: false } = {
    type: argon2id,
    timeCost: 256,
    parallelism: 64,
    hashLength: 128,
    memoryCost: 65536, // = 64 MiB per thread
    raw: false
};

export const studentProgressMonitorHashingOptionsRaw: Argon2HashingOptions & { raw: true } = {
    ...studentProgressMonitorHashingOptions,
    raw: true
};
