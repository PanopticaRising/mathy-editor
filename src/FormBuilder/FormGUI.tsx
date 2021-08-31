import { Droppable } from 'react-beautiful-dnd';
import { getSupportedInstanceName } from '../PluginManager/ComponentPlugin';
import { SupportedPluginTypes } from '../PluginManager/Loaders/PluginProvider';
import { SupportedPluginsFactory } from './SupportedPluginsFactory';

export const FormGUI: React.FC<{ addedComponents: SupportedPluginTypes[] }> = ({ addedComponents }) => {
    return <Droppable droppableId="components">
        {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '10rem', minWidth: '100%' }}>
                {addedComponents.map((Item, ind) => <SupportedPluginsFactory key={getSupportedInstanceName(Item)} Item={Item} index={ind} />)}
                {provided.placeholder}
            </div>
        )}
    </Droppable>;
}