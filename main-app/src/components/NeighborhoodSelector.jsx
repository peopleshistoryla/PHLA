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
        const elem = <div>
            <select></select>
        </div>
    }

    onSelectChange(evt){
        const url = "/neighborhood/" + evt.target.value;        
        this.setState({
            redirectURL = url,
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
            <div>
                <select onChange={this.onSelectChange.bind(this, evt)}>
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