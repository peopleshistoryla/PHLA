import React from 'react';
import Page from './components/Page';
import jsQR from "jsqr";

export default class Scan extends React.Component{
    constructor(props){
        super(props);
        this.vidRef = React.createRef();
        this.canvasRef = React.createRef();
        this.state = {
            redirectURL:null
        }
    }

    componentDidMount(){
        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {

            // First get ahold of the legacy getUserMedia, if present
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
        }

        navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}})
            .then((stream) => {
                const self = this;

                this.vidRef.current.onloadeddata = function(){
                    self.vidRef.current.play();
                    requestAnimationFrame(self.tick.bind(self))
                }
                this.vidRef.current.setAttribute("playsinline", true);
                this.vidRef.current.srcObject = stream;
                this.vidRef.current.width = 250;
                this.vidRef.current.height = 250;
                console.log("--------------------------")
                console.log(this.vidRef.current.width);
                console.log(this.vidRef.current.height);
                console.log("---------------------------");
                
            }, (err) => {
                alert("Cannnot access camera info.");
            })
        }

    tick(){
            let canvas = this.canvasRef.current.getContext('2d');
            this.canvasRef.current.width = this.vidRef.current.width;
            this.canvasRef.current.height = this.vidRef.current.height;
            canvas.drawImage(this.vidRef.current, 0, 0, this.canvasRef.current.width,
                this.canvasRef.current.height);
            let imageData = canvas.getImageData(0,0, this.canvasRef.current.width,
                this.canvasRef.current.height);
            //console.log(imageData)
            let code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert"
            });

            if(code){
                console.log(code);
                window.location.href = code.data;
            }
            
        
        requestAnimationFrame(this.tick.bind(this));
    }

    render(){
        return(
            <Page>
                <video id="preview" style={{"display":"none"}} ref={this.vidRef}></video>
                <canvas ref={this.canvasRef} style={{"width":"100%"}}></canvas>
            </Page>
        )
    }
}