import React from "react";
import PropTypes from 'prop-types';
// Themes
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
// Structural
import Grid from "@material-ui/core/Grid";
// Buttons and clickable components
import IconButton from "@material-ui/core/IconButton";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InfoIcon from "@material-ui/icons/Info";
import ErrorIcon from "@material-ui/icons/Error"
// Loading
import CircularProgress from '@material-ui/core/CircularProgress';
// Transitions
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
// Colors
import {grey, red, blue, green} from "@material-ui/core/colors";
// Tabs:
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import {Toolbar, Tooltip} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import Hidden from "@material-ui/core/Hidden";
// Upload tab
import Dropzone from 'react-dropzone';
// Search tab
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
// Gallery tab
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";


// Error Snackbar
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
// Global variables


// Color Palette
//const mainColor = this.props.mainColor[500];

const snetGreen = green[500];
const snetGrey = grey[500];
const snetGreyError = grey[700];
const snetRed = red[500];
const snetBackgroundRed = red[100];
const snetBackgroundGrey = grey[100];
const errorMessage = "Incorrect URL or permission denied by server.";
const spacingUnit = 8;

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
            position: 'relative',
            overflow: 'hidden',
            paddingTop: spacingUnit * 4, // To accommodate AppBar
            padding: spacingUnit,
            height: this.props.height,

        };
        this.textStyle = {
            fontFamily: "Montserrat",
            fontVariantCaps: "normal",
            textTransform: 'initial',
        };
        this.tabLabelStyle = {
            ...this.textStyle,
            fontSize: 16,
        };

        // Color Palette
        this.mainColor = this.props.mainColor[500];
        this.uploadIcon = (
            <svg style={{width: "48x", height: "48px", color: this.mainColor}} viewBox="0 0 24 24">
                <path fill={this.props.mainColor[500]}
                      d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z"/>
            </svg>
        );
        this.theme = createMuiTheme({
            palette: {
                primary: this.props.mainColor,
                error: red,
            },
            typography: {useNextVariants: true},
        });

        // Function binding
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

    handleDropzoneUpload(files, rejected) {
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
            <Grid item xs={12}>
                <Dropzone
                    accept={this.props.imageTypes}
                    onDrop={this.handleDropzoneUpload.bind(this)}
                    maxSize={this.props.maxImageSize}
                >
                    {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => {

                        let styles = {
                            borderWidth: 2,
                            borderColor: this.mainColor,
                            backgroundColor: grey[200],
                            borderStyle: 'dashed',
                            borderRadius: 5,
                            flexGrow: 1,
                            cursor: "pointer",
                            height: this.props.height + "px"
                        };
                        styles = isDragActive ? {
                            ...styles,
                            borderStyle: 'solid',
                            borderColor: snetGreen,
                        } : styles;
                        styles = isDragReject ? {
                            ...styles,
                            borderStyle: 'solid',
                            borderColor: snetRed,
                        } : styles;

                        return (
                            <div {...getRootProps()} style={styles}>
                                <input {...getInputProps()} />
                                <Grid container
                                      direction="column"
                                      justify="center"
                                      alignItems="center"
                                      style={{
                                          flexGrow: 1,
                                          height: this.props.height + "px"
                                      }}
                                      spacing={spacingUnit}
                                >
                                    <Grid item>
                                        {this.uploadIcon}
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            style={{
                                                ...this.textStyle,
                                                fontSize: 16,
                                                color: snetGrey,
                                                // {isDragAccept ? 'drop' : 'drag'}
                                            }}
                                        >
                                            Drag and drop image here or <span
                                            style={{color: this.mainColor}}>click</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            style={{
                                                ...this.textStyle,
                                                color: snetGrey,
                                                fontSize: 14,
                                                padding: spacingUnit,
                                            }}
                                        >
                                            (Image must be under {this.props.maxImageSize / 1000000}mb. Source images
                                            are
                                            not saved on the servers after the job is processed.)
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        )
                    }}
                </Dropzone>
            </Grid>
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

    renderSearchTab() {

        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style={{
                    flexGrow: 1,
                    height: this.props.height + "px"
                }}
            >
                <Grid item xs={12}>
                    <MuiThemeProvider theme={this.theme}>
                        <TextField
                            style={{
                                width: "80%",
                                primary: this.mainColor,
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
                                                color: this.mainColor,
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

    // TODO: fix loading taking too long bug
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
                        height: this.props.height + "px",
                    }}
                >
                    {this.props.imageGallery.map((url, i) => (
                        <Grow
                            in={this.state.value === 2}
                            style={{transformOrigin: '0 0 0'}}
                            {...(this.state.value === 2 ? {timeout: i * 500} : {})}
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

    renderLoadingState() {
        return (
            <div style={this.tabStyle}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{
                        flexGrow: 1,
                        height: this.props.height + "px"
                    }}
                >
                    <Grid item xs={12}>
                        <Fade
                            in={this.state.mainState === "loading"}
                            unmountOnExit
                        >
                            <CircularProgress
                                style={{
                                    color: this.mainColor,
                                    margin: 10
                                }}
                            />
                        </Fade>
                    </Grid>
                </Grid>
            </div>
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
            <div style={this.tabStyle}>
                <Grid item xs={12}>
                    <div id="uploadedImageContainer">
                        <img
                            alt="Service input"
                            src={this.state.selectedFile}
                            onError={this.handleError}
                            id="loadedImage"
                            crossOrigin="anonymous"
                            style={{
                                maxWidth: "100%",
                                maxHeight: this.props.height + "px",
                            }}
                        />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <AppBar
                        position="absolute"
                        style={{
                            top: 'auto',
                            bottom: 0,
                            textColor: "black",
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            color: "black",
                        }}
                    >
                        <Toolbar
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
            </div>
        );
    };

    /* ---------------
       - ERROR STATE -
    *  ---------------*/
    handleError = () => {
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

    renderTabs() {
        return (
            <div style={this.tabStyle}>
                <SwipeableViews
                    axis='x'
                    index={this.state.value}
                >
                    <div>
                        {this.renderUploadTab()}
                    </div>
                    <div>
                        {this.renderSearchTab()}
                    </div>
                    <div>
                        {this.renderGalleryTab()}
                    </div>
                </SwipeableViews>
                <Snackbar
                    style={{
                        position: "absolute",
                        width: "100%"
                    }}
                    open={this.state.displayError}
                    autoHideDuration={500}
                    TransitionComponent={Slide}
                >
                    <SnackbarContent
                        style={{
                            backgroundColor: snetBackgroundRed,
                            margin: spacingUnit,
                            border: "2px solid",
                            borderColor: snetRed,
                            borderRadius: "5px"
                        }}
                        aria-describedby="client-snackbar"
                        message={
                            <span style={{color: snetGreyError, display: 'flex', alignItems: 'center',}}>
                            <ErrorIcon style={{
                                fontSize: 16,
                                opacity: 0.9,
                                marginRight: spacingUnit
                            }}/>
                                {errorMessage}
                                <IconButton
                                    key="close"
                                    color="inherit"
                                    aria-label="Close"
                                    onClick={() => this.setState({displayError: false})}
                                >
                                <CloseIcon style={{fontSize: 16,}}/>
                            </IconButton>
                        </span>
                        }
                    />
                </Snackbar>
                {/*<Snackbar*/}
                {/*style={{*/}
                {/*position: "absolute",*/}
                {/*width: "100%"*/}
                {/*}}*/}
                {/*open={this.state.displayError}*/}
                {/*autoHideDuration={1}*/}
                {/*message={errorMessage}*/}
                {/*TransitionComponent={Slide}*/}
                {/*action={[*/}
                {/*<IconButton*/}
                {/*key="close"*/}
                {/*aria-label="Close"*/}
                {/*color="inherit"*/}
                {/*onClick={() => {*/}
                {/*this.setState({displayError: false})*/}
                {/*}}*/}
                {/*>*/}
                {/*<CloseIcon/>*/}
                {/*</IconButton>,*/}
                {/*]}*/}
                {/*/>*/}
            </div>
        );
    };

    render() {
        return (
            <Grid container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  style={{
                      width: this.props.width + '%',
                      backgroundColor: "white",
                  }}
            >
                {/*<Grid item xs={12} style={{*/}
                    {/*height: '64px',*/}
                    {/*backgroundColor: "yellow",*/}
                {/*}}>*/}
                    {/*<AppBar*/}
                    {/*position="relative"*/}
                    {/*style={{*/}
                    {/*backgroundColor: "white",*/}
                    {/*textColor: "black",*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*<Toolbar style={{justifyContent: 'space-between',}}>*/}
                    <Grid item xs={2}>
                        <Typography
                            variant="h6"
                            color="inherit"
                            noWrap
                            style={{
                                ...this.textStyle,
                                color: "black",
                                padding: 1,
                            }}
                        >
                            {this.props.imageName}
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <MuiThemeProvider theme={this.theme}>
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="on"
                                style={{
                                    color: snetGrey,
                                }}
                                // TabIndicatorProps={{ style: { backgroundColor: this.mainColor } }}
                            >
                                {/*Renders image galleries if non-empty list of URLs is passed
                                    // style={{color: this.state.value === 2 ? this.mainColor : snetGrey}}*/}
                                <Tab value={0} label={<span style={this.tabLabelStyle}>Upload</span>}/>
                                <Tab value={1} label={<span style={this.tabLabelStyle}>URL</span>}/>
                                {this.props.imageGallery.length > 0 &&
                                <Tab value={2} label={<span style={this.tabLabelStyle}>Gallery</span>}/>}
                            </Tabs>
                        </MuiThemeProvider>
                    </Grid>
                    <Grid item xs={2}>
                        {this.props.infoTip.length > 0 &&
                            <Tooltip title={this.props.infoTip}>
                                <IconButton>
                                    <InfoIcon/>
                                </IconButton>
                            </Tooltip>
                        }
                        <div>
                            {/*TODO: Implement hidden button. Added according of greg's suggestions*/}
                            <Hidden xsUp>
                                <IconButton style={{right: 0}}>
                                    <MoreVertIcon/>
                                </IconButton>
                            </Hidden>
                        </div>
                    </Grid>
                    {/*</Toolbar>*/}
                    {/*</AppBar>*/}
                {/*</Grid>*/}
                <Grid item xs={12} style={{backgroundColor: snetBackgroundGrey}}>
                    {
                        (this.state.mainState === "initial" && this.renderTabs()) ||
                        (this.state.mainState === "loading" && this.renderLoadingState()) ||
                        (this.state.mainState === "uploaded" && this.renderUploadedState())
                    }
                </Grid>
            </Grid>
        );
    };
}

SNETImageUpload.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    imageName: PropTypes.string.isRequired,
    imageTypes: PropTypes.string, // TODO: specify which strings are allowed
    maxImageSize: PropTypes.number, // 10 mb
    imageGallery: PropTypes.arrayOf(PropTypes.string), // TODO: check that items are URLs
    galleryCols: PropTypes.number,
    infoTip: PropTypes.string,
    mainColor: PropTypes.object,
    returnBytes: PropTypes.bool,
    //
    // className: PropTypes.string,
    // message: PropTypes.node,
    // onClose: PropTypes.func,
    // variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

SNETImageUpload.defaultProps = {
    imageName: "A",
    imageTypes: "image/*",
    maxImageSize: 10000000, // 10 mb
    imageGallery: [],
    galleryCols: 1,
    infoTip: "",
    mainColor: blue,
    returnBytes: false,
};

export default (SNETImageUpload);
// TODO: Test base64 image size vs its real size (downloaded from google)
// TODO: limit max file size for gallery and search as well