const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { UserSeeder } = require("./UserSeeder.js");
const { PostSeeder } = require("./PostSeeder.js");
const { CommentSeeder } = require("./CommentSeeder.js");

async function main() {
    try {
        await UserSeeder();
        await PostSeeder();
        await CommentSeeder();
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();