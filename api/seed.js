require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const Notification = require("./models/Notification");

const connectDB = require("./config/db");

const seedData = async () => {
  try {
    await connectDB();
    console.log("DB connected...");

    // 🔥 Clean collections
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Notification.deleteMany();

    // 👤 USERS (DAHA FAZLA)
    const users = await User.insertMany([
      { username: "taner", email: "taner@test.com", password: "123456" },
      { username: "ahmet", email: "ahmet@test.com", password: "123456" },
      { username: "mehmet", email: "mehmet@test.com", password: "123456" },
      { username: "ayse", email: "ayse@test.com", password: "123456" },
      { username: "fatma", email: "fatma@test.com", password: "123456" },
      { username: "ali", email: "ali@test.com", password: "123456" },
      { username: "veli", email: "veli@test.com", password: "123456" },
      { username: "zeynep", email: "zeynep@test.com", password: "123456" },
      { username: "can", email: "can@test.com", password: "123456" },
      { username: "elif", email: "elif@test.com", password: "123456" },
    ]);

    console.log("Users added");

    // 📝 POSTS (her user için post)
    const posts = [];

    users.forEach((user, index) => {
      for (let i = 1; i <= 3; i++) {
        posts.push({
          userId: user._id,
          desc: `Post ${i} by ${user.username} 🚀`,
          img: `https://picsum.photos/seed/${user.username + i}/500`,
          likes: [],
        });
      }
    });

    const insertedPosts = await Post.insertMany(posts);
    console.log("Posts added");

    // 💬 COMMENTS (random dağıtım)
    const comments = [];

    insertedPosts.forEach((post, index) => {
      const randomUser1 = users[Math.floor(Math.random() * users.length)];
      const randomUser2 = users[Math.floor(Math.random() * users.length)];

      comments.push(
        {
          userId: randomUser1._id,
          postId: post._id,
          desc: "Çok iyi 🔥",
        },
        {
          userId: randomUser2._id,
          postId: post._id,
          desc: "Harika 👍",
        },
      );
    });

    await Comment.insertMany(comments);
    console.log("Comments added");

    // ❤️ LIKES (random like ekleme)
    for (let post of insertedPosts) {
      const randomUsers = users
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * users.length));

      await Post.findByIdAndUpdate(post._id, {
        $set: {
          likes: randomUsers.map((u) => u._id),
        },
      });
    }

    console.log("Likes added");

    // 👥 FOLLOW SYSTEM (random follow)
    for (let i = 0; i < users.length; i++) {
      const following = users
        .filter((u) => u._id.toString() !== users[i]._id.toString())
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      await User.findByIdAndUpdate(users[i]._id, {
        $set: {
          following: following.map((u) => u._id),
        },
      });

      for (let f of following) {
        await User.findByIdAndUpdate(f._id, {
          $addToSet: {
            followers: users[i]._id,
          },
        });
      }
    }

    console.log("Follow relations added");

    // 🔔 NOTIFICATIONS (çoklu)
    const notifications = [];

    insertedPosts.slice(0, 10).forEach((post) => {
      const randomSender = users[Math.floor(Math.random() * users.length)];

      notifications.push(
        {
          senderId: randomSender._id,
          receiverId: post.userId,
          type: "like",
          postId: post._id,
        },
        {
          senderId: randomSender._id,
          receiverId: post.userId,
          type: "comment",
          postId: post._id,
        },
      );
    });

    users.forEach((user) => {
      const randomFollow = users[Math.floor(Math.random() * users.length)];

      if (user._id.toString() !== randomFollow._id.toString()) {
        notifications.push({
          senderId: user._id,
          receiverId: randomFollow._id,
          type: "follow",
        });
      }
    });

    await Notification.insertMany(notifications);

    console.log("Notifications added");

    console.log("🔥 SEED COMPLETED SUCCESSFULLY");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedData();
