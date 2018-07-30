import React from 'react';
import {Map, TileLayer, Marker} from 'react-leaflet'
import Timeline from './Timeline'

export default class PHLAMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            markers: [],
            location: [],
            loading: true,
            timeline_values: []
        }

        

    }

    componentDidMount(){
        //do a fetch to get the markers around them
        window.navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log('setting state...')
                console.log(pos.coords);

                //make another async call to get the values to fill in for the timeline
                //set the loading state to true until this returns to get
                this.setState({
                    timeline_values: [
                        {label: "1970s", value: 1970},
                        {label: "1980s", value: 1980},
                        {label: "1990s", value: 1990},
                        {label: "2000s", value: 2000},
                        {label: "2010s", value: 2010},

                    ]
                });
                this.setState({
                    location: [ pos.coords.latitude, pos.coords.longitude],
                    loading: false
                })

                

            }, (err) => {
                console.log('could not get current location, so defaulting to center of Los Angeles')
                //make another async call to get the values to fill in for the timeline
                //set the loading state to true until this returns to get
                this.setState({
                    timeline_values: [
                        {label: "1970s", value: 1970},
                        {label: "1980s", value: 1980},
                        {label: "1990s", value: 1990},
                        {label: "2000s", value: 2000},
                        {label: "2010s", value: 2010},

                    ]
                });
                this.setState({
                    location: [ 34.052436, -118.263170],
                    loading: false
                })
            }
        );

        
    }

    changeTimelineDate(date){
        console.log("the date is ")
        console.log(date);
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
                                return <Marker position={elem.location} key={idx}></Marker>
                            })}
                        </Map>
                    </div>
                    <Timeline values={year_labels} startingIndex={1} onTimelineSelect={this.changeTimelineDate} />
                </div>
                ) 
            }
        }
    }

}
