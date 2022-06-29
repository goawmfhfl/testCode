import { ComponentStory, ComponentMeta } from "@storybook/react";
import Button from "@components/Common/Button";

export default {
  component: Button,
  title: "Button",
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args} className="postive">
    테스트 버튼
  </Button>
);

export const Default = Template.bind({});
Default.args = {};

export const Small = Template.bind({});
Small.args = {
  size: "small",
};

export const Big = Template.bind({});
Big.args = {
  size: "big",
};
