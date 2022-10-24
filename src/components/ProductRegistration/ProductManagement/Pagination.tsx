import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import mediumDoubleLeftActiveSvg from "@icons/medium-double-left-active.svg";
import mediumDoubleRightActiveSvg from "@icons/medium-double-right-active.svg";
import mediumLeftActvieSvg from "@icons/medium-left-active.svg";
import mediumRightActiveSvg from "@icons/medium-right-active.svg";

import mediumDoubleLeftInActiveSvg from "@icons/medium-double-left-inactive.svg";
import mediumDoubleRightInActiveSvg from "@icons/medium-double-right-inactive.svg";
import mediumLeftInActvieSvg from "@icons/medium-left-inactive.svg";
import mediumRightInActiveSvg from "@icons/medium-right-inactive.svg";

import { useReactiveVar } from "@apollo/client";
import { paginationSkipVar } from "@cache/index";
import {
  filterOptionPageNumberVar,
  pageNumberListVar,
} from "@cache/ProductManagement";

const Pagination = () => {
  const pageNumberList = useReactiveVar(pageNumberListVar);
  const filterOptionPageNumber = useReactiveVar(filterOptionPageNumberVar);
  const paginationSkip = useReactiveVar(paginationSkipVar);

  const [pageList, setPageList] = useState<Array<number>>(
    pageNumberList.slice(0 * 10, (0 + 1) * 10)
  );
  const totalSkipPage: number = Math.floor(pageNumberList.length / 10);

  const handlePageNumberClick = (pageNumber: number) => () => {
    filterOptionPageNumberVar(pageNumber);
  };

  const handleNextPageClick = () => {
    if (paginationSkip >= totalSkipPage) return;

    paginationSkipVar(paginationSkip + 1);
    filterOptionPageNumberVar((paginationSkip + 1) * 10 + 1);
  };

  const handlePrevPageClick = () => {
    if (paginationSkip <= 0) return;

    paginationSkipVar(paginationSkip - 1);
    filterOptionPageNumberVar(paginationSkip * 10);
  };

  const handleStartPageClick = () => {
    paginationSkipVar(0);
    filterOptionPageNumberVar(1);
  };

  const handleEndPageClick = () => {
    paginationSkipVar(totalSkipPage);
    filterOptionPageNumberVar(pageNumberList.length);
  };

  useEffect(() => {
    const newPageList = pageNumberList.slice(
      paginationSkip * 10,
      (paginationSkip + 1) * 10
    );
    setPageList(newPageList);
  }, [paginationSkip, pageNumberList]);

  return (
    <Container>
      <DoubleLeftButton
        isActive={paginationSkip > 0}
        disabled={paginationSkip === 0}
        onClick={handleStartPageClick}
      />
      <SingleLeftButton
        isActive={paginationSkip > 0}
        disabled={paginationSkip === 0}
        onClick={handlePrevPageClick}
      />
      <PageNumberList>
        {pageList.map((page, index) => (
          <PageItem
            key={index}
            onClick={handlePageNumberClick(page)}
            isActive={filterOptionPageNumber === page}
          >
            {page}
          </PageItem>
        ))}
      </PageNumberList>
      <SingleRightButton
        isActive={totalSkipPage !== paginationSkip}
        disabled={totalSkipPage === paginationSkip}
        onClick={handleNextPageClick}
      />

      <DoubleRightButton
        isActive={totalSkipPage !== paginationSkip}
        disabled={totalSkipPage === paginationSkip}
        onClick={handleEndPageClick}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 48px 0px;
  width: 100%;
`;

const DoubleLeftButton = styled.button<{ isActive: boolean }>`
  width: 24px;
  height: 24px;

  background-image: url(${mediumDoubleLeftInActiveSvg});
  background-repeat: no-repeat;

  ${({ isActive }) =>
    isActive &&
    css`
      background-image: url(${mediumDoubleLeftActiveSvg});
    `}
`;

const SingleLeftButton = styled.button<{ isActive: boolean }>`
  width: 24px;
  height: 24px;

  background-image: url(${mediumLeftInActvieSvg});
  background-repeat: no-repeat;

  ${({ isActive }) =>
    isActive &&
    css`
      background-image: url(${mediumLeftActvieSvg});
    `}
`;

const SingleRightButton = styled.button<{ isActive: boolean }>`
  width: 24px;
  height: 24px;

  background-image: url(${mediumRightInActiveSvg});
  background-repeat: no-repeat;

  ${({ isActive }) =>
    isActive &&
    css`
      background-image: url(${mediumRightActiveSvg});
    `}
`;

const DoubleRightButton = styled.button<{ isActive: boolean }>`
  width: 24px;
  height: 24px;

  background-image: url(${mediumDoubleRightInActiveSvg});
  background-repeat: no-repeat;

  ${({ isActive }) =>
    isActive &&
    css`
      background-image: url(${mediumDoubleRightActiveSvg});
    `}
`;

const PageNumberList = styled.ul`
  display: flex;
  align-items: flex-start;
  gap: 16px;

  padding: 0 15px;
`;

const PageItem = styled.li<{ isActive: boolean }>`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 24px;
  height: 24px;

  ${({ theme: { palette }, isActive }) =>
    isActive &&
    css`
      &::after {
        content: "";
        position: absolute;
        bottom: 5px;

        display: inline-block;
        width: 16px;
        height: 1px;
        background-color: ${palette.grey500};
      }
    `};

  color: #000;
  font-family: "Spoqa Han Sans Neo";
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.10000000149011612px;
  text-align: center;

  cursor: pointer;
`;

export default Pagination;
