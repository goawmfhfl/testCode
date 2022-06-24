import { ComponentStory, ComponentMeta } from "@storybook/react";
import SideNavigationBar from "@components/SideNavigationBar";

export default {
  component: SideNavigationBar,
  title: "SideNavigationBar",
} as ComponentMeta<typeof SideNavigationBar>;

const Template: ComponentStory<typeof SideNavigationBar> = (args) => (
  <SideNavigationBar />
);

export const Default = Template.bind({});
Default.args = {};
