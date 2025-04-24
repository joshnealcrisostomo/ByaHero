const express = require("express");
const router = express.Router();
const { deleteUser } = require("../model/deleteUser.js");
const { updateUser } = require('../model/updateUser.js');
const { MongoClient } = require("mongodb");
const multer = require('multer');

const uri = process.env.MONGODB_URI;

// Multer setup: Store files in memory 
const storage = multer.memoryStorage();
const upload = multer({ storage });

// DELETE: Delete User Account
router.delete("/deleteAccount", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const userId = req.session.user._id;
    console.log("🛑 DELETE request for user:", userId);

    try {
        const result = await deleteUser(userId);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error("❌ Error destroying session:", err);
                return res.status(500).json({ message: "Error logging out after account deletion." });
            }
            console.log("✅ User deleted successfully, session ended.");
            res.json({ success: true, message: "Account deleted." });
        });

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//  POST: Update Profile (Profile & Header Picture Upload)
router.post('/updateProfile', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'headerPic', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log("Files received:", req.files);

        const { username, displayName, bio } = req.body;

        let profilePic = null;
        let headerPic = null;

        // Convert profile picture to Base64 if uploaded
        if (req.files['profilePic']) {
            profilePic = req.files['profilePic'][0].buffer.toString("base64");
        }

        // Convert header picture to Base64 if uploaded
        if (req.files['headerPic']) {
            headerPic = req.files['headerPic'][0].buffer.toString("base64");
        }

        console.log("Profile Pic Base64:", profilePic ? "Stored" : "Not provided");
        console.log("Header Pic Base64:", headerPic ? "Stored" : "Not provided");

        // Update user in MongoDB
        const result = await updateUser(username, displayName, bio, profilePic, headerPic);

        if (result.success) {
            console.log("✅ Profile successfully updated in DB");
            res.redirect('/profile/' + username);
        } else {
            console.log("❌ Profile update failed:", result.message);
            res.status(400).send(result.message);
        }
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        res.status(500).send('Server error');
    }
});

// get user data
router.get("/getUserData", async (req, res) => {
    try {
        const { username } = req.query;
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db("test");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            displayName: user.displayName,
            bio: user.bio,
            profilePic: user.profilePic || null, 
            headerPic: user.headerPic || null
        });

    } catch (error) {
        console.error("❌ Error fetching profile data:", error);
        res.status(500).send("Server error");
    } 
});

module.exports = router;
