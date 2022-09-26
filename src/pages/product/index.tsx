import styled from "styled-components";

import Layout from "@components/common/Layout";
import ContentsContainer from "@components/common/ContentsContainer";
import ContentsHeader from "@components/common/ContentsHeader";
import Button from "@components/common/Button";

const Product = () => {
  return (
    <Layout>
      <ContentsContainer>
        <ContentsHeader headerName="상품관리"></ContentsHeader>
        <FilterBar>
          <FilterItem>전체</FilterItem>
          <FilterItem>판매중</FilterItem>
          <FilterItem>숨김</FilterItem>
          <FilterItem>품절</FilterItem>
        </FilterBar>

        <ProductManagerContainer>
          <ControllerContainer>
            <Button size="small" backgroundColor="white">
              판매상태 변경
            </Button>
            <Button size="small" backgroundColor="white">
              카테고리 변경
            </Button>
            <Button size="small" backgroundColor="white">
              할인율 변경
            </Button>
            <Button size="small" backgroundColor="white">
              복제
            </Button>
            <Button size="small" backgroundColor="white">
              삭제
            </Button>
          </ControllerContainer>

          <ProductListTable>
            <tr>
              <th>상품 번호</th>
              <th>-</th>
              <th>상품명</th>
            </tr>
            <tr>
              <td>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Possimus tempora ipsam nisi adipisci repellat veritatis est
                maiores voluptas excepturi aperiam quod aliquid, ipsa error vero
                libero neque vel amet quo nemo unde? Fugiat repellendus ab
                tenetur odio facere inventore qui, nihil rem enim repudiandae
                aperiam reiciendis dolores? Quidem, animi earum.
              </td>
              <td>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi explicabo doloribus earum nihil tempore facere
                molestiae vel? Exercitationem necessitatibus quibusdam explicabo
                perspiciatis natus ipsa expedita tenetur eius, facere officia
                optio architecto ipsam accusantium modi. Adipisci, doloremque
                debitis rem quis accusamus temporibus veniam et natus fugit! Est
                accusantium porro autem fugiat.
              </td>
              <td>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                sit sint hic animi consectetur? Odit officia aperiam, quam,
                commodi aut, saepe ipsa rem nisi quasi sequi tempora
                perspiciatis porro laboriosam! Optio deserunt molestias
                excepturi repellendus ullam nihil aliquam deleniti similique
                animi maxime dolores sapiente, temporibus quae dolore harum
                consequuntur asperiores.
              </td>
            </tr>
            <tr>
              <td>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni,
                cum odit necessitatibus eum nemo, repellat voluptates incidunt
                in laborum consectetur quo facilis distinctio neque excepturi!
                Sunt nulla incidunt velit animi.
              </td>
              <td>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
                laudantium?
              </td>
              <td>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Veritatis placeat laboriosam nulla labore numquam. Aliquid
                placeat amet molestias officiis magni possimus, corporis
                architecto blanditiis suscipit.
              </td>
            </tr>
          </ProductListTable>
        </ProductManagerContainer>
      </ContentsContainer>
    </Layout>
  );
};

const FilterBar = styled.ul`
  background-color: pink;
  padding: 1em;

  display: flex;
`;

const FilterItem = styled.li`
  background-color: yellow;
  padding: 1em;
  margin-right: 1em;
`;

const ProductManagerContainer = styled.div`
  background-color: greenyellow;
`;

const ControllerContainer = styled.div`
  background-color: red;
  padding: 1em;

  display: flex;

  & > button {
    margin-right: 1em;
  }
`;

const ProductListTable = styled.table`
  background-color: skyblue;
`;

export default Product;
