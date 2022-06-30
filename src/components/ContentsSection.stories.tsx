import { ComponentStory, ComponentMeta } from "@storybook/react";
import ContentsSection from "@components/ContentsSection";
import InputWrapper from "@components/InputWrapper";
import TextInput from "@components/input/TextInput";

export default {
  component: ContentsSection,
  title: "ContentsSection",
} as ComponentMeta<typeof ContentsSection>;

export const Default: ComponentStory<typeof ContentsSection> = () => (
  <ContentsSection>Default</ContentsSection>
);

export const TwoInputWrapper: ComponentStory<typeof ContentsSection> = () => (
  <ContentsSection>
    <InputWrapper
      label="상품명"
      isRequired={true}
      marginTop={"40px"}
      marginBottom={"48px"}
    >
      <TextInput width={"540px"} />
    </InputWrapper>
    <InputWrapper label="카테고리" isRequired={true} marginTop={"0px"}>
      <TextInput />
    </InputWrapper>
  </ContentsSection>
);
