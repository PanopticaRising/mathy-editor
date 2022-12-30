import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { TextFields } from "@mui/icons-material"
import { useContext } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { getSupportedDisplayName } from "../PluginManager/ComponentPlugin"
import { PluginContext } from "../PluginManager/Loaders/PluginProvider"

export const DraggableComponentList = () => {
    const { plugins } = useContext(PluginContext);

    return <>
        {plugins.map((component, i) => (
            <Draggable
                key={getSupportedDisplayName(component)}
                draggableId={component.name}
                index={i}
            >
                {(provided, snapshot) => (
                    <ListItem disablePadding ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <ListItemButton style={{ cursor: 'grab' }}>
                            <ListItemIcon>
                                {/* TODO: get icon from component */}
                                <TextFields />
                            </ListItemIcon>
                            <ListItemText primary={getSupportedDisplayName(component)} />
                        </ListItemButton>
                    </ListItem>
                )}
            </Draggable>
        ))}
    </>
}