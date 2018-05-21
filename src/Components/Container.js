import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import FractalDepthSlider from './FractalDepthSlider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';


export default class AppContainer extends React.Component {
    constructor() {
        super();
        this.styles = {
            container: {
                margin: "auto",
                minHeight: "500px",
                maxWidth: "1000px"
            }
        }
        this.state = {
            currentDepth: 1,
            juliaCVisible: false
        }
    }

    render() {
        return <div style={this.styles.container}>
            <h1>Algebraic fractals</h1>
            <MuiThemeProvider >
                <FractalDepthSlider currentDepth={this.state.currentDepth} />
                <SelectField style={{ textAlign: "left", marginRight: "20px", marginBottom: "20px" }}
                    floatingLabelText="Coloring type"
                    value={1} >
                    <MenuItem value={1} primaryText="Type A" />
                    <MenuItem value={2} primaryText="Type B" />
                </SelectField>
                {this.state.juliaCVisible && <TextField
                    style={{ position: "relative", top: "-17px" }}
                    hintText="Julia C"
                />}
                <Paper style={{ height: "500px" }}>
                    <Paper>
                        <Tabs style={{ flexWrap: "wrap" }} onChange={this.handleTabChange}>
                            <Tab label="Newton fractal" >
                            </Tab>
                            <Tab label="Mandelbrot set">
                            </Tab>
                            <Tab label="Julia set" id="juliaTab">
                            </Tab>
                        </Tabs>
                    </Paper>
                </Paper>
            </MuiThemeProvider>
        </div>
    }

    handleTabChange = (_, event) => {
        debugger;
        if (event.currentTarget.id === "juliaTab") {
            this.setState({ juliaCVisible: true });
        }
        else {
            this.setState({ juliaCVisible: false });
        }
    }
}