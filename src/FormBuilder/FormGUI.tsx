import { useContext } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { ComponentPluginState, getSupportedInstanceName } from '../PluginManager/ComponentPlugin';
import { SupportedPluginTypes } from '../PluginManager/Loaders/PluginProvider';
import { SupportedPluginsFactory } from './SupportedPluginsFactory';
import { SaveStateContext } from '../PluginManager/Loaders/SaveStateManager';

export const FormGUI: React.FC<{ addedComponents: SupportedPluginTypes[] }> = ({ addedComponents }) => {
    const { state } = useContext(SaveStateContext);

    return <Droppable isDropDisabled={state.editFocus !== undefined} droppableId='components'>
        {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '10rem', minWidth: '100%' }}>
                {addedComponents.map((Item, ind) => <SupportedPluginsFactory key={getSupportedInstanceName(Item)} Item={Item} index={ind} mode={ComponentPluginState.DISPLAY} />)}
                {provided.placeholder}
            </div>
        )}
    </Droppable >;
}