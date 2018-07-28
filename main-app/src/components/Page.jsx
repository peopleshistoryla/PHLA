import React from 'react'
import HeaderMenu from '../components/HeaderMenu'
export default function Page(props){
    return(
        <div>
            <HeaderMenu />
            <div className="container">
                {props.children}
            </div>
        </div>
    )
}