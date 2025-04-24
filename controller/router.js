require('dotenv').config();

const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const multer = require('multer');
const path = require('path'); 
const bcrypt = require("bcryptjs");

const { getAllReports, getReportById } = require('../model/crudReport.js');
const authController = require('../model/registerUser.js');
const { loginUser } = require('../model/loginUser.js');
const { createPost, deletePost, updatePost } = require('../model/crudPost.js');
const { updateUser } = require('../model/updateUser.js');
const Post = require('../model/postSchema.js');
const { createReport } = require('../model/crudReport.js');
const User = require('../model/UserSchema.js');
const { addComment, getComments, updateComment, deleteComment } = require('../model/crudComments.js');
const Comment = require( '../model/commentSchema.js');
const adminRouter = require('../controller/adminRouter.js');
const Report = require('../model/reportSchema.js')
const { addReply, getReplies, deleteReply, updateReply} = require("../model/crudReply.js");

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

let client;

// Connect to MongoDB
async function connect() {
    client = new MongoClient(uri);
    await client.connect();
    return client.db('test');
}

// Close MongoDB connection on app exit
async function close() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

process.on('SIGINT', async () => {
    await close();
    process.exit();
});

// Configure storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/postImages/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Configure multer for file upload
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Allow only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});


// Sign up route
router.get('/about', (req, res) => {
    res.render('about', {
        layout: 'about',
        title: 'About Page',
        isLoggedIn: !!req.session.user
    });
});

// Dashboard router
router.get('/dashboard', async (req, res) => {
    try {
        console.log('Session on dashboard:', req.session);

        let query = {};
        
        // Check if tags filter is provided in query parameters
        if (req.query.tags) {
            const selectedTags = req.query.tags.split(',');
            
            // Filter posts that have any of the selected tags
            query.tags = { $in: selectedTags };
        }
        
        let posts = await Post.find(query)
                              .populate('author')
                              .sort({ createdAt: -1 })
                              .exec();
        
        console.log(req.session.isLoggedIn);
        console.log(req.session.loggedInUser);
        
        res.render('dashboard', {
            posts,
            layout: 'dashboard',
            title: 'ByaHero!',
            isLoggedIn: req.session.isLoggedIn,
            loggedInUser: req.session.loggedInUser || '',
            selectedTags: req.query.tags ? req.query.tags.split(',') : []
        });
    } catch (error) {
        console.error('Error fetching posts for dashboard:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/profile/:username', async (req, res) => {
    //lerouter.get('/t { username } = req.params;
    let { username } = req.params;
    if (!username.startsWith('@')) username = '@' + username;

    try {
        const db = await connect();
        const usersCollection = db.collection('users');
        const viewedUser = await usersCollection.findOne({ username });

        if (!viewedUser) return res.status(404).send('User not found');

        const userPosts = await Post.find({ author: viewedUser._id })
            .populate('author')
            .sort({ createdAt: -1 })
            .exec();

        const userComments = await Comment.find({ username: viewedUser.username })
            .populate({
                path: 'postId',
                model: 'Post',
                select: 'postTitle _id'
            })
            .sort({ createdAt: -1 })
            .exec();

        const formattedComments = userComments.map(comment => ({
            commentId: comment._id.toString(),
            postId: comment.postId
        }));

        const loggedInUser = req.session.user ? req.session.user.username : '';
        const isOwnProfile = req.session.user && req.session.user.username === viewedUser.username;

        // Improved profile picture handling
        let profilePic, headerPic;
        
        // Profile Picture
        if (viewedUser.profilePic) {
            // Check if it's already a full base64 data URL
            if (viewedUser.profilePic.startsWith('data:image/')) {
                profilePic = viewedUser.profilePic;
            } else {
                // If it's just a base64 string, convert to data URL
                profilePic = `data:image/png;base64,${viewedUser.profilePic}`;
            }
        } else {
            // Fallback to default image
            profilePic = 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png';
        }

        // Header Picture (similar logic)
        if (viewedUser.headerPic) {
            if (viewedUser.headerPic.startsWith('data:image/')) {
                headerPic = viewedUser.headerPic;
            } else {
                headerPic = `data:image/png;base64,${viewedUser.headerPic}`;
            }
        } else {
            headerPic = '/public/headerPictures/default.jpg';
        }

        if (isOwnProfile) {
            res.render('profile.hbs', {
                displayName: viewedUser.displayName,
                username: viewedUser.username,
                profilePic,
                headerPic,
                bio: viewedUser.bio,
                posts: userPosts,
                comments: formattedComments,
                layout: 'profile',
                title: `${viewedUser.displayName}'s Profile`,
                isLoggedIn: !!req.session.user,
                loggedInUser,
                viewedUser
            });
        } else {
            res.render('publicProfile.hbs', {
                displayName: viewedUser.displayName,
                username: viewedUser.username,
                profilePic,
                headerPic, 
                bio: viewedUser.bio,
                posts: userPosts,
                comments: formattedComments,
                layout: 'publicProfile',
                title: `${viewedUser.displayName}'s Profile`,
                isLoggedIn: !!req.session.user,
                loggedInUser,
                viewedUser
            });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal server error');
    }
});


// Profile menu navigation
router.get('/profile/:username/content/:tab', async (req, res) => {
    let { username, tab } = req.params;

    if (!username.startsWith('@')) {
        username = '@' + username;
    }

    try {
        const db = await connect();
        const usersCollection = db.collection('users');
        const viewedUser = await usersCollection.findOne({ username });

        if (!viewedUser) {
            return res.status(404).send('User not found');
        }

        const isOwnProfile = req.session.user && req.session.user.username === viewedUser.username;

        if(isOwnProfile) {
            switch (tab) {
                case 'comments':
                    const userComments = await Comment.find({ username: viewedUser.username })
                                                .sort({ createdAt: -1 })
                                                .exec();
                    res.render('../partials/profileComments', { comments: userComments, viewedUser });
                    break;
                case 'upvoted':
                    const upvotes = await Post.find({ _id: { $in: viewedUser.upvotedPosts || [] } })
                                                 .populate('author')
                                                 .exec();
                    res.render('../partials/profileUpvoted', { upvoted: upvotes });
                    break;
                default:
                    const userPosts = await Post.find({ author: viewedUser._id })
                                              .populate('author')
                                              .sort({ createdAt: -1 })
                                              .exec();
                    res.render('../partials/profilePosts', { posts: userPosts, Post });
            }
        } else {
            switch (tab) {
                case 'comments':
                    const userComments = await Comment.find({ username: viewedUser.username })
                                                .sort({ createdAt: -1 })
                                                .exec();
                    res.render('../partials/pubProfileComments', { comments: userComments, viewedUser });
                    break;
                case 'upvoted':
                    const upvotes = await Post.find({ _id: { $in: viewedUser.upvotedPosts || [] } })
                                                 .populate('author')
                                                 .exec();
                    res.render('../partials/pubProfileUpvoted', { upvoted: upvotes });
                    break;
                default:
                    const userPosts = await Post.find({ author: viewedUser._id })
                                              .populate('author')
                                              .sort({ createdAt: -1 })
                                              .exec();
                    res.render('../partials/pubProfilePosts', { posts: userPosts, Post });
            }
        }


    } catch (error) {
        console.error('Error fetching user profile content:', error);
        res.status(500).send('Internal server error');
    }
});



// Explore route
router.get('/explore', async (req, res) => {
    try {
        let posts = await Post.find()
            .populate('author')
            .sort({ votes: -1 })
            .exec();

        let limitedPosts = posts.slice(0, 5);    

        res.render('explore', {
            posts: limitedPosts,
            layout: 'explore',
            title: 'Explore',
            isLoggedIn: req.session.isLoggedIn || false,
            loggedInUser: req.session.loggedInUser || '',
        });
    } catch (error) {
        console.error('Error fetching posts for explore:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Search for explore
router.get('/search', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const searchEntirePost = req.query.searchEntirePost === 'true';
        const searchTitleOnly = req.query.searchTitleOnly === 'true';
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder === 'ascending' ? 1 : -1;
        const tag = req.query.tag !== 'Any' ? req.query.tag : null;
        
        let query = {};
        
        if (keyword) {
            const regex = new RegExp(keyword, 'i');
            if (searchEntirePost) {
                query = { $or: [{ postTitle: regex }, { postContent: regex }] };
            } else if (searchTitleOnly) {
                query = { postTitle: regex };
            } else {
                query = { postTitle: regex };
            }
        }
        
        if (tag) {
            query.tags = tag;
        }
        
        let sortOptions = {};
        if (sortBy === 'Last Post Date') {
            sortOptions = { createdAt: sortOrder };
        } else if (sortBy === 'Upvotes') {
            sortOptions = { votes: sortOrder };
        } else if (sortBy === 'Reply Count') {
            sortOptions = { replyCount: sortOrder };
        }
        
        const searchResults = await Post.find(query).sort(sortOptions).populate('author');
        
        res.render('explore', {
            posts: searchResults,
            isSearchResults: true,
            searchQuery: keyword,
            title: 'Search Results',
            isLoggedIn: req.session.isLoggedIn || false,
            loggedInUser: req.session.loggedInUser || '',
        });
    } catch (error) {
        console.error('Error in search route:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Settings route
router.get('/settings', (req, res) => {
    res.render('settings', {
        layout: 'settings',
        title: 'Settings',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Sign up route
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'register',
        title: 'Sign Up',
        isLoggedIn: false,
    });
});

// Register post route
router.post('/registerPost', async (req, res) => {
    const { email, displayName, username, password, bio, profilePic } = req.body;

    try {
        const result = await authController.registerUser(email, displayName, username, password, bio, profilePic);
        console.log("registerUser result: ", result);

        if (result.success) {
            res.status(200).json({ success: true, message: 'Registration successful!', redirect: '/login' });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Error in register route: ", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Login route
router.get('/login', (req, res) => {
    if (req.session.isLoggedIn) return res.redirect('/dashboard');

    res.render('login', {
        layout: 'login',
        title: 'Sign In',
        isLoggedIn: false
    });
});

// Login POST route
router.post('/loginPost', async (req, res) => {
    const { username, password, rememberMe } = req.body; 

    try {
        if (username === '@admin') {
            console.log(password);
            User.findOne({ username: '@admin' }).then(console.log);

            const user = await User.findOne({ username: '@admin' });
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                req.session.isLoggedIn = true;
                req.session.loggedInUser = username;
                req.session.user = { username: 'admin' };
                req.session.userId = user._id;

                if (rememberMe) {
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21; // 3 weeks
                } else {
                    req.session.cookie.expires = false; 
                }

                return res.json({ success: true, redirect: '/admin' });
            }
        }

        const result = await loginUser(username, password);
        
        if (result.success) {
            req.session.isLoggedIn = true;
            req.session.loggedInUser = username;
            req.session.user = result.user;
            req.session.userId = result.user._id;

            if (rememberMe) {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21; // 3 weeks
            } else {
                req.session.cookie.expires = false; 
            }

            console.log(req.session.user);
            console.log(req.session.isLoggedIn);
            console.log(req.session.loggedInUser);

            res.json({ success: true, redirect: '/dashboard' });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('Error logging out:', err);
        res.redirect('/dashboard');
    });
});

// Welcome page
router.get('/welcome', (req, res) => {
    res.render('welcome', {
        layout: 'welcome',
        title: 'Welcome to ByaHero!',
        isLoggedIn: false,
    });
});

// Individual post route
router.get('/post/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)
        .populate('author')
        .populate({
            path: 'comments',
            populate: { path: 'replies' } // Populate nested replies
        });

        if (!post) {
            return res.status(404).send('Post not found');
        }

        let upvotedPosts = [];
        if (req.session.user) {
            const user = await User.findById(req.session.user._id);
            if (user && user.upvotedPosts) {
                upvotedPosts = user.upvotedPosts;
            }
        }

        const isAuthor = req.session.user && post.author._id.toString() === req.session.user._id;

        res.render('post', {
            post: post.toObject(),
            author: post.author.toObject(),
            isAuthor: isAuthor,
            isLoggedIn: !!req.session.user,
            loggedInUser: req.session.loggedInUser,
            upvotedPosts: upvotedPosts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create post page
router.get('/createPost', (req, res) => {
    res.render('createPost', {
        layout: 'createPost',
        title: 'Create a Post!',
        isLoggedIn: req.session.isLoggedIn,
        loggedInUser: req.session.loggedInUser,
        user: req.session.user || {}
    });
});

router.post('/createPost', async (req, res) => {
    try {
        if (!req.session.isLoggedIn) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const { postTitle, postContent, tags, postImage } = req.body;
        const userId = req.session.user._id;

        const result = await createPost(
            postTitle, 
            postContent, 
            postImage, 
            tags, 
            userId
        );

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error in /createPost:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// Delete post router
router.delete('/deletePost', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { postId } = req.body;
    
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.author.toString() !== req.session.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only delete your own posts" });
        }

        const result = await deletePost(postId);

        if (result.success) {
            res.json({ success: true, message: "Post deleted successfully" });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Error in delete post route:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// CREATE COMMENT
router.post("/comments", async (req, res) => {
    let { postId, username, content } = req.body;
    if (!postId || !username || !content) {
        console.log("❌ Missing required fields!", { postId, username, content });
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const newComment = await addComment(postId, username, content);
        if (newComment.error) {
            console.log("❌ Comment creation failed!");
            return res.status(500).json({ success: false, message: newComment.error });
        }

        res.json({ success: true, comment: newComment, postId });
    } catch (error) {
        console.error("❌ Error saving comment:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// READ comments for a post
router.get('/comments/:postId', async (req, res) => { 
    const { postId } = req.params;

    const response = await getComments(postId);

    res.json(response);
});

// READ replies for a comment
router.get('/replies/:commentId', async (req, res) => { 
    try {
        const { commentId } = req.params;

        // Fetch all replies linked to this comment
        const replies = await Reply.find({ commentId });

        if (!replies.length) {
            return res.status(404).json({ success: false, message: "No replies found for this comment" });
        }

        res.json({ success: true, replies });
    } catch (error) {
        console.error("❌ Error fetching replies:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// Update comment
router.post('/updateComment/:id', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const commentId = req.params.id;
        const { commentText, postId } = req.body;

        const commentFromDb = await Comment.findById(commentId);
        if (!commentFromDb) {
            return res.status(404).send('❌ Comment not found');
        }

        if (commentFromDb.username !== req.session.user.username) {
            return res.status(403).send('❌ You are not authorized to edit this comment');
        }

        const result = await updateComment(commentId, commentText);

        if (result.success) {
            if (!postId) {
                console.log("⚠️ postId missing from request. Fetching from database...");
                postId = commentFromDb.postId;
            }

            if (!postId) {
                console.log("Still no Post ID. Redirecting to dashboard.");
                return res.redirect('/dashboard');
            }

            console.log("✅ Redirecting to post:", `/post/${postId}`);
            res.redirect(`/post/${postId}`);
        } else {
            console.error("❌ Error updating comment:", result.message);
            return res.status(500).send(`Server error: ${result.message}`);
        }
    } catch (error) {
        console.error('❌ Error in updateComment route:', error);
        res.status(500).send('Server error');
    }
});

// Delete comment
router.delete('/comments/:commentId', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comment.username !== req.session.user.username) {
            return res.status(403).json({ success: false, message: "You can only delete your own comments" });
        }

        await Comment.findByIdAndDelete(commentId);
        console.log("✅ Comment deleted successfully:", commentId);

        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting comment:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Notifications page
router.get('/notifications', (req, res) => {
    res.render('notifications', {
        layout: 'notifications',
        title: 'Notifications',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// GET route to load the edit comment page
router.get('/editComment/:id', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const commentId = req.params.id;
        const comment = await Comment.findById(commentId).exec();
        
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        if (comment.username !== req.session.user.username) {
            return res.status(403).send('You are not authorized to edit this comment');
        }

        res.render("editComment", { 
            comment,
            title: 'Edit Comment',
            isLoggedIn: !!req.session.user,
            loggedInUser: req.session.user ? req.session.user.username : ''
        });        
        
    } catch (error) {
        console.error('❌ Error loading edit comment page:', error);
        res.status(500).send('Server error');
    }
});

router.get("/profile/comments", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const comments = await Comment.find({ username: req.session.user.username })
            .populate({
                path: "postId",
                select: "_id postTitle"
            })
            .exec();

        res.render("profileComments", {
            comments,
            isLoggedIn: true
        });
    } catch (error) {
        console.error("❌ Error fetching profile comments:", error);
        res.status(500).send("Server error");
    }
});

// Update GET route
router.get('/editPost/:id', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        const postId = req.params.id;
        
        const post = await Post.findById(postId).populate('author').exec();
        
        if (!post) {
            return res.status(404).send('Post not found');
        }
        
        if (post.author._id.toString() !== req.session.user._id.toString()) {
            return res.status(403).send('You are not authorized to edit this post');
        }
        
        res.render('editPost', {
            post,
            layout: 'editPost',
            title: 'Edit Post',
            isLoggedIn: !!req.session.user,
            loggedInUser: req.session.user ? req.session.user.username : ''
        });
    } catch (error) {
        console.error('Error loading edit post page:', error);
        res.status(500).send('Server error');
    }
});

// Update POST route
router.post('/updatePost/:id', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const postId = req.params.id;
        const { postTitle, postContent, tags } = req.body;
        const userId = req.session.user._id;

        const result = await updatePost(postId, postTitle, postContent, tags, userId);

        if (result.success) {
            const updatedPost = await Post.findById(postId).populate('author').exec();

            if (updatedPost) {
                return res.render('post', {
                    post: updatedPost,
                    author: updatedPost.author,
                    isLoggedIn: !!req.session.user,
                    loggedInUser: req.session.user ? req.session.user.username : '',
                    isAuthor: req.session.user && req.session.user._id.toString() === updatedPost.author._id.toString()
                });
            } else {
                return res.status(404).send('Post not found after update.');
            }
        } else {
            const post = await Post.findById(postId).populate('author').exec();
            return res.render('editPost', {
                post,
                layout: 'editPost',
                title: 'Edit Post',
                isLoggedIn: !!req.session.user,
                loggedInUser: req.session.user ? req.session.user.username : '',
                error: result.message
            });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Server error');
    }
});

// Edit profile page
router.get('/editProfile', async (req, res) => {
    try {
        const db = await connect();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username: req.session.loggedInUser });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('editProfile', {
            profilePic: user.profilePic,
            displayName: user.displayName,
            headerPic: user.headerPic,
            bio: user.bio,
            layout: 'editProfile',
            title: 'Edit your profile',
            isLoggedIn: req.session.isLoggedIn || false,
            loggedInUser: req.session.loggedInUser || ''
        });
    } catch (error) {
        console.error('Error fetching user for edit profile:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to update profile
router.post('/updateProfile', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'headerPic', maxCount: 1 }
]), async (req, res) => {
    try {
        const { username, displayName, bio } = req.body;
        const updateFields = { displayName, bio };

        // Process profile picture
        if (req.files && req.files['profilePic']) {
            const profilePicFile = req.files['profilePic'][0];
            updateFields.profilePic = `data:${profilePicFile.mimetype};base64,${profilePicFile.buffer.toString('base64')}`;
        }

        // Process header picture
        if (req.files && req.files['headerPic']) {
            const headerPicFile = req.files['headerPic'][0];
            updateFields.headerPic = `data:${headerPicFile.mimetype};base64,${headerPicFile.buffer.toString('base64')}`;
        }

        // Update user in database
        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.redirect(`/profile/${username}`);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Admin page
router.get('/admin', async (req, res) => {
    try {
        const postReportsResult = await getAllReports({ reportedItemType: 'Post' });
        const allReports = await Report.find();

        const totalReports = allReports.length;
        const pendingReports = allReports.filter(report => report.status === 'Pending').length;
        const inProgressReports = allReports.filter(report => report.status === 'In-Progress').length;
        const resolvedReports = allReports.filter(report => report.status === 'Resolved').length;

        const hateReports = allReports.filter(report => report.reason === 'Hate').length;
        const bugReports = allReports.filter(report => report.reason === 'Bug').length;
        const spamReports = allReports.filter(report => report.reason === 'Spam').length;
        const inappropriateReports = allReports.filter(report => report.reason === 'Inappropriate Content').length;
        const privacyReports = allReports.filter(report => report.reason === 'Privacy').length;
        const illegalReports = allReports.filter(report => report.reason === 'Illegal').length;

        let hatePercentage = 0;
        let bugPercentage = 0;
        let spamPercentage = 0;
        let inappropriatePercentage = 0;
        let privacyPercentage = 0;
        let illegalPercentage = 0;
        let pendingReportsPercentage = 0;
        let inProgressReportsPercentage = 0;
        let resolvedReportsPercentage = 0;

        if (totalReports > 0) {
            hatePercentage = parseFloat(((hateReports / totalReports) * 100).toFixed(2));
            bugPercentage = parseFloat(((bugReports / totalReports) * 100).toFixed(2));
            spamPercentage = parseFloat(((spamReports / totalReports) * 100).toFixed(2));
            inappropriatePercentage = parseFloat(((inappropriateReports / totalReports) * 100).toFixed(2));
            privacyPercentage = parseFloat(((privacyReports / totalReports) * 100).toFixed(2));
            illegalPercentage = parseFloat(((illegalReports / totalReports) * 100).toFixed(2));
            pendingReportsPercentage = parseFloat(((pendingReports / totalReports) * 100).toFixed(2));
            inProgressReportsPercentage = parseFloat(((inProgressReports / totalReports) * 100).toFixed(2));
            resolvedReportsPercentage = parseFloat(((resolvedReports / totalReports) * 100).toFixed(2));
        }

        res.render('admin', {
            user: req.session.user,
            reports: postReportsResult.success ? postReportsResult.reports : [],
            isAdmin: true,
            totalReports,
            pendingReports,
            inProgressReports,
            resolvedReports,
            hatePercentage,
            bugPercentage,
            spamPercentage,
            inappropriatePercentage,
            privacyPercentage,
            illegalPercentage,
            pendingReportsPercentage,
            inProgressReportsPercentage,
            resolvedReportsPercentage
        });

    } catch (error) {
        console.error('Error in admin route:', error);
        res.status(500).send('Server error');
    }
});

// Router for post reports
router.get('/admin/content/posts', async (req, res) => {
    try {
        const result = await getAllReports({ reportedItemType: 'Post' });
        
        if (!result.success) {
            return res.status(500).send('<div class="error-message">Error fetching reports</div>');
        }
        
        res.render('partials/adminPosts', {
            layout: false,
            reports: result.reports
        });
    } catch (error) {
        console.error('Error in posts content route:', error);
        res.status(500).send('<div class="error-message">Internal server error</div>');
    }
});

// Router for comment reports
router.get('/admin/content/comments', async (req, res) => {
    try {
        const result = await getAllReports({ reportedItemType: 'Comment' });
        
        if (!result.success) {
            return res.status(500).send('<div class="error-message">Error fetching reports</div>');
        }
        
        res.render('partials/adminComments', {
            layout: false,
            reports: result.reports
        });
    } catch (error) {
        console.error('Error in comments content route:', error);
        res.status(500).send('<div class="error-message">Internal server error</div>');
    }
});

// Router for user reports
router.get('/admin/content/users', async (req, res) => {
    try {
        res.send('<h3>User Reports</h3><div class="no-reports">User reports feature coming soon</div>');
    } catch (error) {
        console.error('Error in users content route:', error);
        res.status(500).send('<div class="error-message">Internal server error</div>');
    }
});

// Admin Notifications page
router.get('/adminNotifications', (req, res) => {
    res.render('adminNotifications', {
        layout: 'adminNotifications',
        title: 'Admin Notifications',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Admin Settings page
router.get('/adminSettings', (req, res) => {
    res.render('adminSettings', {
        layout: 'adminSettings',
        title: 'Admin Settings',
        isLoggedIn: req.session.isLoggedIn || false,
        loggedInUser: req.session.loggedInUser || ''
    });
});

// Admin single post view
router.get('/adminViewPost/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId).populate('author').exec();

        res.render('adminViewPost', {
            post,
            postId: post._id,
            layout: 'adminViewPost',
            title: `${post.displayName}'s Post`,
            isLoggedIn: req.session.isLoggedIn || false,
            authorProfile: post.author
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal server error');
    }
});

// Admin profile route
router.get('/adminProfile/:username', async (req, res) => {
    let { username } = req.params;
    if (!username.startsWith('@')) username = '@' + username;
    try {
        const viewedUser = await User.findOne({ username });
        if (!viewedUser) return res.status(404).send('User not found');
        
        const userPosts = await Post.find({ author: viewedUser._id }).exec();

        res.render('adminProfile', {
            displayName: viewedUser.displayName,
            username: viewedUser.username,
            profilePic: viewedUser.profilePic,
            bio: viewedUser.bio,
            posts: userPosts,
            layout: 'adminProfile',
            title: `${viewedUser.displayName}'s Profile`,
            isLoggedIn: req.session.isLoggedIn || false,
            loggedInUser: req.session.loggedInUser || '',
            viewedUser
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal server error');
    }
});

// Admin menu nav
router.get('/admin/content/:tab', async (req, res) => {
    const { tab } = req.params;
    
    try {
        let filters = {};
        
        switch (tab) {
            case 'commentsReport':
                filters.reportedItemType = 'Comment';
                break;
            case 'usersReport':
                filters.reportedItemType = 'User';
                break;
            default:
                filters.reportedItemType = 'Post';
        }
        
        const result = await getAllReports(filters);
        
        if (!result.success) {
            console.error(`Error fetching ${tab} reports:`, result.message);
            return res.status(500).send(`Error fetching ${tab} reports`);
        }
        
        switch (tab) {
            case 'commentsReport':
                res.render('../partials/adminComments', { reports: result.reports });
                break;
            case 'usersReport':
                res.render('../partials/adminUsers', { reports: result.reports });
                break;
            default:
                res.render('../partials/adminPosts', { reports: result.reports });
        }
    } catch (error) {
        console.error(`Error in admin/${tab} route:`, error);
        res.status(500).send('Internal server error');
    }
});

// Report page router (GET)
router.get('/report/:id', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const id = req.params.id;
        let reportedItem = null;
        let reportedItemType = 'Post';

        if (id.startsWith('@')) {
            // Reporting a User
            const username = id.substring(1);
            const user = await User.findOne({ username: username });

            if (!user) {
                return res.status(404).send('User not found');
            }

            reportedItem = user;
            reportedItemType = 'User';
        } else {
            const post = await Post.findById(id).populate('author').exec();

            if (post) {
                reportedItem = post;
                reportedItemType = 'Post';
            } else {
                const comment = await Comment.findById(id).exec();

                if (comment) {
                    reportedItem = comment;
                    reportedItemType = 'Comment';
                    const user = await User.findOne({ username: comment.username });
                    if (user) {
                        reportedItem.author = user;
                    }

                } else {
                    return res.status(404).send('Item not found');
                }
            }
        }

        res.render('report', {
            reportedItem: reportedItem,
            layout: 'report',
            title: 'Report Page',
            isLoggedIn: !!req.session.user,
            loggedInUser: req.session.user ? req.session.user.username : '',
            reportedItemType: reportedItemType,
            reportedItemId: id,
        });
    } catch (error) {
        console.error('Error loading report page:', error);
        res.status(500).send('Server error');
    }
});

// Report submission router (POST)
router.post('/report/:id', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const id = req.params.id;
        const reason = req.body.reportType;
        const reporterId = req.session.user._id;
        let reportedItemId;
        let reportedItemType;
        let authorId;

        if (!reason) {
            return res.status(400).send('Reason is required.');
        }

        if (id.startsWith('@')) {
            // Reporting a User
            const username = id.substring(1);
            const user = await User.findOne({ username: username });

            if (!user) {
                return res.status(404).send('User not found');
            }

            reportedItemId = user._id;
            reportedItemType = 'User';
            authorId = user._id;
        } else {
            const post = await Post.findById(id).populate('author').exec();

            if (post) {
                reportedItemId = id;
                reportedItemType = 'Post';
                authorId = post.author._id;
            } else {
                const comment = await Comment.findById(id).exec();

                if (comment) {
                    reportedItemId = id;
                    reportedItemType = 'Comment';
                    const user = await User.findOne({ username: comment.username });
                    if (user) {
                        authorId = user._id;
                    } else {
                        return res.status(404).send('Author user not found.');
                    }
                } else {
                    return res.status(404).send('Item not found');
                }
            }
        }

        const reportResult = await createReport(reportedItemId, reportedItemType, authorId, reason, req.body.details);

        if (reportResult.success) {
            res.send('Report submitted successfully!');
        } else {
            res.status(500).send(reportResult.message);
        }

    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).send('Server error');
    }
});

// Upvote post
router.post('/upvotePost/:postId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { postId } = req.params;
    const userId = req.session.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.upvotedPosts) {
            user.upvotedPosts = [];
        }

        const upvotedIndex = user.upvotedPosts.indexOf(postId);

        if (upvotedIndex === -1) {
            user.upvotedPosts.push(postId);
            post.votes += 1;
        } else {
            user.upvotedPosts.splice(upvotedIndex, 1);
            post.votes -= 1;
        }

        await post.save();
        await user.save();

        res.json({ success: true, votes: post.votes });
    } catch (error) {
        console.error('Error upvoting post:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Downvote post route
router.post('/downvotePost/:postId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { postId } = req.params;
    const userId = req.session.user._id;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const upvotedIndex = user.upvotedPosts.indexOf(postId);

        if (upvotedIndex !== -1) {
            user.upvotedPosts.splice(upvotedIndex, 1);
            if (post.votes > 0) {
                post.votes -= 1;
            }
        } else {
            if (post.votes > 0) {
                post.votes -= 1;
            }
        }

        await post.save();
        await user.save();
        res.json({ success: true, votes: post.votes });
    } catch (error) {
        console.error('Error downvoting post:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Upvote comment
router.post('/upvoteComment/:commentId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const { commentId } = req.params;
    const userId = req.session.user._id;
    
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        if (!user.upvotedComments) {
            user.upvotedComments = [];
        }
        
        const upvotedIndex = user.upvotedComments.indexOf(commentId);
        if (upvotedIndex === -1) {
            // User hasn't upvoted this comment before
            user.upvotedComments.push(commentId);
            comment.votes += 1;
        } else {
            // User is removing their upvote
            user.upvotedComments.splice(upvotedIndex, 1);
            comment.votes -= 1;
        }
        
        await comment.save();
        await user.save();
        
        res.json({ success: true, votes: comment.votes });
    } catch (error) {
        console.error('Error upvoting comment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Downvote comment
router.post('/downvoteComment/:commentId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const { commentId } = req.params;
    const userId = req.session.user._id;
    
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const upvotedIndex = user.upvotedComments.indexOf(commentId);
        if (upvotedIndex !== -1) {
            // If the user had upvoted, remove the upvote
            user.upvotedComments.splice(upvotedIndex, 1);
            if (comment.votes > 0) {
                comment.votes -= 1;
            }
        } else {
            // Just decrease the vote if it's positive
            if (comment.votes > 0) {
                comment.votes -= 1;
            }
        }
        
        await comment.save();
        await user.save();
        
        res.json({ success: true, votes: comment.votes });
    } catch (error) {
        console.error('Error downvoting comment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//reply API
router.post("/add-reply", async (req, res) => {
    try {
        const { commentId, username, content } = req.body;

        console.log("🟢 Received data:", { commentId, username, content })

        if (!commentId || !username || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const savedReply = await addReply(commentId, username, content);
        res.json(savedReply);
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/get-replies/:commentId", async (req, res) => {
    try {
        const { commentId } = req.params;
        console.log(`🟢 Fetching replies for commentId: ${commentId}`);

        const comment = await Comment.findById(commentId)
            .populate({
                path: "replies",
                model: "Reply",
                options: { sort: { createdAt: -1 } }
            })
            .exec();

        if (!comment) {
            console.log("🛑 Comment not found!");
            return res.status(404).json({ error: "Comment not found" });
        }

        console.log("🟢 Replies fetched successfully:", comment.replies);
        res.json({ replies: comment.replies });  // Ensure response has a 'replies' key
    } catch (error) {
        console.error("🚨 Error fetching replies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.use('/', adminRouter);

module.exports = router;
