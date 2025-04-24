# ByaHero! - Filipino Commuter's Guide Web Application

ByaHero! is a forum-like platform designed to connect Filipino commuters and build a supportive community where users can help each other navigate daily commuting challenges. Inspired by Reddit and Twitter/X, the platform empowers users to share experiences, post updates, and provide guidance through a tagging system that organizes content by routes, transportation types, and locations.

----------------------------------------------------------------------

## Table of Contents
1. [Motivation](#🔑-motivation)
2. [Solution](#solution)
3. [What I Learned](#what-i-learned)
4. [Features](#features)
5. [Technologies Used](#technologies-used)
6. [Credits](#credits)
7. [Getting Started](#getting-started)

----------------------------------------------------------------------

## 🔑 Motivation

Commuting in the Philippines is often challenging and frustrating, especially for those unfamiliar with specific routes or transportation options. Many commuters struggle with:

- Not knowing where to board public transportation
- Confusion about which vehicles to take for specific destinations
- Difficulty navigating unfamiliar areas
- Limited access to accurate, up-to-date route information
- Unreliable or hard-to-understand route maps and apps

While general social media platforms provide some advice, they lack a dedicated space where commuters can comfortably ask questions and share experiences focused on transportation needs.

ByaHero! was created to fill the gap between general social media and specialized transportation apps by providing a dedicated community platform where accurate, real-time transportation advice can be shared in a user-friendly format. We aim to build a supportive community that helps alleviate the daily stress and confusion of commuting in the Philippines.

----------------------------------------------------------------------

## 🩹 Solution

ByaHero! addresses these challenges by providing:

- A dedicated platform for route guidance and commuting experiences
- Real-time updates on traffic conditions and transportation availability
- A tagging system for easy categorization and discovery of relevant content
- Community-driven knowledge sharing in a supportive environment
- A voting system to highlight the most helpful information

----------------------------------------------------------------------

## 💡 What I Learned

Developing ByaHero! taught me, as a Computer Science student:

- Building community-focused web applications with MongoDB, Express, and Node.js
- Implementing complex user interaction systems (comments, replies, voting)
- Creating effective content moderation tools
- Designing intuitive user interfaces for diverse user groups
- Managing authentication and user permissions at scale
  
----------------------------------------------------------------------

## 🚀 Features

The web application is built using JavaScript, with a Node.js and Express backend, Handlebars for templating, and MongoDB as the primary data store. Most features below are powered by dynamic client-server interactions that enable full CRUD (Create, Read, Update, Delete) functionality. From viewing and managing posts to real-time interactions like commenting and voting, the application ensures a smooth and responsive user experience through well-integrated frontend and backend components.

💻 **View All Posts**
- For Visitors:
  - View 15–20 of the most recent posts with titles and preview snippets.
  - Infinite scroll/autoload to browse additional posts.
  - Clickable titles for detailed view (includes comments).
  - Comment and Reply functionalities are disabled.

- For Registered Users:
  - Access full post content and engage with discussions.
  - Ability to vote or comment after logging in.

✍️ **Register**
- Required for posting or commenting.
- Simple form with email, username, display name, and password fields.

🔐 **Login / 🚪 Logout**
- Authenticates registered users.
- “Remember Me” feature keeps users logged in for 3 weeks per visit. (uses cookies)
- Ends session and clears stored user data.
- Terminates any active "remember me" sessions.

👤 **Profile Features**
1. Create Profile
   - Register and Login Features apply

2. View User Profile
   - Public profile pages show the user's username, profile picture, header picture, bio, and recent posts and comments.

3. Edit/Update Profile
   - Users can upload/update their profile pictures and header pictures.
   - Edit their display names and bio.

4. Delete Profile
   - Users can delete their profiles through the settings page.
   - Deletion of profiles will permanently delete the user's information from the database.

📩 **Post Features**
1. Create Post
   - Users can create a post with a click of a button
   - Includes:
     - Title (required)
     - Body/Content (required)
     - Post Tag (required)
     - Image (optional)
 
2. View Post (Individual)
   - Access full post details, including:
     - Text content
     - Photos
     - Comment section
   - Engage through replies and upvotes/downvotes.

3. Edit/Update Post
   - Users can:
     - Edit the title and content of their own posts.
     - Edited posts are marked with "Edited" status.
   - A user can edit their own post through their profile or through the individual post view in the dashboard.

4. Delete Post
   - A user can delete their own post through their profile or through the individual post view in the dashboard.
   - Deletion of posts will permanently delete the post's information from the database.






