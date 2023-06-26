import { useState } from 'react'
import { useNavigate } from "react-router-dom"
const url = "http://localhost:5000";

const Signup = () => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch(`${url}/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password })
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
    <div className="container mt-3">

      <form onSubmit={handleSubmit}>
        <h2>Create an Account to use NoteKaro</h2>
        <div className="form-group mb-3">
          <label htmlFor="email">Name</label>
          <input type="text" className="form-control" value={credentials.emailemail} onChange={onChange} id="name" name="name" aria-describedby="emailHelp" />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" value={credentials.emailemail} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name="password" minLength={5} required />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" className="form-control" value={credentials.cpassword} onChange={onChange} id="cpassword" name="cpassword" minLength={5} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

    </div>
  )
}

export default Signup