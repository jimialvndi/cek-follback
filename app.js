document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    const mainContent = document.getElementById('mainContent');
    const followLink = document.getElementById('followLink');
    const closePopupButton = document.getElementById('closePopup');

    let hasClickedFollow = false;

    // Get current date and popup status from Local Storage
    const popupShown = localStorage.getItem('popupShown');
    const popupTimestamp = localStorage.getItem('popupTimestamp');
    const currentTime = new Date().getTime();

    // Check if popup should be shown based on 7-day expiration
    if (popupShown === 'true' && popupTimestamp && currentTime - popupTimestamp < 7 * 24 * 60 * 60 * 1000) {
        popup.style.display = 'none';
        mainContent.classList.remove('hidden');
    } else {
        popup.style.display = 'flex';
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
            mainContent.classList.remove('hidden');

            // Save popup status and timestamp in Local Storage
            localStorage.setItem('popupShown', 'true');
            localStorage.setItem('popupTimestamp', currentTime.toString());
        } else {
            alert('Please click the Follow button first!');
        }
    });
});
