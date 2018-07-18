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
                    <Link to="/submit">Submit Your Story</Link>
                    <Link to="/contributors">Contributors</Link>
                    </div>
                </nav>
                <div class="title-menu">
                    <span>People's History of Los Angeles</span>
                </div>
            </div>
        )
    }
}