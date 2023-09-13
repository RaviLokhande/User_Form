import React from "react";
import axios from "axios";
import {GoogleLoginButton} from "react-social-login-buttons"
import {LoginSocialGoogle} from "reactjs-social-login"
import CustomButton from "../common/button";
import { render } from "preact";
import "./login.css";

import { useEffect, useState } from "preact/hooks";
import { Users } from "../database/user";
import * as bcrypt from "bcryptjs";
import OTPInput from "react-otp-input";

function Login() {
  const [logged, setLogged] = useState(false);

  const [showLoginForm, setShowLoginForm] = useState(true);


  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState('');


  const responseGoogleSuccess = (response) => {
    // Handle a successful Google sign-in here
    console.log('Google Sign-In Success', response);
    setLogged(true)
    setShowLoginForm(false)
    
    // history.push('/welcomepage');
    // window.location.href = '/Login'; // Redirect to the main application route
  };
  const responseGoogleFailure = (error) => {
    // Handle Google sign-in failure here
    console.error('Google Sign-In Error', error);
    
    // Redirect to the login page or display an error message as needed
    window.location.href = '/Login'; // Redirect to the login page route
  };  

 useEffect(() => {
 const rightOtp = localStorage.getItem("OTP")
   console.log(rightOtp === otp)
  if(rightOtp === otp){
    setLogged(true)
 
    localStorage.setItem("logged", 'true');
    }else if(otp.length === 6){
      setOtp('')
      alert("Invalid OTP")
    }
 },[otp])

axios.defaults.headers.common['client_id'] = '066abb14-bb97-4847-ab3b-260fc54b65ce';

axios.defaults.headers.common['client_secret'] = 'a8f2ff19-1b65-45a2-8eb0-9a13d4ef84d4';
  const handleLogout = () => {
    localStorage.clear();
    setLogged(false);
    window.location.reload();
  };
  const handleLogging = async (e) => {
    e.preventDefault()
    const formData = document.forms[0];
    console.log(formData.uname.value.toLocaleLowerCase())
    const userData = Users.find(
      ({ username, password }) =>
        username.toLocaleLowerCase() ===
          formData.uname.value.toLocaleLowerCase() &&
        // password === formData.pass.value
        bcrypt.compareSync(formData.pass.value, password)
    );
    console.log(bcrypt.hashSync('ravi'))
    // console.log(bcrypt.compareSync('ravi',"$2a$10$zDS72OuprWSYJNbeV5FHnO5H49P8kK9Nw92Tr7GRjIZvNpUalx24O"))
    console.log({ userData });
    if (userData) {
      // setLogged(true);
      setUserName(userData.username);
      setPassword(userData.password);
      localStorage.setItem("name", `${userData.username}`);
      localStorage.setItem("pass", `${userData.password}`);

      const OTP = Math.floor(Math.random() * 900000) + 100000;

      localStorage.setItem("OTP", OTP);

      // const randOTP1 = localStorage.getItem("OTP");

      const OTPValidationJSON = {
        subject: "Verify your email",

        html: `<div><h3>Hello User, Verify your email to complete registration</h3><br><h4>Please enter the below OTP in the form</h4></br><p>OTP to verify: ${OTP}</p></div>`,

        otp: OTP,

        email: formData.uname.value.toLocaleLowerCase(),

      
      };

      const emailResponse = await axios.post(
        'https://y6gj6lh2u5.execute-api.us-east-1.amazonaws.com/dev/email', 
        
         OTPValidationJSON
      );

      if (emailResponse.status === 200) {
       
        setShowLoginForm(false)
      }
    } else {
      alert("Invalid User");
    }
  };
  const loginForm = (
    <>
      <form action="" onSubmit={handleLogging}>
        <h1>Login</h1>
        <div className="form-container">
          <div className="input-container">
            <div className="input-box">
              <input
                type="email"
                name="uname"
                id=""
                className="input-field"
                placeholder="Enter Capgemini Email"
                required
              />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="pass"
                id=""
                className="input-field"
                placeholder="Enter Password"
                required
              />
            </div>
          </div>

          <CustomButton name="Login" type="submit"></CustomButton>
        </div>

        {/* <a href="#" style={{color:"red",margin:"17px"}} >Forgot Password?</a> */}
      </form>
    </>
  );
  

 return (
  <>
    {!logged && !localStorage.getItem("logged") ? (
      showLoginForm ? (
        <>
        <form action="" onSubmit={handleLogging}>
          <h1>Login</h1>
          <div className="form-container">
            <div className="input-container">
              <div className="input-box">
                <input
                  type="email"
                  name="uname"
                  id=""
                  className="input-field"
                  placeholder="Enter Capgemini Email"
                  required
                />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  name="pass"
                  id=""
                  className="input-field"
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>
  
            <CustomButton name="Login" type="submit"></CustomButton>
          </div>
  
          {/* <a href="#" style={{color:"red",margin:"17px"}} >Forgot Password?</a> */}
        </form>
          
          <div style={{ margin: '20px 35px', padding: '0px' }}>
            <LoginSocialGoogle
              client_id={"379772538869-g3gubaqif71scj7dn07t13mi4o7j3b8t.apps.googleusercontent.com"}
              scope="openid profile email"
              discoveryDocs="claims_supported"
              access_type="offline"
              onResolve={responseGoogleSuccess} // You should define responseGoogleSuccess function
              onReject={(err) => {
                console.log(err);
              }}
            >
              <GoogleLoginButton style={{ height: '40px' }} />
            </LoginSocialGoogle>
          </div> 
    </>
        )
     : (
        <>
          <h1 style={{ color: 'red' }}>Verification Code</h1>
          <h2 style={{ color: 'green' }}>code was sent to {userName}</h2>

          
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>&nbsp; - &nbsp;</span>}
            renderInput={(props) => (
              <input {...props} style={{ height: '50px', width: '50px', fontSize: '24px', margin: '18px' }} />
            )}
          />
        </>
      )
    ) : (
      <>
        <h1>Welcome {userName || localStorage.getItem("name")}</h1>
        {console.log("hello")}
        <input
          type="button"
          value="Logout"
          className="secondary btn"
          onClick={handleLogout}
        ></input>
        {(password || localStorage.getItem("pass")) &&<h2>Password: {password || localStorage.getItem("pass")}</h2>}
      </>
    )}

   

    {/* {!logged ? :("") } */}
  </>
);
        }
        
export default Login;
