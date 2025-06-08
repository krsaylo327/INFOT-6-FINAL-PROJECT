// Validate if the given string is a valid email address
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Get the initials (first letters) from a name string (max 2 words)
export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i=0; i <Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
    
};