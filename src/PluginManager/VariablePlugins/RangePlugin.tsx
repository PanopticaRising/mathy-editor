import { Grid, TextField } from "@material-ui/core";
import _ from "lodash";
import { VariablePlugin, VariablePluginUI } from "./VariablePluginDefinitions";

type RangeCustomization = {
    lower: number,
    upper: number,
}

export const RangePlugin: VariablePluginUI = ({ uniqueIdentifier }) => {

    return <Grid id={uniqueIdentifier} container justifyContent='center' alignItems='center' spacing={2}>
        <TextField type='number' label='Lower bound (inclusive)' /> <span>to</span> <TextField type='number' label='Upper bound (inclusive)' />
        {/* TODO: Steps? Decimal limit? */}
    </Grid>
}

export default {
    type: 'range',
    function: (seed: number, { lower, upper }: RangeCustomization) => _.random(lower, upper, false),
    interface: RangePlugin,
} as VariablePlugin