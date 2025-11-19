const Redis = require("ioredis");

const redis = new Redis({
  host: "redis-16231.c252.ap-southeast-1-1.ec2.cloud.redislabs.com",
  port: 16231,
  password: "i9yEWKpVcNLq3xNR5XqP6LTrgwlcpORe",
  db: 0,
});

async function clearCache() {
  try {
    console.log("🔄 Connecting to Redis...");
    await redis.ping();
    console.log("✅ Connected to Redis");

    // Get all keys
    const keys = await redis.keys("*");
    console.log(`📊 Found ${keys.length} keys`);

    if (keys.length > 0) {
      console.log("🗑️  Deleting all keys...");
      await redis.flushdb();
      console.log("✅ Cache cleared successfully!");
    } else {
      console.log("ℹ️  Cache is already empty");
    }

    redis.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    redis.disconnect();
    process.exit(1);
  }
}

clearCache();
