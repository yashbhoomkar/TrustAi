import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/auth";
import { saveToken } from "../auth";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    async function handleLogin() {

        try {

            const response = await login(
                email,
                password
            );

            saveToken(
                response.access_token
            );

            navigate("/");

        }

        catch {

            alert("Invalid Credentials");

        }

    }

    return (

    <div className="login-page">

        <div className="login-card">

            <div className="login-header">

                <h1>

                    TrustAI

                </h1>

                <p>

                    Evaluate LLMs with confidence

                </p>

            </div>

            <h2>

                Login

            </h2>

            <div className="field">

                <label>

                    Email

                </label>

                <input

                    type="email"

                    placeholder="Enter your email"

                    value={email}

                    onChange={(e) =>

                        setEmail(e.target.value)

                    }

                />

            </div>

            <div className="field">

                <label>

                    Password

                </label>

                <input

                    type="password"

                    placeholder="Enter your password"

                    value={password}

                    onChange={(e) =>

                        setPassword(e.target.value)

                    }

                />

            </div>

            <button

                className="primary-button"

                onClick={handleLogin}

            >

                Login

            </button>

            <button

                className="secondary-button"

                onClick={() =>

                    navigate("/signup")

                }

            >

                Create Account

            </button>

        </div>

    </div>

);

}