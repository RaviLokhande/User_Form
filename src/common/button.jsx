import React from 'react'
import './button.css'
function CustomButton({name, type}) {
    
  return (
    <>
    <input type={type} value = {name} className = 'secondary btn'></input>
    </>
  )
}

export default CustomButton