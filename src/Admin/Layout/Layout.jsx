import React, { useState } from "react"
import SideBar from "../SideBar/SideBar"
import { Outlet } from "react-router"
import SignoutPopup from "../SignoutPopup/SignoutPopup";
// import '../StyleOfPages/Layout.css'
export default function Layout(){
    const [isVisible, setIsVisible] = useState(false);
    return(
        <div>
            <SignoutPopup isVisible={isVisible} setVisibilityOfPopup={setIsVisible}/>   
            <SideBar setVisibilityOfPopup={setIsVisible}/>
            <main style={{marginLeft: '10px'}}>
                <Outlet/>
            </main>
        </div>
    )
}