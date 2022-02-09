import { Box, Container, Grid, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { SyntheticEvent, useState } from "react";
import { FormBuilderPane } from "./FormBuilder/FormBuilderPane";
import { Form } from './Mocks/Form';
import { PyodideContext } from './PyodideContext';
import { FormPreview } from './FormBuilder/FormPreview';
import { CoderPane } from "./CodeManager/CoderPane";
import _ from "lodash";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

enum RoutingTabs {
    DESIGNER = 'Designer',
    CODER = 'Coder',
    VALIDATOR = 'Validator',
    DEBUG = 'Preview',
}

// This SPA has one screen, but multiple tabs.
export const Routing: React.FC = () => {
    const [value, setValue] = useState<RoutingTabs>(RoutingTabs.DESIGNER);

    const handleChange = (event: SyntheticEvent, newValue: RoutingTabs) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                {/* This Grid forms the basis of a Navbar. */}
                <Grid container sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Grid item xs={2}><Tab label='Renderly Problem Editor' /></Grid>
                    <Grid item xs={8}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="Tabs for Designer, Coder, Validator, and Preview panes." textColor='primary' centered>
                                <Tab label={RoutingTabs.DESIGNER} value={RoutingTabs.DESIGNER} />
                                <Tab label={RoutingTabs.CODER} value={RoutingTabs.CODER} />
                                <Tab label={RoutingTabs.VALIDATOR} value={RoutingTabs.VALIDATOR} />
                                <Tab label={RoutingTabs.DEBUG} value={RoutingTabs.DEBUG} />
                            </TabList>
                        </Box>
                    </Grid>
                </Grid>
                <TabPanel value={RoutingTabs.DESIGNER}><FormBuilderPane /></TabPanel>
                <TabPanel value={RoutingTabs.CODER}><CoderPane /></TabPanel>
                <TabPanel value={RoutingTabs.VALIDATOR}>Test Pane</TabPanel>
                <TabPanel value={RoutingTabs.DEBUG}>
                    <Container>
                        <DragDropContext onDragEnd={_.noop}>
                            <Droppable isDropDisabled={true} droppableId={'DEFAULT'}>
                                {() => <FormPreview />}
                            </Droppable>
                        </DragDropContext>

                    </Container>
                    {/* <PyodideContext.Consumer>
                        {value =>
                            <Form pyodide={value}>
                            </Form>
                        }
                    </PyodideContext.Consumer> */}
                </TabPanel>
            </TabContext>
        </Box>
    );
}