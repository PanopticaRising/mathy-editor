import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FormBuilderPane } from '../FormBuilder/FormBuilderPane';

export default {
  title: 'Layout/FormBuilder',
  component: FormBuilderPane,
} as ComponentMeta<typeof FormBuilderPane>;

const Template: ComponentStory<typeof FormBuilderPane> = (args) => <FormBuilderPane {...args} />;

export const Default = Template.bind({});
Default.args = {
};
