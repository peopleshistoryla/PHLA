import React from 'react';
import {Map, TileLayer, Marker} from 'react-leaflet'


export default class PHLAMap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            markers: [],
            location: [],
            loading: true
        }

        

    }

    componentDidMount(){
        //do a fetch to get the markers around them
        window.navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log('setting state...')
                console.log(pos.coords)
                this.setState({
                    location: [ pos.coords.latitude, pos.coords.longitude],
                    loading: false
                })
            }, (err) => {
                console.log('could not get current location, so defaulting to center of Los Angeles')
                this.setState({
                    location: [ 34.052436, -118.263170],
                    loading: false
                })
            }
        );
    }


    render(){
        console.log(this.state)
        if(this.state.loading){
            return(<p>Grabbing your location...</p>)
        }else{
        return(<div id="mapdiv"><Map center={this.state.location} zoom={13}>
            <TileLayer attribution="&nbsp; &copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {this.state.markers.map((elem, idx) => {
                return <Marker position={elem.location} key={idx}></Marker>
            })}
        </Map></div>) 
        }
        
    }

}
