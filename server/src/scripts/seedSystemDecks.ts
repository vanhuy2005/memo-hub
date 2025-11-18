import mongoose from "mongoose";
import SystemDeck from "../models/SystemDeck";
import SystemCard from "../models/SystemCard";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/memohub";

// IELTS Essential Vocabulary
const ieltsVocab = {
  deck: {
    name: "IELTS Essential 5.0-6.0",
    description:
      "Từ vựng thiết yếu cho IELTS band 5.0-6.0, bao gồm các chủ đề phổ biến",
    language: "en",
    level: "IELTS 6.0",
    category: "Academic",
    is_active: true,
  },
  cards: [
    {
      front_content: "abundant",
      back_content: "nhiều, phong phú",
      pronunciation: "/əˈbʌndənt/",
      example_sentence: "The forest has abundant wildlife.",
    },
    {
      front_content: "achieve",
      back_content: "đạt được",
      pronunciation: "/əˈtʃiːv/",
      example_sentence: "She achieved her goal of learning English.",
    },
    {
      front_content: "adapt",
      back_content: "thích nghi",
      pronunciation: "/əˈdæpt/",
      example_sentence: "Animals adapt to their environment.",
    },
    {
      front_content: "advantage",
      back_content: "lợi thế",
      pronunciation: "/ədˈvɑːntɪdʒ/",
      example_sentence: "Speaking two languages is an advantage.",
    },
    {
      front_content: "analyze",
      back_content: "phân tích",
      pronunciation: "/ˈænəlaɪz/",
      example_sentence: "We need to analyze the data carefully.",
    },
    {
      front_content: "approach",
      back_content: "tiếp cận, phương pháp",
      pronunciation: "/əˈproʊtʃ/",
      example_sentence: "His approach to teaching is innovative.",
    },
    {
      front_content: "appropriate",
      back_content: "thích hợp",
      pronunciation: "/əˈproʊpriət/",
      example_sentence: "Wear appropriate clothing for the interview.",
    },
    {
      front_content: "benefit",
      back_content: "lợi ích",
      pronunciation: "/ˈbenɪfɪt/",
      example_sentence: "Exercise has many health benefits.",
    },
    {
      front_content: "challenge",
      back_content: "thách thức",
      pronunciation: "/ˈtʃælɪndʒ/",
      example_sentence: "Learning a new language is a challenge.",
    },
    {
      front_content: "communicate",
      back_content: "giao tiếp",
      pronunciation: "/kəˈmjuːnɪkeɪt/",
      example_sentence: "It is important to communicate clearly.",
    },
    {
      front_content: "community",
      back_content: "cộng đồng",
      pronunciation: "/kəˈmjuːnəti/",
      example_sentence: "She is active in her local community.",
    },
    {
      front_content: "complex",
      back_content: "phức tạp",
      pronunciation: "/ˈkɑːmpleks/",
      example_sentence: "The problem is more complex than it seems.",
    },
    {
      front_content: "consequence",
      back_content: "hậu quả",
      pronunciation: "/ˈkɑːnsɪkwens/",
      example_sentence: "Every action has consequences.",
    },
    {
      front_content: "considerable",
      back_content: "đáng kể",
      pronunciation: "/kənˈsɪdərəbl/",
      example_sentence: "He spent considerable time on the project.",
    },
    {
      front_content: "contribute",
      back_content: "đóng góp",
      pronunciation: "/kənˈtrɪbjuːt/",
      example_sentence: "Everyone should contribute to society.",
    },
    {
      front_content: "crucial",
      back_content: "quan trọng",
      pronunciation: "/ˈkruːʃl/",
      example_sentence: "Time management is crucial for success.",
    },
    {
      front_content: "demonstrate",
      back_content: "chứng minh, trình diễn",
      pronunciation: "/ˈdemənstreɪt/",
      example_sentence: "Can you demonstrate how this works?",
    },
    {
      front_content: "develop",
      back_content: "phát triển",
      pronunciation: "/dɪˈveləp/",
      example_sentence: "We need to develop new skills.",
    },
    {
      front_content: "economy",
      back_content: "nền kinh tế",
      pronunciation: "/ɪˈkɑːnəmi/",
      example_sentence: "The economy is growing rapidly.",
    },
    {
      front_content: "efficient",
      back_content: "hiệu quả",
      pronunciation: "/ɪˈfɪʃnt/",
      example_sentence: "This is a more efficient way to work.",
    },
  ],
};

// JLPT N5 Basic
const jlptN5Vocab = {
  deck: {
    name: "JLPT N5 Cơ bản",
    description:
      "Từ vựng cơ bản JLPT N5 - 100 từ thiết yếu cho người mới bắt đầu",
    language: "ja",
    level: "N5",
    category: "Basic",
    is_active: true,
  },
  cards: [
    {
      front_content: "私（わたし）",
      back_content: "tôi",
      pronunciation: "watashi",
      example_sentence: "私は学生です。(Tôi là học sinh)",
    },
    {
      front_content: "あなた",
      back_content: "bạn",
      pronunciation: "anata",
      example_sentence: "あなたは先生ですか。(Bạn có phải là giáo viên không?)",
    },
    {
      front_content: "食べる（たべる）",
      back_content: "ăn",
      pronunciation: "taberu",
      example_sentence: "ご飯を食べます。(Ăn cơm)",
    },
    {
      front_content: "飲む（のむ）",
      back_content: "uống",
      pronunciation: "nomu",
      example_sentence: "水を飲みます。(Uống nước)",
    },
    {
      front_content: "行く（いく）",
      back_content: "đi",
      pronunciation: "iku",
      example_sentence: "学校に行きます。(Đi đến trường)",
    },
    {
      front_content: "来る（くる）",
      back_content: "đến",
      pronunciation: "kuru",
      example_sentence: "友達が来ます。(Bạn đến)",
    },
    {
      front_content: "見る（みる）",
      back_content: "nhìn, xem",
      pronunciation: "miru",
      example_sentence: "テレビを見ます。(Xem TV)",
    },
    {
      front_content: "聞く（きく）",
      back_content: "nghe",
      pronunciation: "kiku",
      example_sentence: "音楽を聞きます。(Nghe nhạc)",
    },
    {
      front_content: "話す（はなす）",
      back_content: "nói",
      pronunciation: "hanasu",
      example_sentence: "日本語を話します。(Nói tiếng Nhật)",
    },
    {
      front_content: "書く（かく）",
      back_content: "viết",
      pronunciation: "kaku",
      example_sentence: "手紙を書きます。(Viết thư)",
    },
    {
      front_content: "読む（よむ）",
      back_content: "đọc",
      pronunciation: "yomu",
      example_sentence: "本を読みます。(Đọc sách)",
    },
    {
      front_content: "勉強（べんきょう）",
      back_content: "học tập",
      pronunciation: "benkyou",
      example_sentence: "毎日勉強します。(Học mỗi ngày)",
    },
    {
      front_content: "仕事（しごと）",
      back_content: "công việc",
      pronunciation: "shigoto",
      example_sentence: "仕事をします。(Làm việc)",
    },
    {
      front_content: "学校（がっこう）",
      back_content: "trường học",
      pronunciation: "gakkou",
      example_sentence: "学校は遠いです。(Trường xa)",
    },
    {
      front_content: "家（いえ）",
      back_content: "nhà",
      pronunciation: "ie",
      example_sentence: "家に帰ります。(Về nhà)",
    },
    {
      front_content: "友達（ともだち）",
      back_content: "bạn bè",
      pronunciation: "tomodachi",
      example_sentence: "友達が多いです。(Có nhiều bạn)",
    },
    {
      front_content: "先生（せんせい）",
      back_content: "giáo viên",
      pronunciation: "sensei",
      example_sentence: "先生は優しいです。(Giáo viên tốt bụng)",
    },
    {
      front_content: "学生（がくせい）",
      back_content: "học sinh",
      pronunciation: "gakusei",
      example_sentence: "私は学生です。(Tôi là học sinh)",
    },
    {
      front_content: "時間（じかん）",
      back_content: "thời gian",
      pronunciation: "jikan",
      example_sentence: "時間がありません。(Không có thời gian)",
    },
    {
      front_content: "今（いま）",
      back_content: "bây giờ",
      pronunciation: "ima",
      example_sentence: "今何時ですか。(Bây giờ mấy giờ?)",
    },
  ],
};

// TOPIK I Level 1
const topikVocab = {
  deck: {
    name: "TOPIK I Cấp độ 1",
    description: "Từ vựng TOPIK I cấp độ 1 - Nền tảng tiếng Hàn cho người mới",
    language: "ko",
    level: "TOPIK I",
    category: "Basic",
    is_active: true,
  },
  cards: [
    {
      front_content: "나",
      back_content: "tôi",
      pronunciation: "na",
      example_sentence: "나는 학생이에요. (Tôi là học sinh)",
    },
    {
      front_content: "너",
      back_content: "bạn (thân mật)",
      pronunciation: "neo",
      example_sentence: "너는 누구니? (Bạn là ai?)",
    },
    {
      front_content: "먹다",
      back_content: "ăn",
      pronunciation: "meokda",
      example_sentence: "밥을 먹어요. (Ăn cơm)",
    },
    {
      front_content: "마시다",
      back_content: "uống",
      pronunciation: "masida",
      example_sentence: "물을 마셔요. (Uống nước)",
    },
    {
      front_content: "가다",
      back_content: "đi",
      pronunciation: "gada",
      example_sentence: "학교에 가요. (Đi đến trường)",
    },
    {
      front_content: "오다",
      back_content: "đến",
      pronunciation: "oda",
      example_sentence: "친구가 와요. (Bạn đến)",
    },
    {
      front_content: "보다",
      back_content: "nhìn, xem",
      pronunciation: "boda",
      example_sentence: "영화를 봐요. (Xem phim)",
    },
    {
      front_content: "듣다",
      back_content: "nghe",
      pronunciation: "deutda",
      example_sentence: "음악을 들어요. (Nghe nhạc)",
    },
    {
      front_content: "말하다",
      back_content: "nói",
      pronunciation: "malhada",
      example_sentence: "한국어를 말해요. (Nói tiếng Hàn)",
    },
    {
      front_content: "쓰다",
      back_content: "viết",
      pronunciation: "sseuda",
      example_sentence: "편지를 써요. (Viết thư)",
    },
    {
      front_content: "읽다",
      back_content: "đọc",
      pronunciation: "ikda",
      example_sentence: "책을 읽어요. (Đọc sách)",
    },
    {
      front_content: "공부",
      back_content: "học tập",
      pronunciation: "gongbu",
      example_sentence: "매일 공부해요. (Học mỗi ngày)",
    },
    {
      front_content: "일",
      back_content: "công việc",
      pronunciation: "il",
      example_sentence: "일을 해요. (Làm việc)",
    },
    {
      front_content: "학교",
      back_content: "trường học",
      pronunciation: "hakgyo",
      example_sentence: "학교가 멀어요. (Trường xa)",
    },
    {
      front_content: "집",
      back_content: "nhà",
      pronunciation: "jip",
      example_sentence: "집에 가요. (Về nhà)",
    },
    {
      front_content: "친구",
      back_content: "bạn bè",
      pronunciation: "chingu",
      example_sentence: "친구가 많아요. (Có nhiều bạn)",
    },
    {
      front_content: "선생님",
      back_content: "giáo viên",
      pronunciation: "seonsaengnim",
      example_sentence: "선생님이 좋아요. (Giáo viên tốt)",
    },
    {
      front_content: "학생",
      back_content: "học sinh",
      pronunciation: "haksaeng",
      example_sentence: "저는 학생이에요. (Tôi là học sinh)",
    },
    {
      front_content: "시간",
      back_content: "thời gian",
      pronunciation: "sigan",
      example_sentence: "시간이 없어요. (Không có thời gian)",
    },
    {
      front_content: "지금",
      back_content: "bây giờ",
      pronunciation: "jigeum",
      example_sentence: "지금 몇 시예요? (Bây giờ mấy giờ?)",
    },
  ],
};

// HSK 1 Basic
const hskVocab = {
  deck: {
    name: "HSK 1 Cơ bản",
    description: "Từ vựng HSK 1 - 150 từ cơ bản tiếng Trung",
    language: "zh",
    level: "HSK 1",
    category: "Basic",
    is_active: true,
  },
  cards: [
    {
      front_content: "我 (wǒ)",
      back_content: "tôi",
      pronunciation: "wǒ",
      example_sentence: "我是学生。(Tôi là học sinh)",
    },
    {
      front_content: "你 (nǐ)",
      back_content: "bạn",
      pronunciation: "nǐ",
      example_sentence: "你好！(Xin chào!)",
    },
    {
      front_content: "他 (tā)",
      back_content: "anh ấy",
      pronunciation: "tā",
      example_sentence: "他是老师。(Anh ấy là giáo viên)",
    },
    {
      front_content: "她 (tā)",
      back_content: "cô ấy",
      pronunciation: "tā",
      example_sentence: "她很漂亮。(Cô ấy đẹp)",
    },
    {
      front_content: "吃 (chī)",
      back_content: "ăn",
      pronunciation: "chī",
      example_sentence: "我吃饭。(Tôi ăn cơm)",
    },
    {
      front_content: "喝 (hē)",
      back_content: "uống",
      pronunciation: "hē",
      example_sentence: "喝水 (Uống nước)",
    },
    {
      front_content: "去 (qù)",
      back_content: "đi",
      pronunciation: "qù",
      example_sentence: "去学校 (Đi đến trường)",
    },
    {
      front_content: "来 (lái)",
      back_content: "đến",
      pronunciation: "lái",
      example_sentence: "他来了。(Anh ấy đến rồi)",
    },
    {
      front_content: "看 (kàn)",
      back_content: "nhìn, xem",
      pronunciation: "kàn",
      example_sentence: "看书 (Đọc sách)",
    },
    {
      front_content: "听 (tīng)",
      back_content: "nghe",
      pronunciation: "tīng",
      example_sentence: "听音乐 (Nghe nhạc)",
    },
    {
      front_content: "说 (shuō)",
      back_content: "nói",
      pronunciation: "shuō",
      example_sentence: "说汉语 (Nói tiếng Trung)",
    },
    {
      front_content: "写 (xiě)",
      back_content: "viết",
      pronunciation: "xiě",
      example_sentence: "写字 (Viết chữ)",
    },
    {
      front_content: "读 (dú)",
      back_content: "đọc",
      pronunciation: "dú",
      example_sentence: "读书 (Đọc sách)",
    },
    {
      front_content: "学习 (xuéxí)",
      back_content: "học tập",
      pronunciation: "xuéxí",
      example_sentence: "我学习汉语。(Tôi học tiếng Trung)",
    },
    {
      front_content: "工作 (gōngzuò)",
      back_content: "công việc",
      pronunciation: "gōngzuò",
      example_sentence: "他工作。(Anh ấy làm việc)",
    },
    {
      front_content: "学校 (xuéxiào)",
      back_content: "trường học",
      pronunciation: "xuéxiào",
      example_sentence: "我在学校。(Tôi ở trường)",
    },
    {
      front_content: "家 (jiā)",
      back_content: "nhà",
      pronunciation: "jiā",
      example_sentence: "回家 (Về nhà)",
    },
    {
      front_content: "朋友 (péngyou)",
      back_content: "bạn bè",
      pronunciation: "péngyou",
      example_sentence: "我的朋友 (Bạn của tôi)",
    },
    {
      front_content: "老师 (lǎoshī)",
      back_content: "giáo viên",
      pronunciation: "lǎoshī",
      example_sentence: "我的老师 (Giáo viên của tôi)",
    },
    {
      front_content: "学生 (xuésheng)",
      back_content: "học sinh",
      pronunciation: "xuésheng",
      example_sentence: "他是学生。(Anh ấy là học sinh)",
    },
  ],
};

async function seedSystemDecks() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected successfully!");

    // Clear existing data
    console.log("🗑️  Clearing existing system decks...");
    await SystemDeck.deleteMany({});
    await SystemCard.deleteMany({});
    console.log("✅ Cleared!");

    const decksToSeed = [ieltsVocab, jlptN5Vocab, topikVocab, hskVocab];

    for (const vocabSet of decksToSeed) {
      console.log(`\n📚 Creating deck: ${vocabSet.deck.name}...`);

      // Create deck
      const deckData = {
        ...vocabSet.deck,
        card_count: vocabSet.cards.length,
      };
      const deck = await SystemDeck.create(deckData);
      console.log(`✅ Created deck with ID: ${deck._id}`);

      // Create cards
      console.log(`📝 Creating ${vocabSet.cards.length} cards...`);
      const cardsData = vocabSet.cards.map((card) => ({
        ...card,
        system_deck_id: deck._id,
      }));

      await SystemCard.insertMany(cardsData);
      console.log(`✅ Created ${vocabSet.cards.length} cards!`);
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\n📊 Summary:");
    const totalDecks = await SystemDeck.countDocuments();
    const totalCards = await SystemCard.countDocuments();
    console.log(`   - Total decks: ${totalDecks}`);
    console.log(`   - Total cards: ${totalCards}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedSystemDecks();
