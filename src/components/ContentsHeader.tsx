import styled from "styled-components";

const ContentsHeader = ({ headerName }: { headerName: string }) => {
  return <Container>{headerName}</Container>;
};

const Container = styled.div`
  background-color: blue;
  padding: 16px 56px;
`;

export default ContentsHeader;
