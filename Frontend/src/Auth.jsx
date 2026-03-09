import { useState } from "react";
import "./Auth.css";
import { API_BASE_URL } from "./config";

function Auth({ onAuthSuccess }) {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const endpoint = mode === "login" ? "login" : "register";

    const resetFields = () => {
        setName("");
        setEmail("");
        setPassword("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim() || (mode === "register" && !name.trim())) {
            setError("Please fill all required fields.");
            return;
        }

        setLoading(true);
        setError("");

        const payload =
            mode === "login"
                ? {
                      email: email.trim(),
                      password
                  }
                : {
                      name: name.trim(),
                      email: email.trim(),
                      password
                  };

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data?.error || "Authentication failed");
                return;
            }

            onAuthSuccess(data.token, data.user);
            resetFields();
        } catch (err) {
            setError("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="authPage">
            <div className="authCard">
                <h1>ConversAI</h1>
                <p className="authSubtext">Sign in to continue your personal conversations.</p>

                <div className="authTabs">
                    <button
                        type="button"
                        className={mode === "login" ? "activeTab" : ""}
                        onClick={() => {
                            setMode("login");
                            setError("");
                        }}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={mode === "register" ? "activeTab" : ""}
                        onClick={() => {
                            setMode("register");
                            setError("");
                        }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="authForm">
                    {mode === "register" && (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            autoComplete="name"
                        />
                    )}

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        autoComplete="email"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />

                    {error && <p className="authError">{error}</p>}

                    <button type="submit" className="authSubmit" disabled={loading}>
                        {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Auth;
