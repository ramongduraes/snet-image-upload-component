// imports the React Javascript Library
import React from "react";
// Export with styles
import { withStyles } from "@material-ui/core/styles";
// Structural
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
// Card related
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
// Buttons and clickable components
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
// Input
import InputBase from "@material-ui/core/InputBase";
// Icons
import SearchIcon from "@material-ui/icons/Search";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import CollectionsIcon from "@material-ui/icons/Collections";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import ReplayIcon from "@material-ui/icons/Replay";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
// Colors
import blue from "@material-ui/core/colors/blue";
// Base64
import fetch from "node-fetch";
import fileSystem from "fs";
import path from "path";
// Global variables
const snet_blue = "#1F8CFB";

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end"
    },
    icon: {
        margin: theme.spacing.unit * 2
    },
    iconHover: {
        margin: theme.spacing.unit * 2,
        "&:hover": {
            color: blue[600]
        }
    },
    cardHeader: {
        textalign: "center",
        align: "center",
        backgroundColor: "white"
    },
    input: {
        display: "none"
    },
    title: {
        color: blue[800],
        fontWeight: "bold",
        fontFamily: "Montserrat",
        align: "center"
    },
    button: {
        color: snet_blue,
        margin: 10
    },
    secondaryButton: {
        color: "gray",
        margin: 10
    },
    errorButton: {
        color: "red",
    },
    typography: {
        margin: theme.spacing.unit * 2,
        backgroundColor: "default"
    },

    searchRoot: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400
    },
    searchInput: {
        marginLeft: 8,
        flex: 1
    },
    searchIconButton: {
        padding: 10
    },
    searchDivider: {
        width: 1,
        height: 28,
        margin: 4
    }
});


function validUrl (url) {
    return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(url);
}

function base64ToNode (buffer) {
    const base64return = buffer.toString("base64");
    console.log(base64return);
    return base64return;
}

function validTypeImage (image) {
    return /(\.(jpg)|\.(png)|\.(jpeg))/gi.test(image);
}

function readFileAndConvert (fileName) {
    if (fileSystem.statSync(fileName).isFile()) {
        return base64ToNode(fileSystem.readFileSync(path.resolve(fileName)).toString("base64"));
    }
    return null;
}

function isImage (urlOrImage) {
    if (validTypeImage(urlOrImage)) {
        return Promise.resolve(readFileAndConvert(urlOrImage));
    } else {
        return Promise.reject("[*] Occurent some error... [validTypeImage] == false");
    }
}

function imageToBase64 (urlOrImage) {
    if (validUrl(urlOrImage)) {
        console.log("Valid URL!");
        return fetch(urlOrImage).then(function(response){
            return response.buffer()
        }).then(base64ToNode);
    } else {
        console.log("Invalid URL!");
        return isImage(urlOrImage);
    }
}

/*, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "no-cors", // no-cors, cors, *same-origin
            //cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: "same-origin", // include, *same-origin, omit
            //headers: {
            //    "Content-Type": "application/json",
            //    // "Content-Type": "application/x-www-form-urlencoded",
            //},
            //redirect: "follow", // manual, *follow, error
            //referrer: "no-referrer", // no-referrer, *client
        }*/

function toDataUrl(src, callback, outputFormat) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        const canvas = document.createElement('CANVAS');
        const ctx = canvas.getContext('2d');
        let dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
    }
}

class ImageUploadCard extends React.Component {

    constructor(props) {
        super(props);
        // It is the same thing, only difference is Component where we do the binding.
        // Component is lower in the tree, and now button has the logic how to open the screen.

        this.state = {
            mainState: "initial", // initial, search, gallery, uploaded, error
            imageUploaded: 0,
            selectedFile: null,
            searchText: null,
        };

        this.urlCallback = this.urlCallback.bind(this);
    }

    handleUploadClick = event => {

        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function() {
            this.setState({
                selectedFile: [reader.result],
                mainState: "uploaded",
                imageUploaded: 1,
            });
            console.log(this.state.selectedFile[0]);
        }.bind(this);

    };

    handleSearchClick = () => {
        this.setState({
            mainState: "search"
        });
    };

    handleGalleryClick = () => {
        this.setState({
            mainState: "gallery"
        });
    };

    renderInitialState() {
        const { classes } = this.props;

        return (
            <CardContent>
                <Grid container justify="center" alignItems="center">
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={this.handleUploadClick}
                    />
                    <label htmlFor="contained-button-file">
                        <Fab component="span" className={classes.button}>
                            <AddPhotoAlternateIcon />
                        </Fab>
                    </label>
                    <Fab className={classes.button} onClick={this.handleSearchClick}>
                        <SearchIcon />
                    </Fab>
                    <Fab className={classes.button} onClick={this.handleGalleryClick}>
                        <CollectionsIcon />
                    </Fab>
                </Grid>
            </CardContent>
        );
    }

    searchTextUpdate = event => {
        this.setState({
            searchText: event.target.value,
        });

        console.log(event.target.value);
    };


    urlCallback(data){
        console.log(data);
        this.setState({
            selectedFile: data,
            mainState: "uploaded",
            imageUploaded: 1,
            //filename: filename,
            searchText: null,
        });
    }

    handleSearchSubmit = () => {
        const file = this.state.searchText;

        const base64img = imageToBase64(file);

        console.log(base64img);
        //toDataUrl(proxyURL + file, this.urlCallback);
        //const filename = file.substring(file.lastIndexOf("/") + 1);
        //console.log(filename);

        /*this.setState({
            selectedFile: this.state.searchText,
            mainState: "uploaded",
            imageUploaded: 1,
            //filename: filename,
            searchText: null,
        });*/

    };

    handleSearchClose = () => {
        this.setState({
            mainState: "initial",
            searchText: null,
            filename: null,
        });
    };

    renderSearchState() {
        const { classes } = this.props;

        return (
            <Paper className={classes.searchRoot} elevation={1}>
                <InputBase className={classes.searchInput} placeholder="Image URL" onChange={this.searchTextUpdate}/>
                <IconButton
                    className={classes.button}
                    aria-label="Search"
                    onClick={this.handleSearchSubmit}
                >
                    <SearchIcon />
                </IconButton>
                <Divider className={classes.searchDivider} />
                <IconButton
                    color="primary"
                    className={classes.secondaryButton}
                    aria-label="Close"
                    onClick={this.handleSearchClose}
                >
                    <CloseIcon />
                </IconButton>
            </Paper>
        );
    }

    handleAvatarClick(value) {
        const proxyURL = 'https://cors-anywhere.herokuapp.com/';
        const file = value.url;
        const filename = value.url.substring(value.url.lastIndexOf("/") + 1);
        console.log(filename);
        toDataUrl(proxyURL + file, this.urlCallback);


        /*this.setState({
            mainState: "uploaded",
            imageUploaded: true,
            selectedFile: value.url,
            fileReader: undefined,
            filename: filename
        });*/
    }

    renderGalleryState() {
        const { classes } = this.props;
        const listItems = this.props.imageGallery.map((url,i) => (
            <div
                key={i}
                onClick={() => this.handleAvatarClick({ url })}
                style={{
                    padding: "5px 5px 5px 5px",
                    cursor: "pointer"
                }}
            >
                <Avatar src={url} />
            </div>
        ));

        return (
            <Grid>
                {listItems}
                <IconButton
                    color="primary"
                    className={classes.secondaryButton}
                    aria-label="Close"
                    onClick={this.handleSearchClose}
                >
                    <ReplayIcon />
                </IconButton>
            </Grid>
        );
    }

    handleImageReset = () => {
        console.log("Click!");
        this.setState({
            mainState: "initial",
            selectedFile: null,
            imageUploaded: 0,
            filename: null,
        });
    };

    renderUploadedState() {
        const { classes } = this.props;

        return (
            <CardActionArea onClick={this.handleImageReset}>
                <img
                    alt="Uploaded file or url"
                    width="100%"
                    className={classes.media}
                    src={this.state.selectedFile}
                    onError={this.handleError}
                    crossOrigin="anonymous"
                />
            </CardActionArea>
        );
    }

    handleError() {
        this.setState({
            mainState: "error",
        })
    }

    renderErrorState() {
        const { classes } = this.props;

        return (
            <CardActionArea onClick={this.handleImageReset}>
                <IconButton
                    color="primary"
                    className={classes.errorButton}
                    aria-label="Close"
                    onClick={this.handleSearchClose}
                >
                    <ErrorOutlinedIcon />
                </IconButton>
            </CardActionArea>
        );
    }

    render() {
        const { classes} = this.props;

        return (
            <div className={classes.root}>
                <Card className={this.props.cardName}>
                    {(this.state.mainState === "initial" && this.renderInitialState()) ||
                    (this.state.mainState === "search" && this.renderSearchState()) ||
                    (this.state.mainState === "gallery" && this.renderGalleryState()) ||
                    (this.state.mainState === "uploaded" && this.renderUploadedState()) ||
                    (this.state.mainState === "error" && this.renderErrorState())}
                </Card>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ImageUploadCard);
