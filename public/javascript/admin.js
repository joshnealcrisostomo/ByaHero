document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".prof-menu-btn a");
    
    menuButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            
            // Remove active class from all buttons
            menuButtons.forEach(btn => btn.classList.remove("active"));
            
            // Add active class to clicked button
            this.classList.add("active");
            
            // Get the content type from the button class
            let contentType = this.className.split('-')[0];
            
            // Load content for the selected tab
            fetch(`/admin/content/${contentType}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    // Replace the entire table content, not just the inner HTML
                    document.querySelector(".reported-posts").innerHTML = html;
                })
                .catch(error => {
                    console.error("Error loading content:", error);
                    document.querySelector(".reported-posts").innerHTML = 
                        `<div class="error-message">Error loading reports. Please try again.</div>`;
                });
        });
    });
});