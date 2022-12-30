import { Grid, TextField } from "@mui/material";
import _ from "lodash";
import { useVariableCustomization } from "../Loaders/SaveStateManager";
import { VariablePlugin, VariablePluginUI } from "./VariablePluginDefinitions";
import { Chance } from 'chance';

type RangeCustomization = {
    lower: number,
    upper: number,
}

export const RangePlugin: VariablePluginUI<RangeCustomization> = ({ uniqueIdentifier }) => {
    const { state, updateState } = useVariableCustomization<RangeCustomization>(uniqueIdentifier);

    return <Grid id={uniqueIdentifier} container justifyContent='center' alignItems='center' spacing={2}>
        <TextField
            type='number' label='Lower bound (inclusive)'
            InputLabelProps={{ shrink: true }}
            value={state.lower ?? 0}
            onChange={e => updateState({ lower: parseInt(e.target.value, 10), upper: state.upper })}
        />
        <span>to</span>
        <TextField
            type='number'
            label='Upper bound (inclusive)'
            InputLabelProps={{ shrink: true }}
            value={state.upper ?? 10}
            onChange={e => updateState({ lower: state.lower, upper: parseInt(e.target.value, 10) })}
        />
        {/* TODO: Steps? Decimal limit? Floats, precision? */}
    </Grid>
}

RangePlugin.defaultCustomization = {
    lower: 0,
    upper: 10,
}

export default {
    type: 'range',
    function: (seed: string, { lower, upper }: RangeCustomization) => {
        // window.chance is seeded for you.
        return (new Chance(seed)).natural({ min: lower, max: upper })
    },
    interface: RangePlugin,
} as VariablePlugin