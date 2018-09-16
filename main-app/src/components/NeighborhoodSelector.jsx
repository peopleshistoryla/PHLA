import React from 'react'
import { Redirect } from 'react-router-dom';

export default class NeighborhoodSelector extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isRedirect: false,
            neighborhoods: [],
            redirectURL: "",
            isLoading: true
        }
    }

    componentDidMount(){
        fetch("/a/neighborhood")
        .then((res) => {
            if(res.status == 200){
                res.json().then((v) => {
                    this.setState({
                        isLoading:false,
                        neighborhoods: v   
                    })
                })
            }else{
                console.log("could not get neighborhoods");
                console.log(res.status);
                this.setState({
                    isLoading: false,
                    isRedirect:true,
                    redirectURL: "/error"
                })
            }
        }, (err) => {
            console.log("could not get neighborhoods");
            console.log(err);
            this.setState({
                isLoading:false,
                isRedirect: true,
                redirectURL: "/error"
            })
        });
    }

    onSelectChange(evt){
        const url = "/neighborhood/" + evt.target.value;        
        this.setState({
            redirectURL:url,
            isRedirect: true
        })
    }
    render(){
        if(this.state.isRedirect){
            return(
                <Redirect to={this.state.redirectURL} />
            )
        }

        if(this.state.isLoading){
            return(
                <h1>Loading...</h1>
            )
        }

        return(
            <div style={{"textAlign":"center"}}>
                <h1>Select A Neighborhood</h1>
                <select onChange={this.onSelectChange.bind(this)}>
                    <option>-- Select A Neighborhood --</option>
                    {this.state.neighborhoods.map((el) => {
                        return (
                            <option value={el.value}>{el.label}</option>
                        )
                    })}
                </select>
            </div>
        )
        
    }
}