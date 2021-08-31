import { Grid, Typography } from "@material-ui/core";
import { FormDnDManager } from "./FormDnDManager";

export const FormBuilderPane: React.FC = () => {
    return <Grid container>
        <Typography variant='h1'>Problem Editor</Typography>
        <FormDnDManager>
        </FormDnDManager>
    </Grid>;
}