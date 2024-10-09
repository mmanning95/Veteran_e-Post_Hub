// Replace the ES Module import with CommonJS require
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (useful for development environment)
  await prisma.account.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.member.deleteMany();
  await prisma.user.deleteMany();

  // Seed User, Member, and Admin data

  // Create a member user
  const memberUser = await prisma.user.create({
    data: {
      name: "Member User",
      email: "member@example.com",
      passwordHash: "hashed_password_member",
      role: "MEMBER",
      member: {
        create: {}, // Create an associated Member record
      },
    },
  });

  // Create an admin user
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: "hashed_password_admin",
      role: "ADMIN",
      admin: {
        create: {
          officeNumber: "1234",
          officeHours: "9 AM - 5 PM",
          officeLocation: "Building A",
          creatorCode: "wc_create_admin",
        },
      },
    },
  });

  console.log("Database has been seeded:");
  console.log({ memberUser, adminUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
