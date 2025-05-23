# ByaHero! - Filipino Commuter's Guide Web Application

ByaHero! is a forum-like platform designed to connect Filipino commuters and build a supportive community where users can help each other navigate daily commuting challenges. Inspired by Reddit and Twitter/X, the platform empowers users to share experiences, post updates, and provide guidance through a tagging system that organizes content by routes, transportation types, and locations.

----------------------------------------------------------------------

## Table of Contents
1. [Motivation](#-motivation)
2. [Solution](#solution)
3. [What I Learned](#what-i-learned)
4. [Features](#features)
5. [Technologies Used](#technologies-used)
6. [Credits](#credits)
7. [Getting Started](#getting-started)

----------------------------------------------------------------------

## Motivation

🔑 Commuting in the Philippines is often challenging and frustrating, especially for those unfamiliar with specific routes or transportation options. Many commuters struggle with:

- Not knowing where to board public transportation
- Confusion about which vehicles to take for specific destinations
- Difficulty navigating unfamiliar areas
- Limited access to accurate, up-to-date route information
- Unreliable or hard-to-understand route maps and apps

While general social media platforms provide some advice, they lack a dedicated space where commuters can comfortably ask questions and share experiences focused on transportation needs.

ByaHero! was created to fill the gap between general social media and specialized transportation apps by providing a dedicated community platform where accurate, real-time transportation advice can be shared in a user-friendly format. We aim to build a supportive community that helps alleviate the daily stress and confusion of commuting in the Philippines.

*[Return to TOC](#table-of-contents)*

----------------------------------------------------------------------

## Solution

🩹 ByaHero! addresses these challenges by providing:

- A dedicated platform for route guidance and commuting experiences
- Real-time updates on traffic conditions and transportation availability
- A tagging system for easy categorization and discovery of relevant content
- Community-driven knowledge sharing in a supportive environment
- A voting system to highlight the most helpful information

*[Return to TOC](#table-of-contents)*

----------------------------------------------------------------------

## What I Learned

💡 Developing ByaHero! taught me, as a Computer Science student:

- Building community-focused web applications with MongoDB, Express, and Node.js
- Implementing complex user interaction systems (comments, replies, voting)
- Creating effective content moderation tools
- Designing intuitive user interfaces for diverse user groups
- Managing authentication and user permissions at scale

*[Return to TOC](#table-of-contents)*
  
----------------------------------------------------------------------

## Features

🚀 The web application is built using JavaScript, with a Node.js and Express backend, Handlebars for templating, and MongoDB as the primary data store. Most features below are powered by dynamic client-server interactions that enable full CRUD (Create, Read, Update, Delete) functionality. From viewing and managing posts to real-time interactions like commenting and voting, the application ensures a smooth and responsive user experience through well-integrated frontend and backend components.

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

↕️ Upvote/Downvote
- One-time voting per user per post/comment.
- Available on all content, including the user’s own.

🔎 Search
- Keyword-based search across titles and body content.
- Search by tag, phrase, or related terms.
- Users can do a quick search or a detailed search.
- Users can also filter their feed by post tags.

👤 **Profile Features**
1. Create a Profile
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
1. Create a Post
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

💬 **Comment/Reply Feature**
1. Create a Comment / Reply
   - Comment on any post or nested replies.
   - Unlimited nesting for threaded discussions.

2. View Comments / Replies
   - Comments and replies are loaded together with the individual post.

3. Edit Comment
   - Users can:
     - Edit the content of their own comment.
     - Edited comments are marked with "Edited" status.
   - A user can edit their own comment through their profile or through the individual post view in the dashboard.

4. Delete Comment
   - A user can delete their own comment through their profile or through the individual post view in the dashboard.
   - Deletion of comments will permanently delete the comment's information from the database.

📂 General UX
- Clean and responsive UI with consistent design.
- Easy navigation and user-friendly layout.
- Visually optimized for desktop users.

*[Return to TOC](#table-of-contents)*

----------------------------------------------------------------------

## Technologies Used

**Backend:** ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) ![Express-session](https://img.shields.io/badge/Express--session-000000?style=flat&logo=express&logoColor=white) ![Handlebars](https://img.shields.io/badge/Handlebars.js-000000?style=flat&logo=handlebarsdotjs&logoColor=orange)

**Frontend:** ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

**Database:** ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

**Authentication:** ![bcrypt](https://img.shields.io/badge/bcrypt-003B57?style=flat&logo=keybase&logoColor=white)

**File Handling:** ![multer](https://img.shields.io/badge/Multer-1B1F23?style=flat&logo=npm&logoColor=white)

*[Return to TOC](#table-of-contents)*

----------------------------------------------------------------------

## Credits

👥 Collaborators:
1. Patrick Lim
2. Isabella Ross
3. Eulysis Dimailig

*[Return to TOC](#table-of-contents)*

----------------------------------------------------------------------

## Getting Started

This guide will walk you through the process of setting up and running the ByaHero! web application locally on your machine.

⚠ *I will not provide the .env file, which contains the PORT, MONGODB URI, and SESSION SECRET KEY*

**Prerequisites**
Before you begin, ensure you have the following installed:
- Node.js (v14.x or higher recommended)
- MongoDB (local installation or MongoDB Atlas account)
- Git

**Git Clone Repository**

```bash 
git clone https://github.com/joshnealcrisostomo/ByaHero.git
cd ByaHero
```

**Install Dependencies**
Install all the required dependencies using npm

This will install all packages listed in the package.json file, including Express, Handlebars, MongoDB drivers, bcrypt for authentication, multer for file handling, and other dependencies.

```bash 
npm install
```

*[Return to TOC](#table-of-contents)*
