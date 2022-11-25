import { ComponentStory, ComponentMeta } from "@storybook/react";
import GlobalNavigationBar from "./GlobalNavigationBar";

export default {
  component: GlobalNavigationBar,
  title: "GlobalNavigationBar",
} as ComponentMeta<typeof GlobalNavigationBar>;

const Template: ComponentStory<typeof GlobalNavigationBar> = (args) => (
  <GlobalNavigationBar />
);

export const Default = Template.bind({});
Default.args = {};
