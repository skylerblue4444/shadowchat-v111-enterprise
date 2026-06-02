import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return;
  }

  const db = drizzle(process.env.DATABASE_URL, { schema, mode: "default" });

  console.log("🌱 Seeding database...");

  // 1. Seed Users
  console.log("👤 Seeding users...");
  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = {
      openId: faker.string.uuid(),
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      bio: faker.lorem.sentence(),
      avatarUrl: faker.image.avatar(),
      role: faker.helpers.arrayElement(["user", "creator", "moderator"] as const),
      skyBalance: faker.finance.amount({ min: 100, max: 10000, dec: 8 }),
      reputationScore: faker.number.int({ min: 0, max: 1000 }),
      level: faker.number.int({ min: 1, max: 50 }),
      xp: faker.number.int({ min: 0, max: 100000 }),
      isVerified: faker.datatype.boolean(),
      isOnline: faker.datatype.boolean(),
      subscriptionTier: faker.helpers.arrayElement(["free", "pro", "elite", "founder"] as const),
    };
    users.push(user);
  }
  const insertedUsers = await db.insert(schema.users).values(users);
  const userIds = Array.from({ length: 50 }, (_, i) => i + 1);

  // 2. Seed Wallets
  console.log("💰 Seeding wallets...");
  const wallets = userIds.map(userId => ({
    userId,
    skyBalance: faker.finance.amount({ min: 100, max: 10000, dec: 8 }),
    ethBalance: faker.finance.amount({ min: 0.1, max: 10, dec: 8 }),
    solBalance: faker.finance.amount({ min: 1, max: 100, dec: 8 }),
    usdcBalance: faker.finance.amount({ min: 100, max: 5000, dec: 2 }),
    btcBalance: faker.finance.amount({ min: 0.001, max: 0.1, dec: 8 }),
    totalValueUsd: faker.finance.amount({ min: 1000, max: 50000, dec: 2 }),
  }));
  await db.insert(schema.wallets).values(wallets);

  // 3. Seed Posts
  console.log("📝 Seeding posts...");
  const posts = [];
  for (let i = 0; i < 200; i++) {
    posts.push({
      authorId: faker.helpers.arrayElement(userIds),
      content: faker.lorem.paragraph(),
      likes: faker.number.int({ min: 0, max: 1000 }),
      reposts: faker.number.int({ min: 0, max: 200 }),
      comments: faker.number.int({ min: 0, max: 100 }),
      views: faker.number.int({ min: 100, max: 10000 }),
      aiScore: faker.finance.amount({ min: 0, max: 100, dec: 2 }),
    });
  }
  await db.insert(schema.posts).values(posts);

  // 4. Seed Trades
  console.log("📈 Seeding trades...");
  const trades = [];
  for (let i = 0; i < 100; i++) {
    const amount = faker.number.float({ min: 0.1, max: 10 });
    const price = faker.number.float({ min: 10, max: 60000 });
    trades.push({
      userId: faker.helpers.arrayElement(userIds),
      pair: faker.helpers.arrayElement(["BTC/USDT", "ETH/USDT", "SOL/USDT", "SKY/USDT"]),
      side: faker.helpers.arrayElement(["buy", "sell"] as const),
      amount: amount.toString(),
      price: price.toString(),
      total: (amount * price).toString(),
      status: "filled" as const,
      filledAt: new Date(),
    });
  }
  await db.insert(schema.trades).values(trades);

  // 5. Seed AI Conversations
  console.log("🤖 Seeding AI conversations...");
  const aiConversations = [];
  for (let i = 0; i < 50; i++) {
    aiConversations.push({
      userId: faker.helpers.arrayElement(userIds),
      title: faker.lorem.words(3),
      persona: faker.helpers.arrayElement(["oracle", "engineer", "hacker", "trader"]),
      messages: [
        { role: "user", content: faker.lorem.sentence(), timestamp: Date.now() },
        { role: "assistant", content: faker.lorem.paragraph(), timestamp: Date.now() },
      ],
    });
  }
  await db.insert(schema.aiConversations).values(aiConversations);

  // 6. Seed Listings & Orders
  console.log("🛒 Seeding marketplace...");
  const listings = [];
  for (let i = 0; i < 30; i++) {
    listings.push({
      sellerId: faker.helpers.arrayElement(userIds),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(["digital", "physical", "service", "nft", "subscription"] as const),
      price: faker.finance.amount({ min: 10, max: 500, dec: 2 }),
      stock: faker.number.int({ min: 1, max: 100 }),
      sold: faker.number.int({ min: 0, max: 50 }),
      rating: faker.finance.amount({ min: 3, max: 5, dec: 2 }),
    });
  }
  await db.insert(schema.listings).values(listings);

  console.log("✅ Database seeded successfully!");
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
