/**
 * Test Workflow Script
 * Tests complete user flow: Login -> Get Stats -> Review Card -> Send Email
 */

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";
const TEST_EMAIL = "test@memohub.com"; // Seed account
const TEST_PASSWORD = "123456"; // Seed password

// Test account
let authToken = "";
let userId = "";

async function testLogin() {
  console.log("\n========================================");
  console.log("📝 TEST 1: LOGIN");
  console.log("========================================");

  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (response.data.success) {
      authToken = response.data.data.token;
      userId = response.data.data.user.id || response.data.data.user._id;
      console.log("✅ Login successful");
      console.log(`   User ID: ${userId}`);
      console.log(`   Username: ${response.data.data.user.username}`);
      console.log(`   Email: ${response.data.data.user.email}`);
      return true;
    } else {
      console.log("❌ Login failed:", response.data.message);
      return false;
    }
  } catch (error) {
    console.log("❌ Login error details:");
    console.log("   Status:", error.response?.status);
    console.log("   Data:", error.response?.data);
    console.log("   Message:", error.message);
    console.log("\n⚠️  Attempting registration...");
    return await testRegister();
  }
}

async function testRegister() {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      username: "quanghuy2105",
    });

    if (response.data.success) {
      authToken = response.data.data.token;
      userId = response.data.data.user.id || response.data.data.user._id;
      console.log("✅ Registration successful");
      console.log(`   User ID: ${userId}`);
      console.log(`   Username: ${response.data.data.user.username}`);
      console.log(`   Email: ${response.data.data.user.email}`);
      return true;
    }
  } catch (error) {
    console.log(
      "❌ Registration error:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function testGetStats() {
  console.log("\n========================================");
  console.log("📊 TEST 2: GET STUDY STATS");
  console.log("========================================");

  try {
    const timezoneOffset = -new Date().getTimezoneOffset() / 60;
    console.log(`   Timezone Offset: UTC+${timezoneOffset}`);

    const response = await axios.get(
      `${API_BASE}/study/stats?timezoneOffset=${timezoneOffset}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (response.data.success) {
      const stats = response.data.stats;
      console.log("✅ Stats retrieved successfully");
      console.log(`   Total Cards: ${stats.total_cards}`);
      console.log(`   Cards Studied Today: ${stats.cards_studied_today}`);
      console.log(`   Cards Due Today: ${stats.cards_due_today}`);
      console.log(`   New Cards: ${stats.new_cards}`);
      console.log(`   Learning Cards: ${stats.learning_cards}`);
      console.log(`   Mastered Cards: ${stats.mastered_cards}`);
      console.log(`   Current Streak: ${stats.current_streak} days`);
      return stats;
    }
  } catch (error) {
    console.log("❌ Get stats error:", error.response?.data || error.message);
  }
  return null;
}

async function testGetStudySession() {
  console.log("\n========================================");
  console.log("🎴 TEST 3: GET STUDY SESSION");
  console.log("========================================");

  try {
    const response = await axios.get(`${API_BASE}/study/session?limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.data.success) {
      const cards = response.data.data?.cards || response.data.cards || [];
      console.log(`✅ Study session retrieved: ${cards.length} cards`);
      if (cards.length > 0) {
        console.log(`   First card ID: ${cards[0]._id}`);
        const front = cards[0].front || "No content";
        console.log(
          `   Front: ${front.substring(0, Math.min(50, front.length))}...`
        );
        return cards[0]._id; // Return first card ID for review test
      }
    }
  } catch (error) {
    console.log("❌ Get session error:", error.response?.data || error.message);
  }
  return null;
}

async function testReviewCard(cardId) {
  console.log("\n========================================");
  console.log("✍️  TEST 4: REVIEW CARD");
  console.log("========================================");

  if (!cardId) {
    console.log("⚠️  No card available for review");
    return;
  }

  try {
    const timezoneOffset = -new Date().getTimezoneOffset() / 60;
    console.log(`   Card ID: ${cardId}`);
    console.log(`   Grade: 2 (Good)`);
    console.log(`   Timezone: UTC+${timezoneOffset}`);

    const response = await axios.post(
      `${API_BASE}/study/review/${cardId}`,
      {
        grade: 2,
        timezoneOffset: timezoneOffset,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (response.data.success) {
      const data = response.data.data;
      console.log("✅ Card reviewed successfully");
      console.log(`   New Interval: ${data.new_interval} days`);
      console.log(
        `   Cards Studied Today: ${data.daily_progress.cards_studied_today}`
      );
      console.log(`   Cards Due: ${data.daily_progress.cards_due_today}`);
      console.log(`   Current Streak: ${data.streak.current} days`);
      return true;
    }
  } catch (error) {
    console.log("❌ Review error:", error.response?.data || error.message);
  }
  return false;
}

async function testSendEmail() {
  console.log("\n========================================");
  console.log("📧 TEST 5: SEND TEST EMAIL");
  console.log("========================================");
  console.log("⚠️  Email test skipped (requires manual trigger)");
  console.log("   To test emails:");
  console.log("   1. Register a new account with your email");
  console.log("   2. Check inbox for welcome email");
  console.log("   3. Level up to trigger achievement email");
}

async function runTests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════╗");
  console.log("║   🧪 MEMOHUB WORKFLOW TEST SUITE      ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`Test Account: ${TEST_EMAIL}`);
  console.log(`Time: ${new Date().toLocaleString("vi-VN")}`);

  // Test 1: Login
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log("\n❌ Test suite aborted - Login failed");
    process.exit(1);
  }

  // Test 2: Get Stats (Before)
  const statsBefore = await testGetStats();

  // Test 3: Get Study Session
  const cardId = await testGetStudySession();

  // Test 4: Review Card
  if (cardId) {
    await testReviewCard(cardId);

    // Test 5: Get Stats (After) - Should show +1 card studied
    console.log("\n📊 Verifying stats update...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const statsAfter = await testGetStats();

    if (statsBefore && statsAfter) {
      const studiedBefore = statsBefore.cards_studied_today;
      const studiedAfter = statsAfter.cards_studied_today;

      if (studiedAfter > studiedBefore) {
        console.log(
          `\n✅ Stats updated correctly: ${studiedBefore} → ${studiedAfter}`
        );
      } else {
        console.log(
          `\n⚠️  Stats NOT updated: Still at ${studiedAfter} (expected ${
            studiedBefore + 1
          })`
        );
      }
    }
  }

  // Test 6: Send Email
  await testSendEmail();

  console.log("\n========================================");
  console.log("✅ TEST SUITE COMPLETED");
  console.log("========================================\n");

  process.exit(0);
}

// Run tests
runTests().catch((error) => {
  console.error("\n❌ Test suite failed:", error);
  process.exit(1);
});
