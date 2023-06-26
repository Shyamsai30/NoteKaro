import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
const url = "http://localhost:5000";

const Login = () => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${url}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json);
        // save the auth token and redirect
        localStorage.setItem('token', json.authToken);
        navigate('/');
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                <h2>Login to continue to NoteKaro</h2>
                <div className="form-group mb-4">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" value={credentials.emailemail} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name="password" minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login