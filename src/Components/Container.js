import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MaxIterationsSlider from './MaxIterationsSlider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FractalBox from "./FractalBox";
import ColoringSelect from "./ColoringSelect";
import drawFractal from  "../drawing";


export default class AppContainer extends React.Component {
    constructor() {
        super();
        this.styles = {
            container: {
                margin: "auto",
                height: "500px",
                width: "1000px"
            }
        };
        this.state = {
            maxIterations: 5,
            juliaCVisible: false,
            currentTabId: "newtonTab",
            selectedColorings: {
                "newtonTab": 0,
                "mandelbrotTab": 0,
                "juliaTab": 0
            }
        };
    }

    render() {
        return <div style={this.styles.container}>
            <h1>Algebraic fractals</h1>
            <MuiThemeProvider>
                <MaxIterationsSlider maxIterations={this.state.maxIterations} onChange={this.handleSlider}/>
                <ColoringSelect onChange={this.handleColoringChange}
                                tabId={this.state.currentTabId}
                                value={this.state.selectedColorings[this.state.currentTabId]}/>
                {this.state.juliaCVisible && <TextField
                    style={{position: "relative", top: "-17px"}}
                    hintText="Julia C"
                />}
                <FractalBox handleTabChange={this.handleTabChange}
                            currentDepth={this.state.maxIterations}
                            selectedColorings={this.state.selectedColorings}/>
            </MuiThemeProvider>
        </div>
    }

    componentDidMount() {
        this.redraw();
    }

    handleTabChange = (_, event) => {
        this.setState({currentTabId: event.currentTarget.id});
        if (event.currentTarget.id === "juliaTab") {
            this.setState({juliaCVisible: true});
        }
        else {
            this.setState({juliaCVisible: false});
        }
    };

    handleSlider = (event, value) => {
        this.setState({maxIterations: value});
        drawFractal(this.mandelbrotCanvas, "a", "3");
    };

    handleColoringChange = (event, value) => {
        let id = this.state.currentTabId;
        let selectedColorings = this.state.selectedColorings;
        selectedColorings[id] = value;
        this.setState({selectedColorings: selectedColorings})
    };

    redraw = () => {
        drawFractal(this.state.maxIterations);
    }
}