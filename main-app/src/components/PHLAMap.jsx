import React from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet'
import Timeline from './Timeline'
import fetch from 'cross-fetch';

export default class PHLAMap extends React.Component{
    constructor(props){
        super(props);
        const timeline_values= [
            {label: "1970s", value: 1970},
            {label: "1980s", value: 1980},
            {label: "1990s", value: 1990},
            {label: "2000s", value: 2000},
            {label: "2010s", value: 2010},
        ];
        this.state = {
            markers: [],
            location: [],
            loading: true,
            timeline_values: timeline_values,
            selected_time: timeline_values[1]
        }

        

    }
    
    getStoriesByDecade(){
        const self = this;
        console.log("getting stories for " + this.state.selected_time.value)
        fetch("/story/decade/" + this.state.selected_time.value).then(
            (res) => {
                res.json().then((v) => {
                    console.log(v);
                    self.setState({
                        location:[ 34.052436, -118.263170],
                        loading: false,
                        markers: v
                    }); 
                });
            }, 
            (err) => {
                console.log("error occurred loading markers...");
        });
    }

    componentDidMount(){
        const self = this;
        console.log(fetch)
        this.getStoriesByDecade();
        
    }

    changeTimelineDate(date){
        console.log("the date is ")
        console.log(date);
        console.log(this);
        const self = this;
        const selected_date = self.state.timeline_values.filter((res, idx) =>{
            if(idx === date){
                return res
            }
        });
        console.log(selected_date)
        self.setState({
            selected_time: selected_date[0]
        }, (state) => {
            self.getStoriesByDecade()
        })
    }
    render(){
        console.log(this.state)
        const year_labels = this.state.timeline_values.map((v) => {
            return v.label
        })
        if(this.state.loading){
            return(<p>Grabbing your location...</p>)
        }else{
            if(window.outerWidth < 500){
                return(<div>
                    <label>Select a Decade</label>
                    <select onChange={(e) => {
                        this.changeTimelineDate(e.target.value);
                    }}>
                        {year_labels.map((v, idx)=>{
                            return <option value={idx}>{v}</option>
                        })}
                    </select>
                    <div id="mapdiv">
                        <Map center={this.state.location} zoom={13}>
                            <TileLayer attribution="&nbsp; &copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {this.state.markers.map((elem, idx) => {
                                return <Marker position={elem.location} key={idx}></Marker>
                            })}
                        </Map>
                    </div>
                </div>
                ) 
            }else{
                return(<div>
                    <div id="mapdiv">
                        <Map center={this.state.location} zoom={13}>
                            <TileLayer attribution="&nbsp; &copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {this.state.markers.map((elem, idx) => {
                                return <Marker position={elem.location} key={idx}>
                                        <Popup>
                                            <p>{elem.title}</p>
                                            <p>{elem.context.year}</p>
                                        </Popup>
                                </Marker>
                            })}
                        </Map>
                    </div>
                    <Timeline values={year_labels} startingIndex={1} onTimelineSelect={this.changeTimelineDate.bind(this)} />
                </div>
                ) 
            }
        }
    }

}
