// imports the React Javascript Library
import React from "react";
// Export with styles
import {withStyles} from "@material-ui/core/styles";
import {MuiThemeProvider} from '@material-ui/core/styles'
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
// Loading
import CircularProgress from '@material-ui/core/CircularProgress';
// Transitions
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
// Tooltips
import Tooltip from '@material-ui/core/Tooltip';
// Colors
import blue from "@material-ui/core/colors/blue";
import lightBlue from '@material-ui/core/colors/lightBlue';

// For tab views
import PropTypes from 'prop-types';
import {DropzoneArea} from 'material-ui-dropzone'
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from '@material-ui/core/GridListTileBar';

// Global variables
const snet_blue = "#1F8CFB";

const styles = theme => ({
    // TODO: relative size!
    palette: {
        primary: {main: lightBlue[500]}, // Purple and green play nicely together.
        secondary: {main: '#1F8CFB'}, // This is just green.A700 as hex.
    },
    mainCard: {
        width: 300,
        height: 300,
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
    avatar: {
        width: 60,
        height: 60,
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
        width: "90%",
        height: "90%",
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
    },
    image: { //TODO: check if this doesnt make me convert only 25% of the image to base64
        width: "75%",
        height: "75%",
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
});

function TabContainer({children, dir}) {
    return (
        <Typography component="div" dir={dir} style={{padding: 8 * 3}}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

function toDataUrl(src, callback, outputFormat) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
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

// TODO : handle upload error
class ImageUploadCard extends React.Component {

    constructor(props) {
        super(props);
        // It is the same thing, only difference is Component where we do the binding.
        // Component is lower in the tree, and now button has the logic how to open the screen.

        this.state = {
            value: 0, // Current tab value
            mainState: "initial", // initial, search, gallery, loading, uploaded, error
            imageUploaded: false,
            loading: false,
            searchText: null,
            selectedFile: null,
            filename: null,
            primaryColor: lightBlue[500],
        };

        this.urlCallback = this.urlCallback.bind(this);
    }

    loadImage = () => {
        //Loading and appending external resource
        let img = document.createElement('img');
        img.id = "loadedImage";
        img.crossOrigin = "Anonymous";
        img.src = "https://upload.wikimedia.org/wikipedia/commons/d/dd/Big_%26_Small_Pumkins.JPG";
        // img.src = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80";
        let element = document.getElementById('loaded_container').appendChild(img);
        console.log(element);
    };

    addImageCanvas = () => {
        let image = document.getElementById('loadedImage');
        let imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");
        imgCanvas.width = image.width;
        imgCanvas.height = image.height;
        imgContext.drawImage(image, 0, 0, image.width, image.height);
        document.getElementById('converted_container').appendChild(imgCanvas);
    };

    convertImage = () => {
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

    };

    handleDropzoneUpload(files) {
        this.setLoadingState();

        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function () {
            this.setState({
                mainState: "uploaded", // initial, search, gallery, loading, uploaded, error
                imageUploaded: true,
                searchText: null,
                selectedFile: [reader.result], //TODO: get image base64
                filename: null, //TODO: Get filename
            });
            console.log(this.state.selectedFile[0]);
        }.bind(this);
    }

    renderUploadState() {
        return (
            <DropzoneArea
                filesLimit={1}
                acceptedFiles={["image/jpg", "image/png", "image/bmp"]}
                onChange={this.handleDropzoneUpload.bind(this)}
            />
        );
    }

    setLoadingState() {
        this.setState({
            mainState: "loading",
        })
    };

    handleUploadClick = event => {
        this.setLoadingState();

        const file = event.target.files[0];
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

    };

    handleSearchClick = () => {
        this.setState({
            mainState: "search", // initial, search, gallery, loading, uploaded, error
            searchText: null,
            selectedFile: null,
            filename: null,
        });
    };

    handleGalleryClick = () => {
        this.setState({
            mainState: "gallery", // initial, search, gallery, loading, uploaded, error
            searchText: null,
            selectedFile: null,
            filename: null,
        });
    };

    renderInitialState() {
        const {classes} = this.props;

        return (
            <Fade in={this.state.mainState === "initial"}>
                <CardContent>
                    <Grid container direction="col" justify="center" alignItems="center">
                        <Grid item>
                            <input
                                accept="image/*"
                                className={classes.input}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={this.handleUploadClick}
                            />
                            <label htmlFor="contained-button-file">
                                <Tooltip disableFocusListener disableTouchListener title="Upload" enterDelay={500}>
                                    <Fab component="span" className={classes.button}>
                                        <AddPhotoAlternateIcon/>
                                    </Fab>
                                </Tooltip>
                            </label>
                        </Grid>
                        <Grid item>
                            <Tooltip disableFocusListener disableTouchListener title="From URL" enterDelay={500}>
                                <Fab className={classes.button} onClick={this.handleSearchClick}>
                                    <SearchIcon/>
                                </Fab>
                            </Tooltip>
                        </Grid>

                        {   //TODO: assert image gallery types (list of urls)
                            this.props.imageGallery.length > 0 &&
                            <Grid item>
                                <Tooltip disableFocusListener disableTouchListener title="Example Gallery"
                                         enterDelay={500}>
                                    <Fab className={classes.button} onClick={this.handleGalleryClick}>
                                        <CollectionsIcon/>
                                    </Fab>
                                </Tooltip>
                            </Grid>
                        }
                    </Grid>
                </CardContent>
            </Fade>
        );
    }

    searchTextUpdate = event => {
        this.setState({
            searchText: event.target.value,
        });
    };


    urlCallback(data) {
        console.log(data);
        this.setState({
            selectedFile: data,
            mainState: "uploaded",
            imageUploaded: true,
            //filename: filename,
            searchText: null,
        });
    }

    // TODO: Render data not URL
    // TODO: Cannot read substring of null (when clicking search with an empty field
    handleSearchSubmit = () => {
        this.setState({
            mainState: "loading",
            loading: true,
        });

        //const file = this.state.searchText;
        //toDataUrl(proxyURL + file, this.urlCallback);
        //const filename = file.substring(file.lastIndexOf("/") + 1);
        //console.log(filename);

        /*this.setState({
            selectedFile: this.state.searchText,
            mainState: "uploaded",
            //filename: filename,
            searchText: null,
        });*/

    };

    handleSearchClose = () => {
        this.setState({
            mainState: "initial", // initial, search, gallery, loading, uploaded, error
            searchText: null,
            selectedFile: null,
            filename: null,
        });
    };

    // TODO: deal with non-image URLs and strings
    renderSearchState() {
        const {classes} = this.props;

        return (
            <Paper className={classes.searchRoot} elevation={1}>
                <InputBase className={classes.searchInput} placeholder="Image URL"
                           onChange={this.searchTextUpdate}/>
                <Tooltip disableFocusListener disableTouchListener title="Submit" enterDelay={1000}>
                    <IconButton
                        className={classes.button}
                        aria-label="Search"
                        onClick={this.handleSearchSubmit}
                    >
                        <SearchIcon/>
                    </IconButton>
                </Tooltip>
                <Divider className={classes.searchDivider}/>
                <Tooltip disableFocusListener disableTouchListener title="Cancel search" enterDelay={1000}>
                    <IconButton
                        color="primary"
                        className={classes.secondaryButton}
                        aria-label="Close"
                        onClick={this.handleSearchClose}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Tooltip>
            </Paper>
        );
    }

    handleGalleryImageClick(image){
        this.setLoadingState();

        const proxyURL = 'https://cors-anywhere.herokuapp.com/';
        const file = image.url;
        const filename = image.url.substring(image.url.lastIndexOf("/") + 1);
        console.log(filename);
        toDataUrl(proxyURL + file, this.urlCallback);


        /*this.setState({
            mainState: "uploaded",
            selectedFile: value.url,
            fileReader: undefined,
            filename: filename
        });*/
    }

    // TODO: loading taking too long bug
    renderGalleryState() {
        const {classes} = this.props;

        return (
            <GridList className={classes.gridList} cols={3.3}>
                {this.props.imageGallery.map((url,i)  => (
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
    }

    handleImageReset = () => {
        console.log("Click!");
        this.setState({
            mainState: "initial", // initial, search, gallery, loading, uploaded, error
            imageUploaded: false,
            searchText: null,
            selectedFile: null,
            filename: null,
        });
    };

    // TODO: implement loading state
    renderLoadingState() {
        const {classes} = this.props;

        return (
            <Fade
                in={this.state.mainState === "loading"}
                style={{
                    transitionDelay: this.state.loading ? '800ms' : '0ms',
                }}
                unmountOnExit
            >
                <CircularProgress className={classes.button}/>
            </Fade>
        );
    };

    // TODO: add filename, reset icon and reset tooltip
    renderUploadedState() {
        const {classes} = this.props;

        return (
            <CardActionArea onClick={this.handleImageReset}>
                <Fade in={this.state.mainState === "uploaded"}>
                    <img
                        alt="Chosen input"
                        width="100%"
                        className={classes.image}
                        src={this.state.selectedFile}
                        onError={this.handleError}
                        crossOrigin="anonymous"
                    />
                </Fade>
            </CardActionArea>
        );
    }

    // TODO: specify error message, reset to initial state.
    handleError() {
        this.setState({
            mainState: "error",
        })
    }

    renderErrorState() {
        const {classes} = this.props;

        return (
            <CardActionArea onClick={this.handleImageReset}>
                <IconButton
                    color="primary"
                    className={classes.errorButton}
                    aria-label="Close"
                    onClick={this.handleSearchClose}
                >
                    <ErrorOutlinedIcon/>
                </IconButton>
            </CardActionArea>
        );
    }

    // TODO: set component size, relative sizes
    // TODO: return binary / base64 data
    // TODO: if no list, no gallery

    handleTabChange = (event, value) => {
        var mainState = null;
        switch (value) {
            case 0:
                mainState = "upload";
                break;
            case 1:
                mainState = "search";
                break;
            case 2:
                mainState = "gallery";
                break;
            default:
                mainState = "upload";
        }

        this.setState({
            value: value,
            mainState: mainState,
            selectedFile: null,
            imageUploaded: false,
            filename: null,
        });
    };

    handleTabChangeIndex = index => {

        var mainState = null;
        switch (index) {
            case 0:
                mainState = "upload";
                break;
            case 1:
                mainState = "search";
                break;
            case 2:
                mainState = "gallery";
                break;
            default:
                mainState = "upload";
        }

        this.setState({
            value: index,
            mainState: mainState,
            searchText: null,
            selectedFile: null,
            filename: null,
        });
    };

    // TODO: Change colors to snet_blue
    render() {
        const {classes, theme} = this.props;

        return (
            <div className={classes.root}>
                <MuiThemeProvider theme={theme}>
                    <AppBar position="static" color="default">
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
                            <Tab className={classes.tab} style={{textColorPrimary: snet_blue}} label="Upload"/>
                            <Tab label="URL"/>
                            <Tab label="Gallery"/>
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={this.state.value}
                        onChangeIndex={this.handleTabChangeIndex}
                    >
                        <TabContainer dir={theme.direction}>
                            {this.state.imageUploaded ? this.renderUploadedState() : this.renderUploadState()}
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                            {this.state.imageUploaded ? this.renderUploadedState() : this.renderSearchState()}
                        </TabContainer>
                        <TabContainer dir={theme.direction}>
                            {this.state.imageUploaded ? this.renderUploadedState() : this.renderGalleryState()}
                        </TabContainer>
                    </SwipeableViews>
                </MuiThemeProvider>
            </div>
            //
            // <div className={classes.root}>
            //     <Card className={classes.mainCard}>
            //         <Grid container direction="column" justify="center" alignItems={"center"}>
            //             {(this.state.mainState === "initial" && this.renderInitialState()) ||
            //             (this.state.mainState === "search" && this.renderSearchState()) ||
            //             (this.state.mainState === "gallery" && this.renderGalleryState()) ||
            //             (this.state.mainState === "loading" && this.renderLoadingState()) ||
            //             (this.state.mainState === "uploaded" && this.renderUploadedState()) ||
            //             (this.state.mainState === "error" && this.renderErrorState())}
            //         </Grid>
            //     </Card>
            // </div>
        );
    }
}

ImageUploadCard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

ImageUploadCard.defaultProps = {
    imageGallery: [],
};

export default withStyles(styles, {withTheme: true})(ImageUploadCard);
//TODO: Comment code!
//TODO: Test base64 image size vs its real size (downloaded from google)