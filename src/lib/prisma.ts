/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client';

const prismaSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaSingleton>;
}

const prisma: ReturnType<typeof prismaSingleton> =
    globalThis.prisma ?? prismaSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
