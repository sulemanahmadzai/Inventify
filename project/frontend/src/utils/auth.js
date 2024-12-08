// utils/auth.js
export const isTokenExpired = (token) => {
    if (!token) return true;

    // Decode the token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = JSON.parse(atob(base64));

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return jsonPayload.exp < currentTime; // Check if the expiration time is less than the current time
};
