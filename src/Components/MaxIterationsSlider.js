import React from 'react';
import {MuiThemeProvider, Slider} from 'material-ui';

function MaxIterationsSlider(props) {
    return (
        <MuiThemeProvider>
            <Slider
                min={1}
                max={50}
                step={1}
                value={props.maxIterations}
                onChange={props.onChange}
                style={{
                    marginRight: '10%',
                    marginLeft: '10%',
                    marginBottom: "-40px"
                }}/>
                <p>Max iterations: {props.maxIterations}</p>
        </MuiThemeProvider>);
}


export default MaxIterationsSlider