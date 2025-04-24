// public/javascript/editPost.js
document.addEventListener('DOMContentLoaded', function() {
    const updatePostForm = document.getElementById('updatePostForm');
    
    if (updatePostForm) {
        updatePostForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const postId = this.getAttribute('data-post-id');
            const formData = new FormData(this);
            const postData = {
                postTitle: formData.get('postTitle'),
                postContent: formData.get('postContent'),
                postImage: formData.get('postImage'),
                tags: formData.get('tags')
            };
            
            try {
                const response = await fetch(`/updatePost/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData),
                    credentials: 'include'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('✅ Post updated successfully!');
                    window.location.href = `/post/${postId}`;
                } else {
                    alert(`❌ ${result.message}`);
                }
            } catch (error) {
                console.error('Error updating post:', error);
                alert('❌ Network error. Please try again.');
            }
        });
    }
    
    const cancelButton = document.querySelector('.cancel-btn');
    if (cancelButton) {
        cancelButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.history.back();
        });
    }
});