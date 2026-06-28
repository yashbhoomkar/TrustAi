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

        <div>

            <h1>Login</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e)=>
                    setEmail(e.target.value)
                }
            />

            <br/><br/>

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>
                    setPassword(e.target.value)
                }
            />

            <br/><br/>

            <button
                onClick={handleLogin}
            >
                Login
            </button>

            <br/><br/>

            <button
                onClick={()=>
                    navigate("/signup")
                }
            >
                Signup
            </button>

        </div>

    );

}