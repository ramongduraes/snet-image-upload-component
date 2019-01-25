// imports the React Javascript Library
import React from "react";
// Themes
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
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
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
// Colors
import {grey, red, blue} from "@material-ui/core/colors";
// For tab views
import { DropzoneArea } from 'material-ui-dropzone'
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Hidden from "@material-ui/core/Hidden";
import AppBar from '@material-ui/core/AppBar';
import {Toolbar} from "@material-ui/core";
// Error Snackbar
import Snackbar from '@material-ui/core/Snackbar';
// Card
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import ImageUploadComponent from "./App";
// Global variables
const snet_blue = blue[500];
const snet_grey = grey[500];
const snet_red = red[500];
const snet_background_red = red[100];
const snet_background_grey = grey[200];
const errorMessage = "Incorrect image URL or permission denied by image server.";
const spacingUnit = 8;
const themeDirection = 'ltr';
const snet_fontFamily = "Montserrat";

const theme = createMuiTheme({
    fontFamily: "Montserrat",
    palette: {
        primary: blue,
        error: red,
    },
    typography: {useNextVariants: true},
});


// TODO : handle upload error
class SNETImageUpload extends React.Component {

    constructor(props) {
        super(props);
        // It is the same thing, only difference is Component where we do the binding.
        // Component is lower in the tree, and now button has the logic how to open the screen.

        this.state = {
            value: 0, // Current tab value
            mainState: "initial", // initial, loading, uploaded
            searchText: null,
            selectedFile: null,
            filename: null,
            displayError: false,
        };
        this.tabStyle = {
            padding: 8 * 3,
            height: this.props.height
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

        reader.onloadend = () => {
            this.setState({
                mainState: "uploaded", // initial, loading, uploaded
                searchText: null,
                selectedFile: [reader.result],
                filename: file.name,
            });
            console.log(this.state.selectedFile[0]);
        };
    };

    renderUploadTab() {
        return (
            <DropzoneArea
                filesLimit={1}
                acceptedFiles={["image/jpg", "image/jpeg", "image/png", "image/bmp"]}
                onChange={this.handleDropzoneUpload.bind(this)}
                style={{
                    backgroundColor: "blue",
                    height: this.props.height + "px"}}
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
                direction="row"
                justify="center"
                alignItems="center"
                style={{
                    flexGrow: 1,
                    backgroundColor: "blue",
                    height: this.props.height + "px"
                }}
            >
                <Grid item xs={12} style={{backgroundColor: "red"}}>
                    <MuiThemeProvider theme={theme}>
                        <TextField
                            style={{
                                width: "80%",
                                primary: snet_blue,
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
                                                margin: 10,
                                            }}
                                            onClick={this.handleSearchSubmit}
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </MuiThemeProvider>
                </Grid>
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
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                overflow: 'hidden',
            }}>
                <GridList
                    cellHeight={150}
                    cols={this.props.galleryCols}
                    spacing={spacingUnit}
                    style={{
                        width: 500,
                        height: this.props.height,
                    }}
                >
                    {this.props.imageGallery.map((url, i) => (
                        <Grow
                            in={this.state.value === 2}
                            style={{transformOrigin: '0 0 0'}}
                            {...(this.state.value === 2 ? {timeout: i * 1000} : {})}
                            key={i}
                        >
                            <GridListTile key={i}>
                                <img
                                    src={url}
                                    alt={"Gallery Image " + i}
                                    onClick={() => this.handleGalleryImageClick({url})}
                                />
                            </GridListTile>
                        </Grow>
                    ))}
                </GridList>
            </div>
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
            displayError: false,
        });
    };

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
    handleError = (e) => {
        this.setState({
            mainState: "initial",
            value: 1,
            searchText: null,
            selectedFile: null,
            filename: null,
            displayError: true,
        });
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
            <div style={{
                position: 'relative',
                overflow: 'hidden'
            }} >
                <SwipeableViews
                    axis='x'
                    index={this.state.value}
                >
                    <div style={this.tabStyle}>
                        {this.renderUploadTab()}
                    </div>
                    <div style={this.tabStyle}>
                        {this.renderSearchTab()}
                    </div>
                    <div style={this.tabStyle}>
                        {this.renderGalleryTab()}
                    </div>
                </SwipeableViews>
                <Snackbar
                    style={{
                        position: "absolute",
                        width: "100%"
                    }}

                    ContentProps={{backgroundColor: "red"}}
                    open={this.state.displayError}
                    autoHideDuration={1}
                    message={errorMessage}
                    TransitionComponent={Slide}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => {
                                this.setState({displayError: false})
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />
            </div>
        );
    };

    render() {
        return (
            <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  style={{
                      width: this.props.width + '%',
                      backgroundColor: "blue",
                  }}
            >
                <Grid item xs={12} style={{
                    height: '64px',
                    backgroundColor: "yellow",
                }}>
                    <AppBar
                        position="relative"
                        style={{
                            backgroundColor: "white",
                            textColor: "black",
                        }}
                    >
                        <Toolbar style={{justifyContent: 'space-between',}}>
                            <Typography
                                variant="h6"
                                color="inherit"
                                noWrap
                                style={{
                                    color: "black",
                                    font: snet_fontFamily,
                                    align: "center",
                                    padding: 1,
                                }}
                            >
                                {this.props.componentName}
                            </Typography>
                            <MuiThemeProvider theme={theme}>
                                <Tabs
                                    value={this.state.value}
                                    onChange={this.handleTabChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="scrollable"
                                    scrollButtons="on"
                                    style={{
                                        color: snet_grey,
                                    }}
                                    // TabIndicatorProps={{ style: { backgroundColor: snet_blue } }}
                                >
                                    {/*Renders image galleries if non-empty list of URLs is passed
                                    // style={{color: this.state.value === 2 ? snet_blue : snet_grey}}*/}
                                    <Tab value={0} label={<span style={{fontFamily: "Montserrat"}}>Upload</span>}/>
                                    <Tab value={1} label="URL"/>
                                    {this.props.imageGallery.length > 0 && <Tab value={2} label="Gallery"/>}
                                </Tabs>
                            </MuiThemeProvider>
                            <div>
                                {/*TODO: Implement hidden button. Added according of greg's suggestions*/}
                                <Hidden xsUp>
                                    <IconButton style={{right: 0}}>
                                        <MoreVertIcon/>
                                    </IconButton>
                                </Hidden>
                            </div>
                        </Toolbar>
                    </AppBar>
                </Grid>
                <Grid item xs={12} style={{backgroundColor: snet_background_grey}}>
                    {
                        (this.state.mainState === "initial" && this.renderTabs()) ||
                        (this.state.mainState === "loading" && this.renderLoadingState()) ||
                        (this.state.mainState === "uploaded" && this.renderUploadedState()) ||
                        (this.state.mainState === "error" && this.renderErrorState())
                    }
                </Grid>

                {/*<TextField*/}
                {/*error*/}
                {/*style={{*/}
                {/*backgroundColor: snet_background_red,*/}
                {/*align: "center",*/}
                {/*textAlign: "center",*/}
                {/*}}*/}
                {/*fullWidth={true}*/}
                {/*multiline={true}*/}
                {/*variant="outlined"*/}
                {/*value={errorMessage}*/}
                {/*/>*/}
            </Grid>
        );
    };
}

SNETImageUpload.defaultProps = {
    imageGallery: [],
    galleryCols: 1,
    componentName: "Input Image",
};

export default (SNETImageUpload);
// TODO: Test base64 image size vs its real size (downloaded from google)
// TODO: set component size, relative sizes
// TODO: verify gallery links
