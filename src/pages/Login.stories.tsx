import { ComponentStory, ComponentMeta } from "@storybook/react";
import Login from "@pages/Login";

export default {
  component: Login,
  title: "Login",
} as ComponentMeta<typeof Login>;

const Template: ComponentStory<typeof Login> = (args) => <Login />;

export const Default = Template.bind({});
Default.args = {};
