import clsx from "clsx";
import styled from "styled-components/macro";
import { useState, useRef } from "react";
import { useReactiveVar } from "@apollo/client";

import closeIconSource from "@icons/delete.svg";
import whiteCloseIconSource from "@icons/close-white.svg";
import {
  TagTypes,
  SearchTag as SearchTagType,
} from "@models/productRegistration/searchTag";
import { systemModalVar } from "@cache/index";
import { tagListVar } from "@cache/productRegistration/searchTag";

interface SearchTagProps {
  id?: string;
  name: string;
  type: TagTypes;
}

const SearchTag = ({ id, name, type }: SearchTagProps) => {
  const tagList = useReactiveVar<Array<SearchTagType>>(tagListVar);
  const [isHovered, setIsHovered] = useState(false);
  const deleteButtonRef = useRef<HTMLImageElement | null>(null);

  const handleSearchTagClick = (id: string, type: TagTypes) => () => {
    const hasEnoughExposedTags =
      tagList.reduce(
        (
          numberOfExposedTag: number,
          tag: { id: string; tagName: string; type: TagTypes }
        ) => {
          return numberOfExposedTag + (tag.type === TagTypes.Exposed ? 1 : 0);
        },
        0
      ) >= 5;

    if (hasEnoughExposedTags && type === TagTypes.SearchOnly) {
      systemModalVar({
        ...systemModalVar(),
        isVisible: true,
        description: (
          <>
            설정 가능한 상세페이지 노출 태그 <br />
            최대 5개를 초과하였습니다. <br />
            태그 노출 하나를 해제해주세요.
          </>
        ),
      });

      return;
    }

    const newList = tagListVar().map((tag) => {
      if (tag.id !== id) {
        return tag;
      }

      if (tag.type === TagTypes.SearchOnly) {
        tag.type = TagTypes.Exposed;
      } else {
        tag.type = TagTypes.SearchOnly;
      }

      return { ...tag };
    });

    tagListVar([...newList]);

    setIsHovered(false);
  };

  const handleDeleteButtonClick =
    (id) => (e: React.MouseEvent<HTMLImageElement>) => {
      e.preventDefault();

      const filteredList = tagListVar().filter((tag) => tag.id !== id);

      tagListVar([...filteredList]);
    };

  const handleSearchTagMouseEnter = () => {
    setIsHovered(true);
  };

  const handleSearchTagMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Container
      className={clsx([
        type === TagTypes.SearchOnly ? "tag--search-only" : "tag--exposed",
        isHovered && "hovered",
      ])}
      onMouseUp={handleSearchTagClick(id, type)}
      onMouseEnter={handleSearchTagMouseEnter}
      onMouseLeave={handleSearchTagMouseLeave}
      source={{ black: closeIconSource, white: whiteCloseIconSource }}
    >
      <TagName>{name}</TagName>

      <DeleteButton
        className="button--delete"
        ref={deleteButtonRef}
        onClick={handleDeleteButtonClick(id)}
      />
    </Container>
  );
};

const Container = styled.div<{
  source: { black: string; white: string };
}>`
  display: inline-block;

  padding: 3px;
  padding-left: 10px;
  padding-right: 4px;

  width: max-content;
  height: 24px;
  border-radius: 7px;
  vertical-align: middle;

  transition: 0.1s;
  cursor: pointer;
  user-select: none;

  &.tag--search-only {
    background-color: ${({ theme: { palette } }) => palette.grey100};
    color: ${({ theme: { palette } }) => palette.black};

    & > div.button--delete {
      background-image: ${({ source: { black } }) => `url("${black}")`};
    }
  }

  &.tag--exposed {
    background-color: ${({ theme: { palette } }) => palette.red900};
    color: ${({ theme: { palette } }) => palette.white};

    & > div.button--delete {
      background-image: ${({ source: { white } }) => `url("${white}")`};
    }
  }

  &.hovered {
    background-color: ${({ theme: { palette } }) => palette.grey500};
    color: ${({ theme: { palette } }) => palette.white};

    & > div.button--delete {
      color: ${({ theme: { palette } }) => palette.white};
      background-image: ${({ source: { white } }) => `url("${white}")`};
    }
  }
`;

const TagName = styled.span`
  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;

  padding-top: 3px;
  position: relative;
  top: -60%;
`;

const DeleteButton = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  position: relative;
  top: -15%;
  margin-left: 4px;

  cursor: pointer;
  user-select: none;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  transition: 0.05s;
`;

export default SearchTag;
