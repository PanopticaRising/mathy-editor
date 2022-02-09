import { useContext } from 'react';
import { Grid, Typography } from "@material-ui/core";
import { SaveStateContext } from "../PluginManager/Loaders/SaveStateManager";
import CodeBlock from './CodeBlock';
import _ from 'lodash';

export const CoderPane: React.FC = () => {
    const { dispatch, state } = useContext(SaveStateContext);

    return <Grid container>
        <Grid item md={12}>
            <Typography variant='h1'>
                Code Editor
            </Typography>
        </Grid>
        <Grid item md={12}>
            {_.keys(state.Code).map(key => {
                const codeData = state.Code[key];

                if (codeData) {
                    return <CodeBlock key={key} uniqueName={key} code={codeData.code} lang={codeData.lang} />;
                } else {
                    return <div key={key}>An error occurred. Failed to find appropriate code block.</div>
                }
            })
            }
        </Grid>
    </Grid>;
}