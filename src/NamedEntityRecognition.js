import React, {Component} from 'react';
import './App.css';

class NamedEntityRecognition extends Component {

    constructor(props) {
        super(props);
        this.loadImage = this.loadImage.bind(this);
        this.convertImage = this.convertImage.bind(this);
        this.addImageCanvas = this.addImageCanvas.bind(this);
        this.state = {
            imageBase64: ''
        };
    }

    loadImage() {
        //Loading and appending external resource
        let img = document.createElement('img');
        img.id = "loadedImage";
        img.crossOrigin="Anonymous";
        img.src = "https://upload.wikimedia.org/wikipedia/commons/d/dd/Big_%26_Small_Pumkins.JPG";
        // img.src = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80";
        let element = document.getElementById('loaded_container').appendChild(img);
        console.log(element);
    }

    addImageCanvas(){
        let image = document.getElementById('loadedImage');
        let imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");
        imgCanvas.width = image.width;
        imgCanvas.height = image.height;
        imgContext.drawImage(image, 0, 0, image.width, image.height);
        document.getElementById('canvas_container').appendChild(imgCanvas);
    }

    convertImage(){
        let image = document.getElementById('loadedImage');
        let imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");
        imgCanvas.width = image.width;
        imgCanvas.height = image.height;
        imgContext.drawImage(image, 0, 0, image.width, image.height);
        let selectedFile = imgCanvas.toDataURL("image/png");

        // Appending converted image
        let img = document.createElement('img');
        img.id = "convertedImage";
        img.src = selectedFile;
        document.getElementById('converted_container').appendChild(img);
        console.log(selectedFile);

    }

    render() {
        return (
            <div>
                <button style={{fontSize: 40}} onClick={this.loadImage}>LOAD EXTERNAL RESOURCE</button>
                <div id="loaded_container"></div>
                <br/>
                <br/>
                <button style={{fontSize: 40}} onClick={this.addImageCanvas}>ADD CANVAS IMAGE TO DOM</button>
                <div id="canvas_container"></div>
                <br/>
                <br/>
                <button style={{fontSize: 40}} onClick={this.convertImage}>SHOW CONVERTED IMAGE</button>
                <div id="converted_container"></div>
                <br/>
            </div>
        );
    }
}

export default NamedEntityRecognition;