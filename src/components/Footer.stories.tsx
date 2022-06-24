import { ComponentStory, ComponentMeta } from "@storybook/react";
import Footer from "@components/Footer";

export default {
  component: Footer,
  title: "Footer",
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer />;

export const Tester = Template.bind({});
Tester.args = {};
