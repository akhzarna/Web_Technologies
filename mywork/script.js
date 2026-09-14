/* =========================================================
   SIMPLE JAVASCRIPT FOR BOOK STORE
   Demonstrating Core DOM Concepts for Beginners:
   1. Selecting elements (getElementById, querySelectorAll)
   2. Listening to user actions (addEventListener)
   3. Modifying DOM content (textContent)
   4. Modifying element classes and attributes (classList, disabled)
   ========================================================= */

// 1. Variable to store state (number of books in cart)
let cartCount = 0;

// 2. Select DOM elements
const cartCountElement = document.getElementById('cart-count');
const buttons = document.querySelectorAll('.buy-btn');
const toastElement = document.getElementById('toast');

// Variable to keep track of toast timer
let toastTimeout;

// 3. Helper function to show a temporary notification toast
function showNotification(message) {
    // Set message text
    toastElement.textContent = message;

    // Show toast by removing the 'hidden' class
    toastElement.classList.remove('hidden');

    // Clear any previous timer if button was clicked quickly
    clearTimeout(toastTimeout);

    // Hide toast automatically after 2.5 seconds (2500ms)
    toastTimeout = setTimeout(function () {
        toastElement.classList.add('hidden');
    }, 2500);
}

// 4. Attach click event listener to each "Add to Cart" button
buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        // Increment cart count
        cartCount = cartCount + 1;

        // Update the cart number displayed in the header
        cartCountElement.textContent = cartCount;

        // Get the title of the book that was clicked
        const bookTitle = button.getAttribute('data-title');

        // Update button visual state and text
        button.textContent = '✓ Added to Cart';
        button.classList.add('added');
        button.disabled = true; // Prevents adding the exact same copy twice

        // Show feedback notification to the user
        showNotification(`"${bookTitle}" added to your cart!`);
    });
});
