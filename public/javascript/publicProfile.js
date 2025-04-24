document.querySelector('.return-btn').addEventListener('click', function() {
    window.history.back();
});

document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelectorAll(".prof-menu-btn a");
    const contentDiv = document.querySelector(".content");

    menuLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove active class from all links
            menuLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            // Extract tab name from class
            let tab = this.className.replace("-btn", "").replace(" active", "");
            
            // Get username from URL path
            const pathParts = window.location.pathname.split('/');
            let username = pathParts[pathParts.length - 1];
            
            console.log("Tab:", tab);
            console.log("Username:", username);

            fetch(`/profile/${username}/content/${tab}`)
                .then(response => response.text())
                .then(html => {
                    contentDiv.innerHTML = html;
                })
                .catch(error => console.error("Error loading content:", error));
        });
    });
});
