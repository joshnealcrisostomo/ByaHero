require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function updateUser(username, displayName, bio, profilePic, headerPic) {
    console.log("updateUser called with:", username, displayName, bio, !!profilePic, !!headerPic);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('test');
        const usersCollection = db.collection('users');

        const updateFields = { displayName, bio };

        // Store images in Base64
        if (profilePic) {
            updateFields.profilePic = profilePic;
        }
        if (headerPic) {
            updateFields.headerPic = headerPic;
        }

        const result = await usersCollection.updateOne(
            { username: username },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return { success: false, message: 'User not found' };
        }

        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Error updating user' };
    } finally {
        await client.close();
    }
}

module.exports = { updateUser };

