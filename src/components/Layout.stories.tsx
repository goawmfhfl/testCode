import { ComponentStory, ComponentMeta } from "@storybook/react";
import Layout from "./Layout";

export default {
  component: Layout,
  title: "Layout",
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = (args) => <Layout {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  layout: "fullscreen",
};
