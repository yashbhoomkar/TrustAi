import "./Signup.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../services/auth";

export default function Signup() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    async function handleSignup() {

        try {

            await signup(
                email,
                password
            );

            alert("Signup Successful");

            navigate("/login");

        }

        catch {

            alert("Signup Failed");

        }

    }

    return (

    <div className="signup-page">

        <div className="signup-card">

            <div className="signup-header">

                <h1>

                    TrustAI

                </h1>

                <p>

                    Create your account to start evaluating LLMs

                </p>

            </div>

            <h2>

                Sign Up

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

                        setEmail(

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="field">

                <label>

                    Password

                </label>

                <input

                    type="password"

                    placeholder="Create a password"

                    value={password}

                    onChange={(e) =>

                        setPassword(

                            e.target.value

                        )

                    }

                />

            </div>

            <button

                className="primary-button"

                onClick={handleSignup}

            >

                Create Account

            </button>

            <button

                className="secondary-button"

                onClick={() =>

                    navigate("/login")

                }

            >

                Already have an account?

            </button>

        </div>

    </div>

);

}