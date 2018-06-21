import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


export default function ColoringSelect(props) {

    return <SelectField style={{textAlign: "left", marginRight: "20px", marginBottom: "20px"}}
                        floatingLabelText="Coloring type"
                        value={props.value}
                        onChange={props.onChange}>
        <MenuItem value={0} primaryText="Classic"/>
        <MenuItem value={1} primaryText="Levels"/>
        <MenuItem value={2} primaryText="Zebra"/>
        {props.tabId === "newtonTab" && <MenuItem value={3} primaryText="Hybrid"/>}
    </SelectField>
}



