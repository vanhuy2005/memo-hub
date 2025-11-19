/**
 * Test Email with Real Account
 * Register account nguyen.van.quang.huy.2105@gmail.com
 */

const axios = require("axios");

const API_BASE = "http://localhost:5000/api";
const REAL_EMAIL = "nguyen.van.quang.huy.2105@gmail.com";
const REAL_PASSWORD = "quanghuy20102005";

async function testRegisterAndEmail() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   📧 EMAIL NOTIFICATION TEST           ║");
  console.log("╚════════════════════════════════════════╝\n");

  try {
    console.log("📝 Registering new account...");
    console.log(`   Email: ${REAL_EMAIL}`);

    const response = await axios.post(`${API_BASE}/auth/register`, {
      email: REAL_EMAIL,
      password: REAL_PASSWORD,
      username: "quanghuy2105",
    });

    if (response.data.success) {
      console.log("\n✅ Registration successful!");
      console.log(`   User ID: ${response.data.data.user.id}`);
      console.log(`   Username: ${response.data.data.user.username}`);
      console.log("\n📧 Welcome email should be sent to:");
      console.log(`   → ${REAL_EMAIL}`);
      console.log("\n⏰ Check your inbox in 1-2 minutes...");
      console.log("\n💡 TIP: Check spam folder if not in inbox");
    } else {
      console.log("\n❌ Registration failed:", response.data.message);

      if (response.data.message.includes("already exists")) {
        console.log("\n🔐 Account already exists. Trying login instead...");

        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: REAL_EMAIL,
          password: REAL_PASSWORD,
        });

        if (loginResponse.data.success) {
          console.log("✅ Login successful!");
          console.log(`   User ID: ${loginResponse.data.data.user.id}`);
          console.log(
            "\n💡 Welcome email was sent during initial registration."
          );
        }
      }
    }
  } catch (error) {
    if (error.response?.data?.message?.includes("already exists")) {
      console.log("\n⚠️  Account already exists!");
      console.log(
        "💡 Welcome email was already sent during initial registration."
      );
      console.log(`\n✅ You can login with:`);
      console.log(`   Email: ${REAL_EMAIL}`);
      console.log(`   Password: ${REAL_PASSWORD}`);
    } else {
      console.log("\n❌ Error:", error.response?.data || error.message);
    }
  }

  console.log("\n════════════════════════════════════════\n");
}

testRegisterAndEmail();
