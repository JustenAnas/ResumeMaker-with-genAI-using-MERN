 import { useState } from "react"
import { useNavigate,Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
import "../auth.form.scss"
const Register = () => { 

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const {loading,handleRegister} = useAuth()
    
   const handleSubmit =async(e)=>{
    e.preventDefault()
    setError("")

    if (username.trim().length < 3) {
        setError("Username must be at least 3 characters")
        return
    }

    if (password.length < 8) {
        setError("Password must be at least 8 characters")
        return
    }

    const result = await handleRegister({email,password,username})
    if (result?.success) {
        navigate('/login')
    } else {
        setError(result?.error || "Registration failed")
    }
   }

  if(loading){
    return (<main><h1>Loading....</h1></main>)
  }

  
  return (
      <main>
       <div className="form-container">
        <h1>Register your Account</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} >
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
            onChange={(e)=>{
              setUsername(e.target.value)
            }}
            type="text" 
            id="username" 
            name="username" 
            minLength={3}
            placeholder="enter your username" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
            type="email" 
            id="email" 
            name="email" 
            placeholder="enter your email" />
          </div>
          <div className="input-group">
            <label htmlFor="Password">Password</label>
            <input 
            onChange={(e)=>{
              setPassword(e.target.value)
            }}
            type="password" 
            id="password" 
            name="password"
            minLength={8} 
            placeholder="enter your password" />
          </div>
          <button className="button primary-btn">Register</button>
        </form>
        <p>Already have an Account?<Link to={"/Login"}>Login</Link></p>
       </div>
     </main>
  )

}

export default Register