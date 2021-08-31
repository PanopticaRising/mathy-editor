import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EditableBoxWrapper } from '../FormBuilder/EditableBoxWrapper';


export default {
  title: 'Layout/EditableBoxWrapper',
  component: EditableBoxWrapper,
} as ComponentMeta<typeof EditableBoxWrapper>;

const Template: ComponentStory<typeof EditableBoxWrapper> = (args) => <EditableBoxWrapper {...args}><p>This is a basic text example.</p></EditableBoxWrapper>;
Template.parameters = { pseudo: { hover: true }};

export const BasicTextBox = Template.bind({});
BasicTextBox.args = {};
