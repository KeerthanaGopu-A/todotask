import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");

        if (isRegister) {
            // Registration Flow
            const result = await dispatch(registerUser({ name, email, password }));
            if (!result.error) {
                // successful register
                setIsRegister(false); // Switch to Login view
                setSuccessMsg("Account created successfully! Please log in.");
                toast.success("Account created! Please log in.");
                dispatch(logout()); // Clear the auto-login state from registration
                setPassword(""); // Clear password to force re-entry
            } else {
                toast.error(result.payload || "Registration failed");
            }
        } else {
            // Login Flow
            const result = await dispatch(loginUser({ email, password }));
            if (!result.error) {
                toast.success("Welcome back!");
                navigate("/dashboard");
            } else {
                toast.error(result.payload || "Login failed");
            }
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setSuccessMsg("");
        setName("");
        setEmail("");
        setPassword("");
    };

    return (
        <div className="animated-bg" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: "20px"
        }}>
            <div className="glass-panel fade-in" style={{ width: "100%", maxWidth: "420px", padding: "40px", position: "relative", overflow: "hidden" }}>

                {/* Decorative elements */}
                <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "100px", height: "100px", background: "var(--primary)", borderRadius: "50%", filter: "blur(60px)", opacity: 0.5 }}></div>
                <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "100px", height: "100px", background: "var(--secondary)", borderRadius: "50%", filter: "blur(60px)", opacity: 0.5 }}></div>

                <h2 style={{ textAlign: "center", marginBottom: "10px", fontSize: "2.2rem", fontWeight: "700", letterSpacing: "-1px" }}>
                    {isRegister ? "Join Us" : "Welcome Back"}
                </h2>
                <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "30px" }}>
                    {isRegister ? "Start organizing your life today." : "Enter your details to access account."}
                </p>

                {successMsg && (
                    <div className="fade-in" style={{
                        background: "rgba(3, 218, 198, 0.15)",
                        border: "1px solid var(--success)",
                        color: "#69f0ae",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        textAlign: "center",
                        fontSize: "0.9rem"
                    }}>
                        {successMsg}
                    </div>
                )}

                {error && (
                    <div className="fade-in" style={{
                        background: "rgba(207, 102, 121, 0.15)",
                        border: "1px solid var(--danger)",
                        color: "#ff8a80",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        textAlign: "center",
                        fontSize: "0.9rem"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group fade-in">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: "100%", marginTop: "15px", padding: "14px", fontSize: "1rem" }}
                    >
                        {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "25px", paddingTop: "20px", borderTop: "1px solid var(--glass-border)" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                        {isRegister ? "Already member?" : "New here?"}
                    </span>
                    <button
                        className="btn"
                        onClick={toggleMode}
                        style={{
                            background: "none",
                            color: "var(--primary)",
                            padding: "0 8px",
                            fontSize: "0.95rem",
                            fontWeight: "600"
                        }}
                    >
                        {isRegister ? "Sign In" : "Create Account"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;
