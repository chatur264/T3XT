export const validateSignupData = (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: "All fields required"
        })
    }

    //! Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (email.startsWith(".") || email.endsWith(".")) {
        return res.status(400).json({ error: "Email cannot start or end with a dot" });
    }

    if (email.includes("..")) {
        return res.status(400).json({ error: "Email cannot contain consecutive dots" });
    }

    const [local, domain] = email.split("@");
    if (!domain) {
        return res.status(400).json({ error: "Email must contain a domain" });
    }

    if (domain.startsWith("-") || domain.endsWith("-")) {
        return res.status(400).json({ error: "Domain cannot start or end with a hyphen" });
    }

    if (domain.includes("--")) {
        return res.status(400).json({ error: "Domain cannot contain consecutive hyphens" });
    }

    if (!domain.includes(".")) {
        return res.status(400).json({ error: "Domain must contain at least one dot" });
    }

    const tld = domain.split(".").pop();
    if (tld.length < 2 || tld.length > 10) {
        return res.status(400).json({ error: "Invalid top-level domain" });
    }

    //! Password Validation
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    if (!/[a-z]/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
    }

    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
    }

    if (!/[0-9]/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one number" });
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(password)) {
        return res.status(400).json({ error: "Password must contain at least one special character" });
    }

    if (/\s/.test(password)) {
        return res.status(400).json({ error: "Password cannot contain spaces" });
    }

    if (/(.)\1\1/.test(password)) {
        return res.status(400).json({ error: "Password cannot contain three repeating characters" });
    }

    const weakPatterns = [
        "password", "qwerty", "12345", "12345678", "admin",
        "letmein", "welcome", "iloveyou", "abc123"
    ];
    for (let word of weakPatterns) {
        if (password.toLowerCase().includes(word)) {
            return res.status(400).json({ error: "Password is too weak" });
        }
    }
}