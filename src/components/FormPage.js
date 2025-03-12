import React, { useState } from "react";
import "../style/style.css";

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [signUpData, setSignUpData] = useState(null);
    const [loginData, setLoginData] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (isSignUp) {
            if (!formData.fullName.trim()) {
                newErrors.fullName = "Full Name is required";
                isValid = false;
            }
            if (!formData.username.trim()) {
                newErrors.username = "Username is required";
                isValid = false;
            }
            if (!/^\d{10}$/.test(formData.phone)) {
                newErrors.phone = "Phone number must be 10 digits";
                isValid = false;
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
                isValid = false;
            }
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(formData.password)) {
            newErrors.password = "Password must be at least 6 characters and contain letters and numbers";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setSuccessMessage(isSignUp ? "Signup Successful!" : "Login Successful!");
            setErrors({});
            if (isSignUp) {
                setSignUpData({ ...formData });
            } else {
                setLoginData({ ...formData });
            }
            setFormData({
                fullName: "",
                username: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
            });
        } else {
            setSuccessMessage("");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className={`auth-box ${isSignUp ? "signup" : "login"}`}>
                    <h2 className="auth-title">{isSignUp ? "Sign Up" : "Login"}</h2>
                    <form onSubmit={handleSubmit} className="auth-form">
                        {isSignUp && (
                            <div className="input-row">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="auth-input"
                                    />
                                    {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="auth-input"
                                    />
                                    {errors.username && <p className="error-message">{errors.username}</p>}
                                </div>
                            </div>
                        )}
                        <div className="input-row">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="auth-input"
                                />
                                {errors.email && <p className="error-message">{errors.email}</p>}
                            </div>
                            {isSignUp && (
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="auth-input"
                                    />
                                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                                </div>
                            )}
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="auth-input"
                                />
                                {errors.password && <p className="error-message">{errors.password}</p>}
                            </div>
                            {isSignUp && (
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="auth-input"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="error-message">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        <button type="submit" className="auth-button">
                            {isSignUp ? "Sign Up" : "Login"}
                        </button>
                    </form>
                    <p className="auth-toggle" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                    </p>
                </div>
                {isSignUp && signUpData && (
                    <div className="user-data-card">
                        <h3>Sign Up Data</h3>
                        <p><strong>Full Name:</strong> {signUpData.fullName}</p>
                        <p><strong>Username:</strong> {signUpData.username}</p>
                        <p><strong>Phone:</strong> {signUpData.phone}</p>
                        <p><strong>Email:</strong> {signUpData.email}</p>
                        <p><strong>Password:</strong> {signUpData.password}</p>
                    </div>
                )}
                {!isSignUp && loginData && (
                    <div className="user-data-card">
                        <h3>Login Data</h3>
                        <p><strong>Email:</strong> {loginData.email}</p>
                        <p><strong>Password:</strong> {loginData.password}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthForm;