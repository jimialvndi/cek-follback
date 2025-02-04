// app.js
document.addEventListener('DOMContentLoaded', () => {
    const followPopup = document.getElementById('followPopup');
    const confirmFollowBtn = document.getElementById('confirmFollowBtn');
    const followLink = document.getElementById('followLink');

    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');

    if (!hasSeenPopup) {
        followPopup.classList.remove('hidden');
    }

    // Show confirm button only after follow link is clicked
    followLink.addEventListener('click', () => {
        confirmFollowBtn.classList.remove('hidden');
    });

    // Hide popup and save state when user confirms they have followed
    confirmFollowBtn.addEventListener('click', () => {
        followPopup.classList.add('hidden');
        localStorage.setItem('hasSeenPopup', 'true');
    });

    document.getElementById('checkBtn').addEventListener('click', () => {
        const followersFile = document.getElementById('followersFile').files[0];
        const followingFile = document.getElementById('followingFile').files[0];
        const resultsTableBody = document.querySelector('#not-following-back tbody');
        resultsTableBody.innerHTML = ''; // Clear previous results

        if (!followersFile || !followingFile) {
            alert('Please upload both Followers and Following JSON files!');
            return;
        }

        const readerFollowers = new FileReader();
        const readerFollowing = new FileReader();

        const processFiles = (followersData, followingData) => {
            const followers = followersData.map(item => item.string_list_data[0].value);
            const following = followingData.relationships_following.map(item =>
                item.string_list_data[0]?.value || ''
            ).filter(Boolean);

            const notFollowingBack = following.filter(user => !followers.includes(user));

            if (notFollowingBack.length) {
                notFollowingBack.forEach((account, index) => {
                    const row = document.createElement('tr');

                    // Add number column
                    const numberCell = document.createElement('td');
                    numberCell.textContent = index + 1;
                    numberCell.className = 'border border-gray-300 px-4 py-2';

                    // Add username column
                    const usernameCell = document.createElement('td');
                    const link = document.createElement('a');
                    link.href = `https://www.instagram.com/${account}`;
                    link.target = '_blank'; // Open in a new tab
                    link.textContent = account;
                    link.className = 'text-blue-500 underline';

                    usernameCell.appendChild(link);
                    usernameCell.className = 'border border-gray-300 px-4 py-2';

                    // Append cells to row
                    row.appendChild(numberCell);
                    row.appendChild(usernameCell);

                    // Append row to table body
                    resultsTableBody.appendChild(row);
                });

                // Enable search functionality
                document.getElementById('searchInput').addEventListener('input', (event) => {
                    const searchTerm = event.target.value.toLowerCase();
                    const rows = resultsTableBody.querySelectorAll('tr');

                    rows.forEach(row => {
                        const username = row.querySelector('td:nth-child(2) a').textContent.toLowerCase();
                        if (username.includes(searchTerm)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            } else {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.textContent = 'Everyone follows you back!';
                cell.colSpan = 2;
                cell.className = 'border border-gray-300 px-4 py-2 text-center';
                row.appendChild(cell);
                resultsTableBody.appendChild(row);
            }
        };

        readerFollowers.onload = function () {
            try {
                const followersData = JSON.parse(readerFollowers.result);
                readerFollowing.onload = function () {
                    try {
                        const followingData = JSON.parse(readerFollowing.result);
                        processFiles(followersData, followingData);
                    } catch (error) {
                        alert('Invalid JSON structure in Following file!');
                    }
                };
                readerFollowing.readAsText(followingFile);
            } catch (error) {
                alert('Invalid JSON structure in Followers file!');
            }
        };
        readerFollowers.readAsText(followersFile);
    });
});
