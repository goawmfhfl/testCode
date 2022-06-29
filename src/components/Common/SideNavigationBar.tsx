import styled from "styled-components";

const SideNavigationBar = () => {
  return <Container></Container>;
};

const Container = styled.div`
  width: 210px;
  height: calc(100vh - 56px);
  background-color: ${({ theme: { palette } }) => palette.grey900};

  position: fixed;
  left: 0;
  top: 56px;
`;

export default SideNavigationBar;
