import React from 'react'

export default class MobileHeaderMenu extends React.Component{
    render(){
        return(
            <div>
                <nav class="header-menu">
                    <div>
                        <i class="fas fa-bars" style={{paddingRight:'50px', paddingTop:'10px', fontSize:'2em'}}></i>
                    </div>
                </nav>
                    <div className="top-title">People's History of</div>
                    <div className="title">Los Angeles</div>
            </div>
        )
    }
}