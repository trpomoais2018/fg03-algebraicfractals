import React from 'react';
import {MuiThemeProvider, Slider} from 'material-ui';

function FractalDepthSlider(props) {
    return (
        <MuiThemeProvider>
            <Slider
                min={1}
                max={20}
                step={1}
                value={props.value}
                onChange={props.onChange}
                style={{
                    marginRight: '10%',
                    marginLeft: '10%',
                    marginBottom: "-40px"
                }}/>
                <p>Max iterations: {props.currentDepth}</p>
        </MuiThemeProvider>);
}


export default FractalDepthSlider