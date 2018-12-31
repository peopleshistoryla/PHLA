import React from 'react'
import { Link } from 'react-router-dom';

export default class StoryOverlay extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showContext: false
        }
    }

    showContext(evt){
        evt.preventDefault();
        this.setState({
            showContext: !this.state.showContext
        })
    }
    render(){
        let info = null;
        if(!this.state.showContext){
            info = <video src={this.props.item.video.url} width="400"></video>
        }else{
            info = <p>{this.props.item.context.text}</p>
        }
        const url = "/story/" + this.props.item._id;
        return(
            <div>
                <p>{this.props.item.title}, {this.props.item.neighborhood} in {this.props.item.context.year}</p>
                <p><Link to={url}>View video and read about what was going on in the city at the time</Link></p>
                {info}

            </div>
        )
    }
}