import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from "./Button";

export default {
  component: Button,
  title: "Button",
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args} className="positive"></Button>
);

export const Default = Template.bind({});
Default.args = {
  full: true,
  size: "big",
};
