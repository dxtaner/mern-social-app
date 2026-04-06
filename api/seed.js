require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const Notification = require("./models/Notification");
const connectDB = require("./config/db");

const seedData = async () => {
  try {
    await connectDB();
    console.log("🚀 DB connected, cleaning...");

    // 🧹 TEMİZLE
    await Promise.all([
      User.deleteMany(),
      Post.deleteMany(),
      Comment.deleteMany(),
      Notification.deleteMany(),
    ]);
    console.log("🧹 Old data cleared");

    // 🔐 PASSWORD
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 📍 DATA
    const cities = [
      "İstanbul",
      "Ankara",
      "İzmir",
      "Antalya",
      "Bursa",
      "Eskişehir",
      "Muğla",
      "Trabzon",
      "Adana",
      "Gaziantep",
    ];

    const bioTemplates = [
      "Yazılım geliştirici 💻",
      "Gezgin 🌍",
      "Tasarım meraklısı ✨",
      "Fotoğrafçı 📸",
      "Kitap kurdu 📚",
      "Müzisyen 🎸",
      "Gelecek burada! 🚀",
      "Gastronomi tutkunu 🍝",
    ];

    const userNames = [
      "taner_dev",
      "asli_y",
      "mert_demir",
      "selin_g",
      "deniz_kaya",
      "can_oz",
      "ezgi_su",
      "burak_x",
      "melis_v",
      "onur_dev",
      "ayse_bulut",
      "murat_han",
      "zeynep_ada",
      "berk_can",
      "elif_nur",
      "hakan_y",
      "gamze_t",
      "emre_b",
      "ipek_s",
      "koray_v",
      "pelin_d",
      "serkan_m",
      "nil_su",
      "oguz_k",
      "didem_a",
    ];

    // 👤 USERS
    const users = await User.insertMany(
      userNames.map((username) => ({
        username,
        email: `${username}@test.com`,
        password: hashedPassword,

        bio: bioTemplates[Math.floor(Math.random() * bioTemplates.length)],
        location: cities[Math.floor(Math.random() * cities.length)],

        coverPic: `https://picsum.photos/seed/${username}cover/1200/400`,
        profilePic: `https://i.pravatar.cc/150?u=${username}`,

        followers: [],
        following: [],

        // 🔥 AUTH UYUMLU
        isVerified: true,
        emailToken: null,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      })),
    );

    console.log(`👤 ${users.length} users created`);

    // 📝 POSTS
    const postCaptions = [
      "Harika bir gün! ☀️",
      "Yeni proje yayında! 💻",
      "Kahve molası ☕",
      "Manzara efsane 😍",
      "Kod yazmak sanattır 🎨",
      "Hafta sonu modu 🚗",
      "Yeni başlangıç 🌅",
      "React güçlü ⚛️",
      "Akşam keyfi 🍝",
    ];

    const posts = [];

    users.forEach((user) => {
      const count = Math.floor(Math.random() * 3) + 2;

      for (let i = 1; i <= count; i++) {
        posts.push({
          userId: user._id.toString(),
          desc: postCaptions[Math.floor(Math.random() * postCaptions.length)],
          img: `https://picsum.photos/seed/${user.username + i}/800/600`,
          likes: [],
        });
      }
    });

    const insertedPosts = await Post.insertMany(posts);
    console.log(`🖼️ ${insertedPosts.length} posts created`);

    // ❤️ LIKES
    await Promise.all(
      insertedPosts.map((post) => {
        const randomLikes = users
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 15))
          .map((u) => u._id.toString());

        return Post.findByIdAndUpdate(post._id, {
          $set: { likes: randomLikes },
        });
      }),
    );

    // 💬 COMMENTS
    const commentTexts = [
      "Harika!",
      "Çok iyi 🔥",
      "Katılıyorum 💯",
      "Efsane",
      "Başarılar!",
      "👏👏",
    ];

    const comments = [];

    insertedPosts.forEach((post) => {
      const count = Math.floor(Math.random() * 3);

      for (let i = 0; i < count; i++) {
        const commenter = users[Math.floor(Math.random() * users.length)];

        comments.push({
          userId: commenter._id.toString(),
          postId: post._id.toString(),
          desc: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        });
      }
    });

    await Comment.insertMany(comments);
    console.log(`💬 ${comments.length} comments added`);

    // 🤝 FOLLOW SYSTEM
    await Promise.all(
      users.map(async (user) => {
        const followingList = users
          .filter((u) => u._id.toString() !== user._id.toString())
          .sort(() => 0.5 - Math.random())
          .slice(0, 6)
          .map((u) => u._id.toString());

        await User.findByIdAndUpdate(user._id, {
          $set: { following: followingList },
        });

        await Promise.all(
          followingList.map((targetId) =>
            User.findByIdAndUpdate(targetId, {
              $addToSet: { followers: user._id.toString() },
            }),
          ),
        );
      }),
    );

    console.log("🤝 Follow relations created");

    // 🔔 NOTIFICATIONS
    const notifications = [];

    insertedPosts.slice(0, 20).forEach((post) => {
      const sender = users.find((u) => u._id.toString() !== post.userId);

      if (sender) {
        notifications.push({
          senderId: sender._id.toString(),
          receiverId: post.userId,
          type: Math.random() > 0.5 ? "like" : "comment",
          postId: post._id.toString(),
          isRead: false,
        });
      }
    });

    await Notification.insertMany(notifications);
    console.log(`🔔 ${notifications.length} notifications created`);

    console.log("\n🔥 SEED SUCCESSFULLY COMPLETED!");
    process.exit(0);
  } catch (err) {
    console.error("❌ SEED ERROR:", err);
    process.exit(1);
  }
};

seedData();
