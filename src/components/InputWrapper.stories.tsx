import { ComponentStory, ComponentMeta } from "@storybook/react";
import InputWrapper from "@components/InputWrapper";

export default {
  component: InputWrapper,
  title: "InputWrapper",
} as ComponentMeta<typeof InputWrapper>;

const Template: ComponentStory<typeof InputWrapper> = (args) => (
  <InputWrapper {...args} />
);

export const Default = Template.bind({});
Default.args = { label: "Default" };
