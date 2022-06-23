import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ThemeProvider } from "styled-components";
import theme from "styles/theme";

import Button from "./Button";

export default {
  component: Button,
  title: "Button",
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args} className="positive">
    여기요
  </Button>
);

export const Default = Template.bind({});
Default.args = {
  full: true,
  size: "big",
};
