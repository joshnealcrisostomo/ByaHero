document.querySelector('.return-btn').addEventListener('click', function() {
    window.history.back();
});

const dotsElements = document.querySelectorAll('.dots');
dotsElements.forEach(dots => {
    dots.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleOptionsMenu(this);
    });
});

function toggleOptionsMenu(dotsElement) {
    const postId = dotsElement.closest('.dots-container').querySelector('.dots-menu').id.replace('menu-', '');
    const menu = document.getElementById(`menu-${postId}`);
    if (menu) {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
}

window.addEventListener('click', function(event) {
    if (!event.target.closest('.dots') && !event.target.closest('.dots-menu')) {
        document.querySelectorAll('.dots-menu').forEach(menu => {
            menu.style.display = "none";
        });
    }
});

//---------------------------------------------------trial code-----------------------------------------------------------------------
/*
document.addEventListener("click", function (event) {
    console.log("✅ Click detected on:", event.target); // This should log EVERY click

    if (event.target.classList.contains("reply-btn")) {
        const commentId = event.target.getAttribute("data-comment-id");
        console.log("🎯 Reply button clicked! Comment ID:", commentId);
    }

});
*/

/*
document.addEventListener("click", function (event) {
    const button = event.target;
    
    if (button.classList.contains("reply-btn") && button.textContent.trim() === "Reply") {
        console.log("Reply button clicked");
        button.addEventListener("click", function () {
            console.log("✅ Reply button clicked!"); //added

            let commentContainer = this.closest(".comment");
            console.log("Comment container found:", commentContainer); //added

            let existingReplyContainer = commentContainer.querySelector(".reply-input-container");
            console.log("Existing reply container:", existingReplyContainer); // added

            if (existingReplyContainer) {
                console.log("🚨 Removing existing reply input!"); //added
                existingReplyContainer.remove();
            } else {
                console.log("🛠️ Creating new reply input!"); //added
                let replyContainer = document.createElement("div");
                replyContainer.classList.add("reply-input-container");
                replyContainer.style.marginLeft = "30px";
                replyContainer.style.marginTop = "10px";

                let replyInput = document.createElement("textarea");
                replyInput.placeholder = "Write a reply...";
                replyInput.style.width = "80%";
                replyInput.style.height = "36px";
                replyInput.style.border = "1px solid #c7b9b9";
                replyInput.style.borderRadius = "40px";
                replyInput.style.padding = "10px";
                replyInput.style.resize = "none";

                let submitButton = document.createElement("button");
                submitButton.textContent = "Reply";
                submitButton.classList.add("add-comment-btn");
                submitButton.style.marginLeft = "10px";
                submitButton.style.position = "relative";
                submitButton.style.top = "-15px";

                replyContainer.appendChild(replyInput);
                replyContainer.appendChild(submitButton);
                commentContainer.appendChild(replyContainer);

                console.log("✅ Reply input box added successfully!"); //added

                replyInput.addEventListener("input", function () {
                    this.style.height = "36px"; 
                    if (this.scrollHeight > this.clientHeight) {
                        this.style.height = Math.min(this.scrollHeight, 150) + "px"; 
                    }

                    if (this.scrollHeight >= 100) {
                        this.style.overflowY = "auto";
                    } else {
                        this.style.overflowY = "hidden";
                    }
                });

                submitButton.addEventListener("click", function () {
                    let replyText = replyInput.value.trim();
                    if (replyText) {
                        console.log("✅ Reply Submitted:", replyText) // added
                        console.log("Reply Submitted:", replyText);
                        replyContainer.remove();
                    }
                });
            }
        });
    }
});
*/

/*
document.addEventListener("click", function (event) {
    const button = event.target;
    
    if (button.classList.contains("reply-btn") && button.textContent.trim() === "Reply") {
        console.log("✅ Reply button clicked!");

        let commentContainer = button.closest(".comment");
        console.log("📝 Comment container found:", commentContainer);

        let commentId = button.getAttribute("data-comment-id"); //get comment id

        let existingReplyContainer = commentContainer.querySelector(".reply-input-container");
        console.log("🔍 Existing reply container:", existingReplyContainer);

        if (existingReplyContainer) {
            console.log("🚨 Removing existing reply input!");
            existingReplyContainer.remove();
        } else {
            console.log("🛠️ Creating new reply input!");

            // Create reply container div
            let replyContainer = document.createElement("div");
            replyContainer.classList.add("reply-input-container");
            replyContainer.style.marginLeft = "30px";
            replyContainer.style.marginTop = "10px";

            // Create reply input textarea
            let replyInput = document.createElement("textarea");
            replyInput.placeholder = "Write a reply...";
            replyInput.style.width = "80%";
            replyInput.style.height = "36px";
            replyInput.style.border = "1px solid #c7b9b9";
            replyInput.style.borderRadius = "40px";
            replyInput.style.padding = "10px";
            replyInput.style.resize = "none";

            // Create submit button
            let submitButton = document.createElement("button");
            submitButton.textContent = "Reply";
            submitButton.classList.add("add-comment-btn");
            submitButton.style.marginLeft = "10px";
            submitButton.style.position = "relative";
            submitButton.style.top = "-15px";

            // Append elements to reply container
            replyContainer.appendChild(replyInput);
            replyContainer.appendChild(submitButton);
            commentContainer.appendChild(replyContainer);

            console.log("✅ Reply input box added successfully!");

            // Auto-expand textarea on input
            replyInput.addEventListener("input", function () {
                this.style.height = "36px";
                if (this.scrollHeight > this.clientHeight) {
                    this.style.height = Math.min(this.scrollHeight, 150) + "px";
                }

                if (this.scrollHeight >= 100) {
                    this.style.overflowY = "auto";
                } else {
                    this.style.overflowY = "hidden";
                }
            });

            // Submit reply event
            submitButton.addEventListener("click", function () {
                let replyText = replyInput.value.trim();
                if (replyText) {
                    console.log("✅ Reply Submitted:", replyText);
                    replyContainer.remove();
                }
            });
        }
    }
});
*/

document.addEventListener("click", function (event) {
    const button = event.target;
    
    if (button.classList.contains("reply-btn") && button.textContent.trim() === "Reply") {
        console.log("✅ Reply button clicked!");

        let commentContainer = button.closest(".comment");
        let commentId = button.getAttribute("data-comment-id"); // Get comment ID
        console.log("📝 Comment ID:", commentId);

        let existingReplyContainer = commentContainer.querySelector(".reply-input-container");

        if (existingReplyContainer) {
            console.log("🚨 Removing existing reply input!");
            existingReplyContainer.remove();
        } else {
            console.log("🛠️ Creating new reply input!");

            let replyContainer = document.createElement("div");
            replyContainer.classList.add("reply-input-container");
            replyContainer.style.marginLeft = "30px";
            replyContainer.style.marginTop = "10px";

            let replyInput = document.createElement("textarea");
            replyInput.placeholder = "Write a reply...";
            replyInput.style.width = "80%";
            replyInput.style.height = "36px";
            replyInput.style.border = "1px solid #c7b9b9";
            replyInput.style.borderRadius = "40px";
            replyInput.style.padding = "10px";
            replyInput.style.resize = "none";

            let submitButton = document.createElement("button");
            submitButton.textContent = "Reply";
            submitButton.classList.add("add-comment-btn");
            submitButton.style.marginLeft = "10px";
            submitButton.style.position = "relative";
            submitButton.style.top = "-15px";

            replyContainer.appendChild(replyInput);
            replyContainer.appendChild(submitButton);
            commentContainer.appendChild(replyContainer);

            console.log("✅ Reply input box added successfully!");

            replyInput.addEventListener("input", function () {
                this.style.height = "36px";
                if (this.scrollHeight > this.clientHeight) {
                    this.style.height = Math.min(this.scrollHeight, 150) + "px";
                }
                this.style.overflowY = this.scrollHeight >= 100 ? "auto" : "hidden";
            });

            // Submit reply event
            submitButton.addEventListener("click", async function () {
                let replyText = replyInput.value.trim();
                let username = document.body.getAttribute('data-username') || "Anonymous";
                if (replyText) {
                    console.log("✅ Reply Submitted:", replyText);

                    try {
                        // Send reply to backend
                        const response = await fetch("/add-reply", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ commentId, username, content: replyText })
                        });

                        const result = await response.json();
                        if (result.error) {
                            console.error("❌ Error submitting reply:", result.error);
                        } else {
                            console.log("✅ Reply successfully stored in MongoDB:", result);
                            replyContainer.remove();
                            
                            // Refresh all replies from the server instead of manually adding just one
                            let repliesContainer = commentContainer.querySelector(".replies");
                            if (!repliesContainer) {
                                repliesContainer = document.createElement("div");
                                repliesContainer.classList.add("replies");
                                repliesContainer.style.display = "block";
                                commentContainer.appendChild(repliesContainer);
                            }
                            
                            // Fetch all replies for this comment and update the display
                            const updatedReplies = await fetchReplies(commentId);
                            
                            // Update Show Replies button text and ensure it exists
                            let toggleButton = commentContainer.querySelector(".toggle-replies-btn");
                            if (!toggleButton) {
                                toggleButton = document.createElement("button");
                                toggleButton.classList.add("toggle-replies-btn");
                                toggleButton.textContent = `Hide Replies (${updatedReplies.length})`;
                                toggleButton.setAttribute("data-comment-id", commentId);
                                commentContainer.appendChild(toggleButton);
                            } else {
                                toggleButton.textContent = `Hide Replies (${updatedReplies.length})`;
                            }
                            
                            // Trigger the toggle button click to refresh the replies display
                            if (repliesContainer.style.display !== "block") {
                                toggleButton.click();
                            } else {
                                // If replies are already visible, update them manually
                                const isLoggedIn = !!document.body.getAttribute('data-username');
                                
                                repliesContainer.innerHTML = updatedReplies.map(reply => {
                                    // Format date safely
                                    let dateString = "Unknown date";
                                    try {
                                        if (reply.createdAt) {
                                            dateString = new Date(reply.createdAt).toLocaleString();
                                        }
                                    } catch (e) {
                                        console.error("Error formatting date:", e);
                                    }
                                    
                                    // Handle username safely
                                    const username = reply.username || "Anonymous";
                                    
                                    return `
                                        <div class="reply">
                                            <div class="user-comment">
                                                <strong>${username}</strong>
                                                <div class="comment-header-right">
                                                    <span>${dateString}</span>
                                                    <div class="dots-container">
                                                        <div class="dots">⋮</div>
                                                        <div class="dots-menu">
                                                            <a href="#" class="edit-reply-btn" data-reply-id="${reply._id}">Edit</a>
                                                            <a href="#" class="delete-reply-btn" data-reply-id="${reply._id}">Delete</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="main-comment">
                                                <p>${reply.content}</p>
                                            </div>
                                            <div class="comment-actions">
                                                <button class="vote-btn upvote ${reply.isUpvoted ? 'upvoted' : ''}">▲</button>
                                                <span class="vote-count">${reply.votes || 0}</span>
                                                <button class="vote-btn downvote">▼</button>
                                                
                                                ${isLoggedIn ? `<button class="action-btn reply-btn" data-reply-id="${reply._id}">Reply</button>` : ''}

                                                <button class="action-btn">Share</button>
                                                ${reply.edited ? '<span class="post-edited"> Edited </span>' : ''}
                                            </div>
                                        </div>
                                    `;
                                }).join('');
                            }
                        }
                    } catch (error) {
                        console.error("❌ Network error submitting reply:", error);
                    }
                }
            });
        }
    }
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("toggle-replies-btn")) {
        let commentId = event.target.getAttribute("data-comment-id");
        let repliesDiv = document.querySelector(`.comment[data-comment-id='${commentId}'] .replies`);
        let commentContainer = document.querySelector(`.comment[data-comment-id='${commentId}']`);
        let isLoggedIn = !!document.body.getAttribute('data-username');
        
        if (repliesDiv) {
            if (repliesDiv.style.display === "none") {
                // Fetch fresh replies from server when showing replies
                fetchReplies(commentId).then(replies => {
                    // Update the replies container with fresh data
                    repliesDiv.innerHTML = replies.map(reply => {
                        // Format date safely
                        let dateString = "Unknown date";
                        try {
                            if (reply.createdAt) {
                                dateString = new Date(reply.createdAt).toLocaleString();
                            }
                        } catch (e) {
                            console.error("Error formatting date:", e);
                        }
                        
                        // Handle username safely
                        const username = reply.username || "Anonymous";
                        
                        return `
                            <div class="reply">
                                <div class="user-comment">
                                    <strong>${username}</strong>
                                    <div class="comment-header-right">
                                        <span>${dateString}</span>
                                        <div class="dots-container">
                                            <div class="dots">⋮</div>
                                            <div class="dots-menu">
                                                <a href="#" class="edit-reply-btn" data-reply-id="${reply._id}">Edit</a>
                                                <a href="#" class="delete-reply-btn" data-reply-id="${reply._id}">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="main-comment">
                                    <p>${reply.content}</p>
                                </div>
                                <div class="comment-actions">
                                    <button class="vote-btn upvote ${reply.isUpvoted ? 'upvoted' : ''}">▲</button>
                                    <span class="vote-count">${reply.votes || 0}</span>
                                    <button class="vote-btn downvote">▼</button>
                                    
                                    ${isLoggedIn ? `<button class="action-btn reply-btn" data-reply-id="${reply._id}">Reply</button>` : ''}

                                    <button class="action-btn">Share</button>
                                    ${reply.edited ? '<span class="post-edited"> Edited </span>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('');
                    
                    repliesDiv.style.display = "block";
                    event.target.textContent = "Hide Replies";
                });
            } else {
                repliesDiv.style.display = "none";
                event.target.textContent = `Show Replies (${repliesDiv.children.length})`;
            }
        }
    }
});

// Add this function to your frontend JavaScript
async function fetchReplies(commentId) {
    try {
        const response = await fetch(`/get-replies/${commentId}`);
        const data = await response.json();
        
        if (data.error) {
            console.error("Error fetching replies:", data.error);
            return [];
        }
        
        console.log("Replies fetched:", data.replies);
        return data.replies;
    } catch (error) {
        console.error("Error in fetchReplies:", error);
        return [];
    }
}


//----------------------------------------------end of trial code----------------------------------------------------------------------

console.log("✅ start");//added
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".action-btn").forEach(button => {
        console.log("✅ action btn is clicked");//added

    });

    function attachVoteListeners() {
        console.log("vote vote"); // added
        document.querySelectorAll('.comment-actions .vote-btn').forEach(btn => {
            btn.removeEventListener('click', handleVote);
            btn.addEventListener('click', handleVote);
        });
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        attachVoteListeners();
    });

    // Comment Button Functionality
    async function fetchComments() {
        let postId = window.location.pathname.split("/").pop();
        const commentsContainer = document.querySelector(".comments-section");
    
        try {
            let response = await fetch(`/comments/${postId}`);
            let data = await response.json();
    
            commentsContainer.innerHTML = "";
    
            if (Array.isArray(data)) {
                data.forEach(comment => {
                    let commentHTML = generateCommentHTML(comment, document.body.getAttribute('data-username'));
                    commentsContainer.appendChild(commentHTML);
                });
            }

            attachVoteListeners();
        } catch (error) {
            console.error("❌ Error fetching comments:", error);
        }
    }

    // Helper function to safely format dates
    function formatDate(dateString) {
        if (!dateString) return "Unknown date";
        
        try {
            return new Date(dateString).toLocaleString();
        } catch (e) {
            console.error("Error formatting date:", e, "for date string:", dateString);
            return "Invalid date";
        }
    }

    // reply
    async function fetchReplies(commentId) {
        try {
            console.log(`🔄 Fetching replies for commentId: ${commentId}`);
            const response = await fetch(`/get-replies/${commentId}`);
            const data = await response.json();
    
            if (!data.replies || !Array.isArray(data.replies)) {
                console.log("⚠️ No replies found or invalid data format", data);
                return [];
            }
    
            console.log("✅ Replies fetched:", data.replies);
            return data.replies;
        } catch (error) {
            console.error("🚨 Error fetching replies:", error);
            return [];
        }
    }
    
    // Update the generateCommentHTML function to use fetchReplies
    function generateCommentHTML(comment, loggedInUser) {
        let isAuthor = loggedInUser && loggedInUser === comment.username;
        let isLoggedIn = !!loggedInUser;
        let isUpvoted = comment.upvotedBy && comment.upvotedBy.includes(loggedInUser);

        let commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.setAttribute('data-comment-id', comment._id);

        let dotsMenuHTML = "";
        if (isLoggedIn) {
            dotsMenuHTML = `
                <div class="comment-dots-container">
                    <div class="comment-dots">⋮</div>
                    <div id="menu-${comment._id}" class="comment-dots-menu">
                        ${!isAuthor ? `<a href="/report/${comment._id}">Report</a>` : ''}
                        ${isAuthor ? `<a href="/editComment/${comment._id}">Edit</a>` : ''}
                        ${isAuthor ? `<a href="#" class="delete-comment-btn" data-comment-id="${comment._id}">Delete</a>` : ''}
                    </div>
                </div>
            `;
        }

        commentDiv.innerHTML = `
        <div class="user-comment">
            <strong>${comment.username}</strong>
            <div class="comment-header-right">
                <span>${formatDate(comment.createdAt)}</span>
                ${dotsMenuHTML}
            </div>
        </div>
        <div class="main-comment">
            <p>${comment.content}</p>
        </div>
        <div class="comment-actions">
            <button class="vote-btn upvote ${isUpvoted ? 'upvoted' : ''}">▲</button>
            <span class="vote-count">${comment.votes}</span>
            <button class="vote-btn downvote">▼</button>
            
            ${isLoggedIn ? `<button class="action-btn reply-btn" data-comment-id="${comment._id}">Reply</button>` : ''}
            
            <button class="action-btn">Share</button>
            ${comment.edited ? '<span class="post-edited"> Edited </span>' : ''}
        </div>

        <!-- Show Replies Button - always create it but update count -->
        <button class="toggle-replies-btn" data-comment-id="${comment._id}">
            ${comment.replies && comment.replies.length > 0 ? 
            `Show Replies (${comment.replies.length})` : 
            'Show Replies (0)'}
        </button>
        
        <!-- Empty Replies Section (Will be populated when button is clicked) -->
        <div class="replies" style="display: none;"></div>
        `;

        if (comment.nestedComments && comment.nestedComments.length > 0) {
            let nestedCommentsDiv = document.createElement("div");
            nestedCommentsDiv.classList.add("nested-comments");

            comment.nestedComments.forEach(nestedComment => {
                let nestedCommentHTML = generateCommentHTML(nestedComment, loggedInUser);
                nestedCommentsDiv.appendChild(nestedCommentHTML);
            });

            commentDiv.appendChild(nestedCommentsDiv);
        }

        return commentDiv;
    }
    
    // Centralized event delegation for all ellipsis clicks
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('dots') || event.target.classList.contains('comment-dots')) {
            event.stopPropagation();
            const dotsElement = event.target;
            const menu = dotsElement.nextElementSibling;
            if (menu) {
                menu.style.display = menu.style.display === "block" ? "none" : "block";
            }
        } else if (!event.target.closest('.dots') && !event.target.closest('.dots-menu') &&
                   !event.target.closest('.comment-dots') && !event.target.closest('.comment-dots-menu')) {
            document.querySelectorAll('.dots-menu, .comment-dots-menu').forEach(menu => {
                menu.style.display = "none";
            });
        }
    });
    
    
    document.addEventListener("DOMContentLoaded", function(){
        fetchComments();
    });

    fetchComments();
    
    const commentBtn = document.querySelector("#comment-btn");
    const commentInput = document.querySelector("#comment-input");

    if (!commentBtn || !commentInput) {
        console.error("❌ Comment button or input not found!");
        return;
    }

    let username = document.body.getAttribute('data-username') || "Anonymous";
    let postId = window.location.pathname.split("/").pop();

    commentBtn.addEventListener("click", async function () {
        let commentText = commentInput.value.trim();
        if (commentText === "") {
            console.warn("⚠️ Empty comment!");
            return;
        }

        try {
            let response = await fetch("/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId, username, content: commentText })
            });

            let data = await response.json();
            console.log("📩 API Response:", data);

            if (data.success) {
                commentInput.value = "";
                fetchComments();
            } else {
                console.error("❌ Failed to save comment:", data.message);
            }
        } catch (error) {
            console.error("❌ Error saving comment:", error);
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const commentTextArea = document.querySelector(".add-comment-section textarea");

    commentTextArea.addEventListener("input", function () {
        this.style.height = "36px";
        if (this.scrollHeight > this.clientHeight) {
            this.style.height = Math.min(this.scrollHeight, 150) + "px";
        }

        if (this.scrollHeight >= 100) {
            this.style.overflowY = "auto";
        } else {
            this.style.overflowY = "hidden";
        }
    });
});

document.addEventListener('click', async function(event) {
    // Check if clicked element is a delete comment button
    if (event.target.classList.contains('delete-comment-btn') || 
        (event.target.parentElement && event.target.parentElement.classList.contains('delete-comment-btn'))) {
        
        event.preventDefault();
        
        // Get the comment ID from the data attribute
        const element = event.target.classList.contains('delete-comment-btn') ? 
                        event.target : event.target.parentElement;
        const commentId = element.getAttribute('data-comment-id');
        
        if (!commentId) {
            console.error("❌ Comment ID not found");
            return;
        }
        
        // Confirm deletion
        const confirmDelete = confirm("Are you sure you want to delete this comment? This action cannot be undone.");
        if (!confirmDelete) return;
        
        try {
            // Send delete request
            const response = await fetch(`/comments/${commentId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Remove the comment from the DOM
                const commentElement = element.closest('.comment');
                if (commentElement) {
                    commentElement.remove();
                }
                console.log("✅ Comment deleted successfully");
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Error deleting comment:", error);
            alert("❌ Network error. Please try again.");
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".delete-post-btn").forEach(btn => {
        btn.addEventListener("click", handleDeletePost);
    });

    document.querySelectorAll(".vote-btn").forEach(btn => {
        btn.addEventListener("click", handleVote);
    });
});

async function handleDeletePost(event) {
    event.preventDefault();
    const postId = this.getAttribute('data-post-id');
    const confirmDelete = confirm("Are you sure? This action cannot be undone.");

    if (!confirmDelete) return;

    try {
        const response = await fetch("/deletePost", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Post deleted successfully!");
            const postElement = this.closest('.post');
            if (postElement) {
                postElement.remove();
            } else {
                window.location.reload();
            }
            window.location.href = "/dashboard";
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("❌ Error deleting post:", error);
        alert("❌ Network error. Please try again.");
    }
}

async function handleVote(event) {
    event.preventDefault();
    const isPostVote = this.closest('.post-actions');
    const isCommentVote = this.closest('.comment-actions');
    const isUpvote = this.querySelector('img[alt="upvote"]') || this.classList.contains('upvote');
    
    // For post votes
    if (isPostVote) {
        const postId = this.getAttribute('data-post-id');
        
        if (!postId) {
            console.error("Post ID not found");
            return;
        }
        
        try {
            const voteContainer = this.closest('.vote-container');
            const voteCount = voteContainer.querySelector('.vote-count');
            const isCurrentlyUpvoted = voteContainer.classList.contains('upvoted');

            const response = await fetch(isUpvote ? `/upvotePost/${postId}` : `/downvotePost/${postId}`, {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok) {
                voteCount.textContent = data.votes;

                if (isUpvote) {
                    if (isCurrentlyUpvoted) {
                        voteContainer.classList.remove('upvoted');
                        voteCount.classList.remove('upvoted');
                    } else {
                        voteContainer.classList.add('upvoted');
                        voteCount.classList.add('upvoted');
                    }
                } else {
                    if (isCurrentlyUpvoted) {
                        voteContainer.classList.remove('upvoted');
                        voteCount.classList.remove('upvoted');
                    }
                }
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Error voting:", error);
            alert("❌ Network error. Please try again.");
        }
    } 
    // For comment votes
    else if (isCommentVote) {
        const commentId = this.closest('.comment').getAttribute('data-comment-id');
        
        if (!commentId) {
            console.error("Comment ID not found");
            return;
        }
        
        try {
            const voteCount = this.closest('.comment-actions').querySelector('.vote-count');
            
            // Get the state of the button
            const upvoteBtn = this.closest('.comment-actions').querySelector('.upvote');
            const isCurrentlyUpvoted = upvoteBtn && upvoteBtn.classList.contains('active');
            
            const endpoint = isUpvote ? '/upvoteComment/' : '/downvoteComment/';
            const response = await fetch(`${endpoint}${commentId}`, {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok) {
                voteCount.textContent = data.votes;
                
                // Update UI to reflect vote state
                if (isUpvote) {
                    const upvoteBtn = this.closest('.comment-actions').querySelector('.upvote');
                    const downvoteBtn = this.closest('.comment-actions').querySelector('.downvote');
                    
                    if (isCurrentlyUpvoted) {
                        upvoteBtn.classList.remove('active');
                    } else {
                        upvoteBtn.classList.add('active');
                        downvoteBtn.classList.remove('active');
                    }
                } else {
                    const upvoteBtn = this.closest('.comment-actions').querySelector('.upvote');
                    const downvoteBtn = this.closest('.comment-actions').querySelector('.downvote');
                    
                    if (isCurrentlyUpvoted) {
                        upvoteBtn.classList.remove('active');
                    }
                    
                    // Toggle downvote active state
                    if (downvoteBtn.classList.contains('active')) {
                        downvoteBtn.classList.remove('active');
                    } else {
                        downvoteBtn.classList.add('active');
                        upvoteBtn.classList.remove('active');
                    }
                }
            } else {
                alert(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Error voting on comment:", error);
            alert("❌ Network error. Please try again.");
        }
    }
}