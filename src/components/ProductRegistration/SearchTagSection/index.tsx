import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";
import { useReactiveVar } from "@apollo/client";

import Checkbox from "@components/common/input/Checkbox";
import { Input as TextInput } from "@components/common/input/TextInput";
import NoticeContainer from "@components/common/NoticeContainer";
import SearchTag from "@components/productRegistration/SearchTagSection/SearchTag";
import questionMarkIconSource from "@icons/questionmark.svg";
import rightArrowIconSource from "@icons/arrow-rightward-small.svg";
import { tagListVar } from "@cache/productRegistration/searchTag";
import { systemModalVar } from "@cache/index";
import { HAS_TAG_INFOS } from "@cache/productRegistration/index";
import { TagTypes } from "@models/productRegistration/searchTag";

const SearchTagSection = () => {
  const { register, watch } = useFormContext();
  const [tagInput, setTagInput] = useState("");
  const tagList = useReactiveVar(tagListVar);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventTarget = e.target as HTMLInputElement;

    setTagInput(eventTarget.value);
  };

  const handleTagInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnterKey = e.key === "Enter";

    if (!isEnterKey) return;

    if (tagInput === "") {
      return;
    }

    const specialChars = /[\\*?“<>]+/g;

    if (specialChars.test(tagInput)) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            특수문자는 태그에
            <br />
            포함할 수 없습니다.
          </>
        ),
      });

      return;
    }

    const hasSameTagName = tagList.find(({ tagName }) => tagName === tagInput);

    if (hasSameTagName) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: "동일한 태그가 있습니다.",
      });

      return;
    }

    tagListVar([
      ...tagListVar(),
      { id: uuidv4(), tagName: tagInput, type: TagTypes.SearchOnly },
    ]);

    setTagInput("");
  };

  const hasSearchTags = watch(HAS_TAG_INFOS) as boolean;

  return (
    <Container>
      <CheckboxWrapper>
        <Checkbox {...register(HAS_TAG_INFOS)} /> 검색용 태그 설정하기
      </CheckboxWrapper>

      <NoticeContainer icon={questionMarkIconSource} width={"741px"}>
        <NoticeContents>
          <NoticeDescription>
            입력하신 태그는 검색에 사용되며 또한 추가한 태그를 클릭해서
            상품상세페이지에 노출할 태그를 선택할 수 있습니다.
            <br />
            {[8251, 42, 63, 34, 60, 62].map((el) => String.fromCharCode(el))} 는
            태그에 포함할 수 없습니다.
          </NoticeDescription>
          <SearchTag name={"태그"} type={TagTypes.SearchOnly} />
          <RightArrow src={rightArrowIconSource} />
          <Bold>검색에만 이용되는 태그</Bold>
          <SearchTag name={"태그"} type={TagTypes.Exposed} />
          <RightArrow src={rightArrowIconSource} />
          <Bold>검색 이용 및 상세페이지에 노출되는 태그(최대 5개)</Bold>
        </NoticeContents>
      </NoticeContainer>

      <TagInput
        width={"741px"}
        placeholder={"태그를 입력해주세요."}
        onChange={handleTagInputChange}
        onKeyUp={handleTagInputKeyUp}
        value={tagInput}
        disabled={!hasSearchTags}
      />

      <TagContainer>
        {tagList.map(({ id, tagName, type }) => {
          return <SearchTag key={id} id={id} name={tagName} type={type} />;
        })}
      </TagContainer>
    </Container>
  );
};

const Container = styled.div``;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 14px;
  margin-bottom: 24px;

  & > input {
    margin-right: 16px;
  }
`;

const NoticeContents = styled.div`
  vertical-align: middle;
  margin-bottom: 3px;
  user-select: none;

  & * {
    cursor: default;
    pointer-events: none;
  }
`;

const NoticeDescription = styled.p`
  margin-bottom: 14px;
`;

const RightArrow = styled.img`
  width: 14px;
  height: 14px;
  vertical-align: middle;

  margin: 0 12px;
`;

const Bold = styled.span`
  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;

  margin-right: 36px;
`;

const TagContainer = styled.div`
  width: 741px;

  & > div {
    margin-right: 8px;
    margin-bottom: 8px;
  }
`;

const TagInput = styled(TextInput)`
  margin: 8px 0px;
`;

export default SearchTagSection;
