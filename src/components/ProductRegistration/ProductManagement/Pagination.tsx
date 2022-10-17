import React, { useEffect, useState } from "react";
import styled from "styled-components";
import mediumDoubleLeftActiveSvg from "@icons/medium-double-left-active.svg";
import mediumDoubleRightActiveSvg from "@icons/medium-double-right-active.svg";
import mediumLeftActvieSvg from "@icons/medium-left-active.svg";
import mediumRightActiveSvg from "@icons/medium-right-active.svg";
import { useReactiveVar } from "@apollo/client";
import {
  filterOptionPageNumberVar,
  pageNumberListVar,
} from "@cache/ProductManagement";

const Pagination = () => {
  const filterOptionPageNumber = useReactiveVar(filterOptionPageNumberVar);
  const pageNumberList = useReactiveVar(pageNumberListVar);

  const [pageList, setPageList] = useState<Array<number>>(
    pageNumberList.slice(0 * 10, (0 + 1) * 10)
  );
  const [skip, setSkipPage] = useState<number>(0);

  const handlePageNumberClick = (pageNumber: number) => () => {
    filterOptionPageNumberVar(pageNumber);
  };

  const handleNextPageClick = () => {
    const totalSkipPage: number = Math.floor(pageNumberList.length / 10);
    if (skip >= totalSkipPage) return;

    setSkipPage((prev) => prev + 1);
    filterOptionPageNumberVar((skip + 1) * 10 + 1);
  };

  const handlePrevPageClick = () => {
    if (skip <= 0) return;

    setSkipPage((prev) => prev - 1);
    filterOptionPageNumberVar(skip * 10);
  };

  const handleStartPageClick = () => {
    setSkipPage(0);
    filterOptionPageNumberVar(1);
  };

  const handleEndPageClick = () => {
    const totalSkipPage: number = Math.floor(pageNumberList.length / 10);
    setSkipPage(totalSkipPage);
    filterOptionPageNumberVar(pageNumberList.length);
  };

  useEffect(() => {
    const newPageList = pageNumberList.slice(skip * 10, (skip + 1) * 10);
    setPageList(newPageList);
  }, [skip, pageNumberList]);

  return (
    <Container>
      <SkipButton
        src={mediumDoubleLeftActiveSvg}
        onClick={handleStartPageClick}
      />
      <SkipButton src={mediumLeftActvieSvg} onClick={handlePrevPageClick} />
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
      <SkipButton src={mediumRightActiveSvg} onClick={handleNextPageClick} />
      <SkipButton
        src={mediumDoubleRightActiveSvg}
        onClick={handleEndPageClick}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: #fff;
`;

const SkipButton = styled.img`
  width: 50px;
  height: 50px;
`;

const PageNumberList = styled.ul`
  width: 100%;
  display: flex;
`;

const PageItem = styled.li<{ isActive: boolean }>`
  margin: 0 5px;

  padding: 0.3rem;

  background-color: ${({ theme: { palette }, isActive }) =>
    isActive ? palette.red500 : palette.grey500};

  color: #fff;

  cursor: pointer;
`;

export default Pagination;
