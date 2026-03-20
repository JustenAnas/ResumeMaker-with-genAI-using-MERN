import "../auth.form.scss"
import {useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"

 const Login = () => {

  const navigate = useNavigate()
  const {loading,handleLogin} = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit =async(e)=>{
    e.preventDefault()
    await handleLogin({email,password})
    navigate('/')
  }

  if(loading){
    return (<main><h1>Loading....</h1></main>)
  }

  return (
     <main>
       <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} >
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e)=>{
              setEmail(e.target.value)
            }}
             type="email" 
             id="email" 
             name="email" 
             autoComplete="email"
             placeholder="enter your email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
             onChange={(e)=>{
              setPassword(e.target.value)
            }}
             type="password"
             id="password"
             name="password"
             autoComplete="current-password"
             placeholder="enter your password" />
          </div>
          <button className="button primary-btn">Login</button>
        </form>
        <p>Don't have an Account? Register here!!<Link to={"/Register"}>Register</Link></p>
       </div>
     </main>
  )
}

export default Login