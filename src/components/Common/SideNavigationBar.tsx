import styled from "styled-components";

const SideNavigationBar = () => {
  return <Container></Container>;
};

const Container = styled.div`
  width: 210px;
  height: calc(100vh - 56px);
  background-color: ${({ theme: { palette } }) => palette.grey700};

  position: fixed;
  left: 0;
  top: 56px;
  z-index: 9999;
`;

export default SideNavigationBar;
