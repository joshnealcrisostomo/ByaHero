document.addEventListener("DOMContentLoaded", function () {
    // Exit Button
    document.querySelector('.exit-btn').addEventListener('click', function() {
        window.history.back();
    });

    // Profile Picture Upload & Live Preview
    const profilePicInput = document.getElementById("profile-pic-input");
    const editForPfpButton = document.querySelector(".edit-for-pfp");
    const profilePicPreview = document.querySelector(".edit-pfp img"); 
    
    editForPfpButton.addEventListener("click", () => {
        profilePicInput.click();
    });

    profilePicInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePicPreview.src = e.target.result; 
            };
            reader.readAsDataURL(file);
        }
    });

    // Header Image Upload & Live Preview
    const headerPicInput = document.getElementById("header-pic-input");
    const editForHeaderButton = document.querySelector(".edit-for-header");
    const headerPicPreview = document.querySelector(".edit-header-overlay img");
    
    editForHeaderButton.addEventListener("click", () => {
        headerPicInput.click();
    });

    headerPicInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                headerPicPreview.src = e.target.result;
                headerPicPreview.style.width = "100%";
                headerPicPreview.style.height = "auto";
            };
            reader.readAsDataURL(file);
        }
    });
});