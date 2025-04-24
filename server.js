require('dotenv').config();

const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
const { deleteUser } = require("./model/deleteUser.js");

const express = require("express");
const cors = require("cors");
const path = require("path");
const hbs = require("hbs");
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => {
    console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    });

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions',
            ttl: 21 * 24 * 60 * 60, // Time to live (14 days by default)
        }),
        cookie: {
            secure: false,  
            httpOnly: true,
        }
    }));

app.use(methodOverride("_method"));

// Middleware to parse JSON bodies
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
    origin: 'https://byahero-group-8.onrender.com', // Specify your frontend URL
    credentials: true,  // Allow cookies to be sent
}));

// Set up Handlebars as the view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views/layouts"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

hbs.registerHelper('isUpvoted', (postId, upvotedPosts) => {
    if (upvotedPosts && upvotedPosts.includes(postId.toString())) {
        return true;
    }
    return false;
});

app.use(express.static(path.join(__dirname, "src")));
app.use(express.static(path.join(__dirname, "public")));

const router = require('./controller/router.js');
const userRoutes = require("./controller/userRouter.js");

if (typeof router === "function") {
    app.use(router);
} else {
    console.error("❌ ERROR: router.js is not a valid middleware function!");
}

if (typeof userRoutes === "function") {
    app.use(userRoutes);
} else {
    console.error("❌ ERROR: userRouter.js is not a valid middleware function!");
}

app.get("/", (req, res) => {
    res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard", { posts: Object.values(posts), isLoggedIn: true });
});

const User = require("./model/UserSchema.js");

app.use(async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId); 
            req.session.user = user;
        } catch (error) {
            console.error("❌ Error loading user profile:", error);
        }
    }
    next();
});

// Settings Route
app.get("/settings", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");

        console.log("Session User Data:", req.session.user);

        const user = await User.findById(req.session.user._id);
        if (!user) {
            console.log("❌ User Not Found in Database");
            return res.redirect("/dashboard");
        }

        console.log("✅ User Found:", user);
        res.render("settings", { user, isLoggedIn: true });
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.redirect("/dashboard");
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        if (!req.session.user) {
            console.log("❌ Unauthorized DELETE request.");
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userId = req.params.id;
        console.log("🛑 Deleting user:", userId);

        const result = await deleteUser(userId);

        if (!result.success) {
            console.log("❌ Delete failed:", result.message);
            return res.status(404).json({ message: result.message });
        }

        console.log("✅ User deleted:", userId);
        req.session.destroy();
        res.status(200).json({ message: "User deleted successfully", redirect: "/register" });
    } catch (error) {
        console.error("❌ Error handling DELETE request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const Comment = require("./model/commentSchema.js");
const Post = require("./model/postSchema.js");

// API Route to Add a Comment to a Post
app.post("/add-comment", async (req, res) => {
    try {
        const { postId, username, content } = req.body;

        if (!postId || !username || !content) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Create a new comment
        const newComment = new Comment({ username: String(username), content });
        const savedComment = await newComment.save();

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: savedComment._id } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        res.json({ success: true, comment: savedComment });
    } catch (error) {
        console.error("❌ Error adding comment:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

async function fixCommentsField() {
    try {
        const result = await Post.updateMany(
            { comments: { $type: "string" } }, 
            { $set: { comments: [] } } 
        );
        console.log("✅ Fixed comments field for posts:", result);
    } catch (error) {
        console.error("❌ Error fixing comments field:", error);
    }
}

// Run the fix once when the server starts
fixCommentsField();

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});