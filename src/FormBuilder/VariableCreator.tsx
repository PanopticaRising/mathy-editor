// The Variable Creator provides a dropdown to select the type of variable, and a textarea to define the code to run it.

import { MenuItem, Select } from "@material-ui/core"
import { Box } from "@material-ui/system"
import _ from "lodash";
import React from "react";
import { DragEventHandler, useContext, useState } from "react";
import { VarPluginContext } from "../PluginManager/Loaders/VarPluginProvider";

interface VariableCreatorProps {
    id: string,
    type: string,
    // The generator is a function that creates the variable based on some random input.
    generator: string,
}

/* A Variable Plugin is really just:
 * 1) A name, for the Select,
 * 2) A function, to generate the instance of the variable from a random seed,
 * 3) Some UI to let users customize that function or the inputs to it.
 */
type SupportedVariablePlugins = string;

export const VariableCreator: React.FC<VariableCreatorProps> = ({ id, }) => {
    const VarPlugins = useContext(VarPluginContext);
    const [varType, setVarType] = useState<SupportedVariablePlugins | null>(VarPlugins[0]?.type);

    const createVariableInterpolationSyntax: DragEventHandler<HTMLDivElement> = (ev) => ev.dataTransfer.setData("text/plain", `\${${id}}`);

    const selectedVar = _.find(VarPlugins, ['type', varType]);

    // TODO: Handle loading state
    if (!varType) return null;

    return <Box
        draggable
        onDragStart={createVariableInterpolationSyntax}
        style={{
            border: '1px dashed grey',
            width: '100%',
            cursor: 'grab'
        }}
    >
        {/* TODO: Add "Copy to Clipboard" and "Click to Edit" with hover states. */}
        <h5>To reference this variable, drag it into an input box or use <code>$&#123;{id}&#125;</code> in your code.</h5>
        <Select
            value={varType}
            onChange={(e) => setVarType(e.target.value as string)}
        >
            {VarPlugins.map(plug => <MenuItem key={plug.type} value={plug.type}>{_.startCase(plug.type)}</MenuItem>)}
        </Select>
        {selectedVar &&
            React.createElement(selectedVar.interface)
        }
    </Box>
}