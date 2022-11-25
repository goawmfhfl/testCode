import { ComponentStory, ComponentMeta } from "@storybook/react";
import SectionWrapper from "@components/common/SectionWrapper";

export default {
  component: SectionWrapper,
  title: "SectionWrapper",
} as ComponentMeta<typeof SectionWrapper>;

const Template: ComponentStory<typeof SectionWrapper> = (args) => (
  <SectionWrapper {...args} />
);

export const Default = Template.bind({});
Default.args = { label: "Default" };
