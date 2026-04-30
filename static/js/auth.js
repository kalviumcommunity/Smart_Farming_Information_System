const NODE_API_URL = 'http://localhost:5001/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const errorMsg = document.getElementById('error-msg');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${NODE_API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/'; // redirect to home/dashboard
                } else {
                    errorMsg.textContent = data.msg || 'Login failed';
                    errorMsg.classList.remove('d-none');
                }
            } catch (err) {
                errorMsg.textContent = 'Server error. Is the Node backend running?';
                errorMsg.classList.remove('d-none');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${NODE_API_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/'; // redirect to home/dashboard
                } else {
                    errorMsg.textContent = data.msg || 'Signup failed';
                    errorMsg.classList.remove('d-none');
                }
            } catch (err) {
                errorMsg.textContent = 'Server error. Is the Node backend running?';
                errorMsg.classList.remove('d-none');
            }
        });
    }
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}