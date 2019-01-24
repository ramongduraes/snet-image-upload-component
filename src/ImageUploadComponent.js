// imports the React Javascript Library
import React from "react";
// Structural
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
// Buttons and clickable components
import IconButton from "@material-ui/core/IconButton";
// Input
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
// Icons
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
// Loading
import CircularProgress from '@material-ui/core/CircularProgress';
// Transitions
import Fade from '@material-ui/core/Fade';
// Colors
import {lightBlue, grey, red, blue} from "@material-ui/core/colors";
// For tab views
import {DropzoneArea} from 'material-ui-dropzone'
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Hidden from "@material-ui/core/Hidden";
import AppBar from '@material-ui/core/AppBar';
import {Toolbar} from "@material-ui/core";

// Global variables
const snet_blue = blue[500];
const snet_grey = grey[500];
const snet_error = red[500];
const snet_background_grey = grey[200];
const errorMessage =
    "Incorrect image URL or permission denied by image server." + <br/> +
    "Make sure the URL provided is correct or try uploading the image from a file or another server.";
const spacingUnit = 8;
const themeDirection = 'rtl';

// TODO : handle upload error
class SNETImageUpload extends React.Component {

    constructor(props) {
        super(props);
        // It is the same thing, only difference is Component where we do the binding.
        // Component is lower in the tree, and now button has the logic how to open the screen.

        this.state = {
            value: 0, // Current tab value
            mainState: "initial", // initial, search, gallery, loading, uploaded, error
            searchText: null,
            selectedFile: null,
            filename: null,
        };

        this.urlCallback = this.urlCallback.bind(this);
    }


    setLoadingState() {
        this.setState({
            mainState: "loading",
        })
    };


    /* ----------------
       - IMAGE UPLOAD -
    *  ----------------*/

    handleDropzoneUpload(files) {
        this.setLoadingState();

        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function () {
            this.setState({
                mainState: "uploaded", // initial, search, gallery, loading, uploaded, error
                searchText: null,
                selectedFile: [reader.result], //TODO: get image base64
                filename: null, //TODO: Get filename
            });
            console.log(this.state.selectedFile[0]);
        }.bind(this);
    }

    renderUploadTab() {
        return (
            <DropzoneArea
                color="inherit"
                filesLimit={1}
                acceptedFiles={["image/jpg", "image/jpeg", "image/png", "image/bmp"]}
                onChange={this.handleDropzoneUpload.bind(this)}
            />
        );
    }

    /* --------------------
       - URL IMAGE SEARCH -
    *  --------------------*/

    urlCallback(data, filename) {
        console.log(data);
        this.setState({
            selectedFile: data,
            mainState: "uploaded",
            filename: filename,
            searchText: null,
        });
    };

    toDataUrl = (src, callback, outputFormat) => {
        const filename = src.substring(src.lastIndexOf("/") + 1);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onerror = this.handleError;
        img.onload = function () {
            const canvas = document.createElement("canvas"),
                context = canvas.getContext('2d');
            let dataURL;
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            context.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL, filename);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = src;
        }
    };

    searchTextUpdate = event => {
        this.setState({
            searchText: event.target.value,
        });
    };

    handleSearchSubmit = () => {
        // Does nothing if input is null
        if (this.state.searchText !== null) {
            this.setLoadingState();
            const file = this.state.searchText;
            this.toDataUrl(file, this.urlCallback);
        }
    };

    // TODO: deal with non-image URLs and strings
    renderSearchTab() {
        return (
            <Grid
                container
                spacing={24}
                direction="column"
                alignItems="center"
            >
                <Grid item xs={12}/>
                <Grid item xs={12}/>
                <Grid item xs={12}>
                    <TextField
                        style={{
                            margin: spacingUnit,
                            flexBasis: 200,
                        }}
                        variant="outlined"
                        type="text"
                        label="Image URL"
                        onChange={this.searchTextUpdate}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        style={{
                                            color: snet_blue,
                                            margin: 10
                                        }}
                                        onClick={this.handleSearchSubmit}
                                    >
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12}/>
            </Grid>
        );
    }

    /* -----------------
       - IMAGE GALLERY -
    *  -----------------*/

    handleGalleryImageClick(image) {
        this.setLoadingState();

        const file = image.url;
        const filename = image.url.substring(image.url.lastIndexOf("/") + 1);
        console.log(filename);
        this.toDataUrl(file, this.urlCallback);
    };

    // TODO: loading taking too long bug
    renderGalleryTab() {

        return (
            <GridList
                style={{
                    flexWrap: 'nowrap',
                    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
                    transform: 'translateZ(0)',
                }}
            >
                {this.props.imageGallery.map((url, i) => (
                    <GridListTile key={i}>
                        <img
                            src={url}
                            alt={"Gallery Image " + i}
                            onClick={() => this.handleGalleryImageClick({url})}
                        />
                    </GridListTile>
                ))}
            </GridList>
        );
    };

    // TODO: make loading work
    renderLoadingState() {
        return (
            <Grid
                container
                spacing={24}
                direction="column"
                alignItems="center"
            >
                <Grid item xs={12}/>
                <Grid item xs={12}/>
                <Grid item xs={12}>
                    <Fade
                        in={this.state.mainState === "loading"}
                        unmountOnExit
                    >
                        <CircularProgress
                            style={{
                                color: snet_blue,
                                margin: 10
                            }}
                        />
                    </Fade>
                </Grid>
                <Grid item xs={12}/>
            </Grid>

        );
    };

    /* ------------------
       - IMAGE UPLOADED -
    *  ------------------*/

    handleImageReset = () => {
        console.log("Click!");
        this.setState({
            mainState: "initial", // initial, search, gallery, loading, uploaded, error
            searchText: null,
            selectedFile: null,
            filename: null,
        });
    };


    // TODO: add filename, reset icon and reset tooltip
    renderUploadedState() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <div id="uploadedImageContainer">
                        <img
                            alt="Service input"
                            width="100%"
                            src={this.state.selectedFile}
                            onError={this.handleError}
                            id="loadedImage"
                            crossOrigin="anonymous"
                        />
                    </div>
                </Grid>
                <AppBar
                    position="relative"
                    style={{
                        top: 'auto',
                        bottom: 0,
                        backgroundColor: snet_background_grey,
                        textColor: "black",
                    }}
                    color="inherit"
                >
                    <Toolbar
                        color="white"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography color="inherit">
                            {"File: " + this.state.filename}
                        </Typography>
                        <div>
                            <IconButton
                                style={{
                                    color: "gray",
                                    margin: 10,
                                    right: 0,
                                }}
                                onClick={this.handleImageReset}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </Grid>
        );
    };

    /* ---------------
       - ERROR STATE -
    *  ---------------*/

    // TODO: implement specify error message, reset to initial state.
    handleError = (e) => {
        this.setState({
            mainState: "error",
        });
        this.renderErrorState(e);
    };

    renderErrorState(error) {
        console.log(error);
        return (
            <Grid
                container
                spacing={24}
                direction="column"
                alignItems="center"
            >
                <Grid item xs={12}/>
                <Grid item xs={12}/>
                <Grid item xs={12}>
                    <Fade
                        in={this.state.mainState === "error"}
                        unmountOnExit
                    >
                        <IconButton
                            style={{
                                color: "red",
                            }}
                            aria-label="Close"
                            onClick={this.handleImageReset}
                        >
                            <ErrorOutlinedIcon/>
                        </IconButton>
                        <Typography
                            style={{
                                color: snet_error,
                            }}
                        >
                            {errorMessage}
                            }}
                        </Typography>
                    </Fade>
                </Grid>
                <Grid item xs={12}/>
                <AppBar
                    position="relative"
                    style={{
                        top: 'auto',
                        bottom: 0,
                        backgroundColor: snet_background_grey,
                        textColor: "black",
                    }}
                    color="inherit"
                >
                    <Toolbar
                        color="white"
                        style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography color="inherit">
                            {"File: " + this.state.filename}
                        </Typography>
                        <div>
                            <IconButton
                                style={{
                                    color: "gray",
                                    margin: 10,
                                    right: 0,
                                }}
                                onClick={this.handleImageReset}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </Grid>
        );
    };

    /* -----------------
       - INITIAL STATE -
    *  -----------------*/

    handleTabChange = (event, value) => {
        this.setState({
            value: value,
            mainState: "initial",
            selectedFile: null,
            filename: null,
        });
    };

    TabContainer = ({children, dir}) => {
        return (
            <Typography component="div" dir={dir} style={{padding: 8 * 3}}>
                {children}
            </Typography>
        );
    };


    renderTabs() {
        return (

            <SwipeableViews
                axis='x'
                index={this.state.value}
            >
                <this.TabContainer dir={themeDirection}>
                    {this.renderUploadTab()}
                </this.TabContainer>
                <this.TabContainer dir={themeDirection}>
                    {this.renderSearchTab()}
                </this.TabContainer>
                <this.TabContainer dir={themeDirection}>
                    {this.renderGalleryTab()}
                </this.TabContainer>
            </SwipeableViews>

        );
    };

    render() {
        return (
            <div>
                <Paper square>
                    <Grid
                        container
                        spacing={24}
                    >
                        <Grid item xs={4}>
                            <Typography
                                variant="h6"
                                color="inherit"
                                noWrap
                                style={{
                                    color: "black",
                                    fontFamily: "Montserrat",
                                    align: "center",
                                    padding: spacingUnit,
                                }}
                            >
                                {this.props.componentName}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            {/*TODO: Set tab color properly*/}
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: snet_blue,
                                    }
                                }}
                            >
                                <Tab
                                    value={0}
                                    style={{color: this.state.value === 0 ? snet_blue : snet_grey}}
                                    label="Upload"
                                />
                                <Tab
                                    value={1}
                                    style={{color: this.state.value === 1 ? snet_blue : snet_grey}}
                                    label="URL"
                                />
                                {
                                    // Renders image galleries if non-empty list of URLs is passed
                                    this.props.imageGallery.length > 0 &&
                                    <Tab value={2}
                                         style={{color: this.state.value === 2 ? snet_blue : snet_grey}}
                                         label="Gallery"
                                    />
                                }
                            </Tabs>
                        </Grid>
                        <Grid item xs={1}/>
                        <Hidden xsUp>
                            <Grid item xs={2}>
                                <IconButton>
                                    <MoreVertIcon/>
                                </IconButton>
                            </Grid>
                        </Hidden>
                        <Grid item xs={12} style={{backgroundColor: snet_background_grey}}>
                            {
                                (this.state.mainState === "initial" && this.renderTabs()) ||
                                (this.state.mainState === "loading" && this.renderLoadingState()) ||
                                (this.state.mainState === "uploaded" && this.renderUploadedState()) ||
                                (this.state.mainState === "error" && this.renderErrorState())
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    };
}

SNETImageUpload.defaultProps = {
    imageGallery: [],
    componentName: "Input Image",
};

export default (SNETImageUpload);
// TODO: Test base64 image size vs its real size (downloaded from google)
// TODO: set component size, relative sizes
// TODO: verify gallery links