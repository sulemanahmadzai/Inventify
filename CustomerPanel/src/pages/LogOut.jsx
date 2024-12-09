import React from 'react'
import {handleLogout} from "../context/AuthContext"
function LogOut() {

  handleLogout();
  return (
    <div>LogOut</div>
  )
}

export default LogOut