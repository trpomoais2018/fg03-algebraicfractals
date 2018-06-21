import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MaxIterationsSlider from './MaxIterationsSlider';
import TextField from 'material-ui/TextField';
import FractalBox from "./FractalBox";
import ColoringSelect from "./ColoringSelect";
import drawFractal from "../DrawLogic/drawing";


export default class AppContainer extends React.Component {
    constructor() {
        super();
        this.styles = {
            container: {
                margin: "auto",
                height: "600px",
                width: "800px"
            }
        };
        this.state = {
            maxIterations: 5,
            juliaCVisible: false,
            juliaC: {
                real: -0.2,
                imag: 0.5
            },
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
                                value={this.getCurrentColorCode()}/>
                {this.state.juliaCVisible && <TextField
                    style={{position: "relative", top: "-15px", width: "50px", marginRight: "20px"}}
                    floatingLabelText="C real"
                    value={this.state.juliaC.real}
                    onChange={this.handleCReal}
                />}
                {this.state.juliaCVisible && <TextField
                    style={{position: "relative", top: "-15px", width: "50px"}}
                    floatingLabelText="C imag"
                    value={this.state.juliaC.imag}
                    onChange={this.handleCImag}
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

    componentDidUpdate() {
        this.redraw();
    }

    handleTabChange = (_, event) => {
        debugger;
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
    };

    handleColoringChange = (event, value) => {
        let id = this.state.currentTabId;
        let selectedColorings = this.state.selectedColorings;
        selectedColorings[id] = value;
        this.setState({selectedColorings: selectedColorings});
    };

    getCurrentColorCode = () => {
        let id = this.state.currentTabId;
        return this.state.selectedColorings[id]
    };

    redraw = () => {
        drawFractal(this.state.maxIterations, this.state.currentTabId, this.getCurrentColorCode(), this.state.juliaC);
    }
}