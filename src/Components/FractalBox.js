import React from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';


export default class FractalBox extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <Paper style={{height: "500px"}}>
            <Paper>
                <Tabs style={{flexWrap: "wrap"}} onChange={this.props.handleTabChange}>
                    <Tab label="Newton fractal" id={"newtonTab"}>
                        <canvas id="newton-canvas" height={448} width={1000}/>
                    </Tab>
                    <Tab label="Mandelbrot set" id="mandelbrotTab">
                        <canvas id="mandelbrot-canvas" height={448} width={1000}/>
                    </Tab>
                    <Tab label="Julia set" id="juliaTab">
                        <canvas id="julia-canvas" height={448} width={1000}/>
                    </Tab>
                </Tabs>
            </Paper>
        </Paper>
    }
}

