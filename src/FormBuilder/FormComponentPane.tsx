import { useContext } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Typography } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { Droppable } from "react-beautiful-dnd";
import { SaveStateContext } from "../PluginManager/Loaders/SaveStateManager";
import { DraggableComponentList } from "./DraggableComponentList";
import { VariableCreator } from "./VariableCreator";

// This is broken up into several accordions that represent things that can be dragged onto the page.
export const FormComponentPane: React.FC<{ variableList: any[] }> = ({ variableList }) => {
    const { dispatch } = useContext(SaveStateContext);

    return <>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Components</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Drag and drop these components onto the left to build your Problem Set.
                </Typography>
                <Droppable droppableId={'components3'} isDropDisabled={true}>
                    {(provided, snapshot) =>
                        <List ref={provided.innerRef} {...provided.droppableProps}>
                            <DraggableComponentList />
                            {provided.placeholder}
                        </List>
                    }
                </Droppable>
            </AccordionDetails>
        </Accordion>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography>Variables</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    Create and manage variable bounds for your Problem Sets here.
                    You can drag them into the problem to reference them directly, and they'll be available in the Code section as well.
                </Typography>
                {variableList.map(x => <VariableCreator key={x.uniqueName} id={x.uniqueName} type={""} generator={""} />)}
                <Button fullWidth onClick={(e) => {
                    dispatch?.({
                        type: 'AddNewVariable',
                        variable: {
                            uniqueName: `var-${variableList.length}`,
                            customizations: {},
                            name: 'variables have types, not names'
                        }
                    });
                }}>Add Variable</Button>
            </AccordionDetails>
        </Accordion>
    </>;
}