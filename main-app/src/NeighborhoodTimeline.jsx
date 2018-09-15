import React from 'react';
import Page from './components/Page';
import fetch from 'cross-fetch';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Link } from 'react-router-dom'
import FaceIcon from '@material-ui/icons/Face';


export default class NeighborhoodTimeline extends React.Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            stories: [],
            neighborhood: null,
            isLoading: true
        }
    }

    componentDidMount(){
        var self = this;
        fetch("/neighborhood/" + this.props.match.params.id)
        .then((res) =>{
            if(res.status == 200){
                res.json().then((v) => {
                    self.setState({
                        stories: v.items,
                        neighborhood: v.neighborhood,
                        isLoading:false
                    })
                });
            }else{
                throw new Error("could not get neighborhood info")
            }
        }, (err) => {
            throw new Error("could not get neighborhood info")
        })
    }

    render(){
        if(this.state.isLoading){
            return(
                <Page>
                    <h1>Loading...</h1>
                </Page>
            )
        }
        return(
            <Page>
                <h2>{this.state.neighborhood.label}</h2>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut aperiam exercitationem necessitatibus enim quos nemo beatae ducimus, nisi fugit vitae voluptas error unde cupiditate doloribus reiciendis sed mollitia quam dolore.</p>
                <VerticalTimeline>
                    {this.state.stories.map((v) => {
                        const sid = "/story/" + v._id;
                        return(<VerticalTimelineElement
                        date={v.context.year}
                        icon={<FaceIcon />}
                        iconStyle={{background: '#2196f3', color: '#fff'}}
                        >
                            <p><Link to={sid}>{v.title}</Link></p>
                            <video src="/static/test.mp4" width="100%"></video>
                        </VerticalTimelineElement>)
                    })}
                    
                </VerticalTimeline>
            </Page>
        )
    }
}