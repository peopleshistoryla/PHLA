import React from 'react'
import fetch from 'cross-fetch'
import Page from './components/Page';
import { Redirect } from 'react-router-dom';

export default class StoryDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            story: null,
            isRedirecting: false
        }
    }

    componentDidMount(){
        fetch("/story/" + this.props.match.params.id)
        .then((res) => {
            if(res.status == 200){
                res.json().then((v) => {
                    this.setState({
                        isLoading:false,
                        story:v
                    });
                });
            }else{
                console.log("could not get the story")
                console.log(res.status)
                this.setState({
                    isRedirecting:true,
                    isLoading:false
                })
            }
        }, (err) => {
            console.log(err);
            this.setState({
                isRedirecting:true,
                isLoading:false
            });
        });
    }

    render(){
        if(this.state.isLoading){
            return(
                <Page>
                    <h1>Loading...</h1>
                </Page>
            )
        }

        if(this.state.isRedirecting){
            return(
                <Redirect to="/error" />
            )
        }
        console.log(this.state.story)
        return(
            <Page>
                <h1 class="headerBox">{this.state.story.title}, {this.state.story.context.year}</h1>
                <div>
                    <div>
                        {this.state.story.context.text}
                    </div>
                    <div>
                        <video src={this.state.story.video.url} width="100%" controls="controls" />
                    </div>
                    
                </div>
            </Page>
        )
    }
}