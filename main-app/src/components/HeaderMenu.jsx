import React from 'react'
import { Link } from 'react-router-dom'
import MobileHeaderMenu from './MobileHeaderMenu'
export default class HeaderMenu extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        if(window.outerWidth < 500){
            return(
                <MobileHeaderMenu />
            )
        }else{
            return(
                <div>
                    <nav class="header-menu">
                        <div>
                        <Link to="/about">About</Link>
                        <Link to="/submit">Submit A Story</Link>
                        <Link to="/contributors">Contributors</Link>
                        </div>
                    </nav>
                        <span className="top-title"><Link to="/">People's History of</Link></span> <br />
                        <span className="title"><Link to="/">Los Angeles</Link></span>
                </div>
            )
        }
    }
}