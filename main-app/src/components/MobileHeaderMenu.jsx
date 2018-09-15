import React from 'react'
import { Link } from 'react-router-dom'
export default class MobileHeaderMenu extends React.Component{
    render(){
        return(
            <div>
                <nav class="header-menu">
                    <div>
                        <i class="fas fa-bars" style={{paddingRight:'50px', paddingTop:'10px', fontSize:'2em'}}></i>
                    </div>
                </nav>
                    <div className="top-title"><Link to ="/">People's History of</Link></div>
                    <div className="title"><Link to="/">Los Angeles</Link></div>
            </div>
        )
    }
}