require('dotenv').config();

const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URI;
let client;

async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        console.log("✅ Connected to MongoDB");
    }
    return client.db("test");
}

async function deleteUser(userId) {
    try {
        if (!ObjectId.isValid(userId)) {
            console.error("❌ Invalid User ID format:", userId);
            return { success: false, message: "Invalid User ID format" };
        }

        const db = await connectDB();
        const usersCollection = db.collection("users");

        const objectId = new ObjectId(userId);

        // Check if the user exists
        const userExists = await usersCollection.findOne({ _id: objectId });

        if (!userExists) {
            console.error("❌ User not found.");
            return { success: false, message: "User not found in database" };
        }

        console.log("🔍 Found user, proceeding with deletion:", userExists);

        // Delete the user
        const deleteResult = await usersCollection.deleteOne({ _id: objectId });

        if (deleteResult.deletedCount === 0) {
            console.error("❌ User deletion failed:", userId);
            return { success: false, message: "User could not be deleted" };
        }

        console.log("✅ User deleted successfully:", userId);
        return { success: true, message: "User deleted successfully" };

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        return { success: false, message: "Server error" };
    }
}

module.exports = { deleteUser };