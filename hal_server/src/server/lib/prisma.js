import { PrismaClient } from "@prisma/client";

let prismaClient;

if (!globalThis.prisma) {
    prismaClient = new PrismaClient();
    // In development, store the instance globally to prevent multiple instances during hot reloading.
    if (process.env.NODE_ENV !== "production") {
        globalThis.prisma = prismaClient;
    }
    console.log("Prisma server started");
} else {
    prismaClient = globalThis.prisma;
}


export default prismaClient;
