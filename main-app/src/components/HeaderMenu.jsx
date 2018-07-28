import React from 'react'
import { Link } from 'react-router-dom'

export default class HeaderMenu extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <nav class="header-menu">
                    <div>
                    <Link to="/about">About</Link>
                    <Link to="/submit">Submit A Story</Link>
                    <Link to="/contributors">Contributors</Link>
                    </div>
                </nav>
                <div class="title-menu">
                    <span className="top-title" style={{position:"relative", left:"200px"}}>People's History of</span> <br />
                    <span className="title" style={{fontSize:"75px", marginTop:"20px"}}>Los Angeles</span>
                </div>
            </div>
        )
    }
}