document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const postBtn = document.getElementById('post-btn');
    const postInput = document.getElementById('post-input');
    const postImage = document.getElementById('post-image');
    const postsSection = document.getElementById('posts-section');
    
    // Load profile info from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    const userPosts = JSON.parse(localStorage.getItem('userPosts')) || [];

    // Display profile information on profile page
    if (userProfile.name) {
        document.getElementById('user-name').textContent = userProfile.name;
        document.getElementById('user-bio').textContent = userProfile.bio;
        document.getElementById('user-pic').src = userProfile.profilePic || 'https://via.placeholder.com/100';
    }

    // Display posts in feed.html and profile.html
    function displayPosts() {
        postsSection.innerHTML = '';
        if (userPosts.length === 0) {
            postsSection.innerHTML = '<p>No posts yet.</p>';
        } else {
            userPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h4>${userProfile.name}</h4>
                    <p>${post.text}</p>
                    ${post.imageURL ? `<img src="${post.imageURL}" alt="Post Image">` : ''}
                    <button class="like-btn">Like</button>
                    <span class="likes-count">${post.likes} Likes</span>
                `;
                postsSection.appendChild(postElement);
            });
        }
    }

    // Handle profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const username = document.getElementById('username').value.trim();
            const bio = document.getElementById('bio').value.trim();
            const profilePicFile = document.getElementById('profile-pic').files[0];
            const profilePicURL = profilePicFile ? URL.createObjectURL(profilePicFile) : null;

            const profileData = { name, username, bio, profilePic: profilePicURL };
            localStorage.setItem('userProfile', JSON.stringify(profileData));

            // After setting profile data, navigate to the feed page
            window.location.href = "feed.html"; // Ensure this is written after the profile is saved to localStorage
        });
    }

    // Handle post creation in feed.html
    if (postBtn) {
        postBtn.addEventListener('click', () => {
            const text = postInput.value.trim();
            const imageFile = postImage.files[0];
            const imageURL = imageFile ? URL.createObjectURL(imageFile) : null;

            if (!text && !imageURL) {
                alert('Please add text or an image to your post.');
                return;
            }

            const newPost = { text, imageURL, likes: 0 };
            userPosts.push(newPost);
            localStorage.setItem('userPosts', JSON.stringify(userPosts));

            displayPosts(); // Refresh posts display
            postInput.value = '';
            postImage.value = '';
        });
    }

    // Menu button functionality
    document.getElementById('menu-profile')?.addEventListener('click', () => {
        window.location.href = 'profile.html'; // Navigate to profile page
    });

    document.getElementById('menu-logout')?.addEventListener('click', () => {
        localStorage.clear(); // Clear localStorage to log out
        window.location.href = 'index.html'; // Redirect to login page
    });

    displayPosts(); // Display posts on profile and feed pages
});
