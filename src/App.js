import React, {Component} from 'react';
import './App.css';
import ImageUploadComponent from "./ImageUploadComponent";

const imageGallery = [
    "http://cdn01.cdn.justjared.com/wp-content/uploads/headlines/2018/02/skyscraper-trailer-social.jpg",
    "https://static2.yan.vn/EYanNews/201807/the-tallest-building-in-vietnam-and-southeast-asia-is-almost-finished-e0926100.jpg",
    "https://raw.githubusercontent.com/dxyang/StyleTransfer/master/style_imgs/mosaic.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    "https://raw.githubusercontent.com/ShafeenTejani/fast-style-transfer/master/examples/dora-maar-picasso.jpg",
    "https://pbs.twimg.com/profile_images/925531519858257920/IyYLHp-u_400x400.jpg",
    "https://raw.githubusercontent.com/ShafeenTejani/fast-style-transfer/master/examples/dog.jpg",
    "http://r.ddmcdn.com/s_f/o_1/cx_462/cy_245/cw_1349/ch_1349/w_720/APL/uploads/2015/06/caturday-shutterstock_149320799.jpg",
    "https://raw.githubusercontent.com/dxyang/StyleTransfer/master/style_imgs/mosaic.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    "https://raw.githubusercontent.com/ShafeenTejani/fast-style-transfer/master/examples/dora-maar-picasso.jpg",
    "https://pbs.twimg.com/profile_images/925531519858257920/IyYLHp-u_400x400.jpg",
    "https://raw.githubusercontent.com/ShafeenTejani/fast-style-transfer/master/examples/dog.jpg",
    "http://r.ddmcdn.com/s_f/o_1/cx_462/cy_245/cw_1349/ch_1349/w_720/APL/uploads/2015/06/caturday-shutterstock_149320799.jpg",
];


class App extends Component {

    getData(imageData) {
        console.log("Parent received:");
        console.log(imageData);
    }

    render() {
        return (
            <div className="App" style={{height: "2000px", width:"80%", backgroundColor: "green", position: "relative"}}>
                <ImageUploadComponent
                    imageDataFunc={this.getData}
                    imageName="Input Image"
                    imageGallery={imageGallery}
                    galleryCols={3}
                    height={180}
                    width="90%"
                    // infoTip="Upload the image that will be processed by the service."
                />
            </div>
        );
    }
}

//
export default App;