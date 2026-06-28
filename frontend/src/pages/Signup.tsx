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

        <div>

            <h1>Signup</h1>

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
                onClick={handleSignup}
            >
                Signup
            </button>

            <br/><br/>

            <button
                onClick={()=>
                    navigate("/login")
                }
            >
                Login
            </button>

        </div>

    );

}