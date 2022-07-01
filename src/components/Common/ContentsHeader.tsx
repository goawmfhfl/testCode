import styled from "styled-components";

const ContentsHeader = ({ headerName }: { headerName: string }) => {
  return (
    <Container>
      <Text>{headerName}</Text>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${({ theme: { palette } }) => palette.white};
  padding: 16px 56px;
  margin-bottom: 12px;
`;

const Text = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.015em;
`;

export default ContentsHeader;
