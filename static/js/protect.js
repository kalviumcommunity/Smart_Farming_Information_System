// This script ensures a user is logged in before viewing a page
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    // If no token exists, redirect to login page immediately
    if (!token) {
        window.location.href = '/login';
    }
});