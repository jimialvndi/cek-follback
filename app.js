document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    const mainContent = document.getElementById('mainContent');
    const followLink = document.getElementById('followLink');
    const closePopupButton = document.getElementById('closePopup');

    let hasClickedFollow = false;

    // Check if the popup has been shown before
    const popupShown = localStorage.getItem('popupShown');

    if (popupShown === 'true') {
        popup.style.display = 'none';
        mainContent.classList.remove('hidden'); // Show main content
    } else {
        popup.style.display = 'flex'; // Show the popup
    }

    // Event listener for Follow link
    followLink.addEventListener('click', () => {
        hasClickedFollow = true;

        // Show the "I've Followed" button after clicking the Follow link
        closePopupButton.classList.remove('hidden');
    });

    // Event listener for "I've Followed" button
    closePopupButton.addEventListener('click', () => {
        if (hasClickedFollow) {
            popup.style.display = 'none';
            mainContent.classList.remove('hidden'); // Show main content

            // Save popup status in Local Storage
            localStorage.setItem('popupShown', 'true');
        } else {
            alert('Please click the Follow button first!');
        }
    });
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
