import './app.css'

// import { useEffect } from 'preact/hooks'
import CustomButton from './common/button'
import Login from './login/Login'

export function App() {

  // function handleCallbackResponse(response){
  //   console.log("Encoded JWT ID token:"+response.credential);
  // }



  // useEffect(() =>{
  //   google.accounts.id.initialize({
  //     client_id:"379772538869-g3gubaqif71scj7dn07t13mi4o7j3b8t.apps.googleusercontent.com",
  //     callback: handleCallbackResponse

  //   });

  //   google.accounts.id.renderButton(
  //     document.getElementById("SignInDiv"),
  //     {theme:"outline", size:"large"}
  //   )
  // },[]);
  return (
    <>
    
    <Login />
    <br />
    {/* <Sso/> */}
  {/* <div id="signInDiv"></div> */}

 
    </>
  )
}
