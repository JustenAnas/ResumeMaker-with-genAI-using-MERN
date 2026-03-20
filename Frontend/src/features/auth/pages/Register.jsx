 import { useState } from "react"
import { useNavigate,Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
const Register = () => { 

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {loading,handleRegister} = useAuth()
    
   const handleSubmit =async(e)=>{
    e.preventDefault()
    await handleRegister({email,password,username})
    navigate('/login')
   }

  if(loading){
    return (<main><h1>Loading....</h1></main>)
  }

  
  return (
      <main>
       <div className="form-container">
        <h1>Register your Account</h1>
        <form onSubmit={handleSubmit} >
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
            onChange={(e)=>{
              setUsername(e.target.value)
            }}
            type="username" 
            id="username" 
            name="username" 
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
            type="Password" 
            id="Password" 
            name="Password" 
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