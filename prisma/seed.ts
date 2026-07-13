import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("12345678", 10);
  const userPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "admin",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@gmail.com" },
    update: {},
    create: {
      name: "Regular User",
      email: "user@gmail.com",
      password: userPassword,
      role: "user",
    },
  });

  console.log(`Created users: ${admin.name} (${admin.role}), ${user.name} (${user.role})`);

  const categoryData = [
    { label: "Electronics", description: "Electronic devices and gadgets" },
    { label: "Furniture", description: "Office and home furniture" },
    { label: "Stationery", description: "Pens, paper, and office supplies" },
    { label: "Clothing", description: "Apparel and accessories" },
    { label: "Food & Beverages", description: "Consumable goods" },
  ];

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.upsert({
        where: { label: cat.label },
        update: {},
        create: cat,
      })
    )
  );

  console.log(`Created ${categories.length} categories`);

  const allCategories = categories.map((c) => c.id);

  const itemData = [
    { name: "Wireless Mouse", stock: 45, description: "Ergonomic wireless mouse with USB receiver", categoryIdx: 0 },
    { name: "Mechanical Keyboard", stock: 20, description: "RGB mechanical keyboard with blue switches", categoryIdx: 0 },
    { name: "USB-C Hub", stock: 0, description: "7-in-1 USB-C adapter with HDMI", categoryIdx: 0 },
    { name: "Monitor Stand", stock: 12, description: "Adjustable aluminum monitor stand", categoryIdx: 1 },
    { name: "Office Chair", stock: 8, description: "Ergonomic mesh office chair", categoryIdx: 1 },
    { name: "Standing Desk", stock: 3, description: "Electric height-adjustable standing desk", categoryIdx: 1 },
    { name: "Ballpoint Pens (Box)", stock: 100, description: "Pack of 50 blue ballpoint pens", categoryIdx: 2 },
    { name: "A4 Paper Ream", stock: 200, description: "500 sheets of A4 printer paper", categoryIdx: 2 },
    { name: "Sticky Notes", stock: 50, description: "Pack of 200 assorted color sticky notes", categoryIdx: 2 },
    { name: "T-Shirt", stock: 35, description: "Cotton crew neck t-shirt", categoryIdx: 3 },
    { name: "Winter Jacket", stock: 15, description: "Waterproof insulated winter jacket", categoryIdx: 3 },
    { name: "Coffee Beans (1kg)", stock: 2, description: "Premium arabica coffee beans", categoryIdx: 4 },
    { name: "Green Tea (50 bags)", stock: 40, description: "Organic green tea bags", categoryIdx: 4 },
  ];

  for (const item of itemData) {
    const existingItem = await prisma.item.findFirst({
      where: { name: item.name },
    });

    if (!existingItem) {
      await prisma.item.create({
        data: {
          name: item.name,
          stock: item.stock,
          description: item.description,
          category_id: allCategories[item.categoryIdx],
          user_id: admin.id,
        },
      });
    }
  }

  console.log(`Created ${itemData.length} items`);

  console.log("Seeding complete!");
  console.log("---");
  console.log("Admin:    admin@gmail.com / 12345678");
  console.log("User:     user@gmail.com  / password123");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
