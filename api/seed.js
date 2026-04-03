require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const Notification = require("./models/Notification");
const connectDB = require("./config/db");

const seedData = async () => {
  try {
    await connectDB();
    console.log("🚀 Veritabanına bağlanıldı. Temizlik başlıyor...");

    await Promise.all([
      User.deleteMany(),
      Post.deleteMany(),
      Comment.deleteMany(),
      Notification.deleteMany(),
    ]);
    console.log("🧹 Tüm eski veriler silindi.");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("123456", saltRounds);

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
      "Kitap kurdu 🐈",
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
      })),
    );
    console.log(`👤 ${users.length} kullanıcı eklendi.`);

    const postCaptions = [
      "Harika bir gün! ☀️",
      "Yeni proje yayında! 💻",
      "Kahve molası... ☕",
      "Manzara efsane 😍",
      "Kod yazmak sanattır. 🎨",
      "Hafta sonu modu 🚗",
      "Yeni bir başlangıç 🌅",
      "React çok güçlü ⚛️",
      "Akşam yemeği keyfi 🍝",
    ];

    const postsToInsert = [];
    users.forEach((user) => {
      const postCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 1; i <= postCount; i++) {
        postsToInsert.push({
          userId: user._id.toString(),
          desc: postCaptions[Math.floor(Math.random() * postCaptions.length)],
          img: `https://picsum.photos/seed/${user.username + i}/800/600`,
          likes: [],
        });
      }
    });

    const insertedPosts = await Post.insertMany(postsToInsert);
    console.log(`🖼️ ${insertedPosts.length} gönderi eklendi.`);

    for (let post of insertedPosts) {
      const randomLikes = users
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 15))
        .map((u) => u._id.toString());

      await Post.findByIdAndUpdate(post._id, { $set: { likes: randomLikes } });
    }

    const commentTexts = [
      "Harika!",
      "Çok iyi 🔥",
      "Katılıyorum 💯",
      "Efsane",
      "Başarılar!",
      "👏👏",
    ];

    const commentsToInsert = [];
    insertedPosts.forEach((post) => {
      const commentCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < commentCount; i++) {
        const commenter = users[Math.floor(Math.random() * users.length)];
        commentsToInsert.push({
          userId: commenter._id.toString(),
          postId: post._id.toString(),
          desc: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        });
      }
    });

    await Comment.insertMany(commentsToInsert);

    for (let user of users) {
      const followingList = users
        .filter((u) => u._id.toString() !== user._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
        .map((u) => u._id.toString());

      await User.findByIdAndUpdate(user._id, {
        $set: { following: followingList },
      });

      for (let targetId of followingList) {
        await User.findByIdAndUpdate(targetId, {
          $addToSet: { followers: user._id.toString() },
        });
      }
    }

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

    console.log("\n🔥 TÜM VERİLER BAŞARIYLA OLUŞTURULDU!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed hatası:", err);
    process.exit(1);
  }
};

seedData();
