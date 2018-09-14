import React from 'react'

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
            info = <video controls="controls" src="/static/test.mp4" width="400"></video>
        }else{
            info = <p>{this.props.item.context.text}</p>
        }
        return(
            <div>
                <p>{this.props.item.title}, {this.props.item.neighborhood} in {this.props.item.context.year}</p>
                <p><a href="" onClick={this.showContext.bind(this)}>Read More About what going on in L.A. and the world at this time</a></p>
                {info}

            </div>
        )
    }
}