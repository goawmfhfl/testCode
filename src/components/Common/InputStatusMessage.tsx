import styled from "styled-components";

const InputStatusMessage = ({
  children,
  color,
  topMargin,
  bottomMargin,
}: {
  children: string;
  color: string;
  topMargin?: string;
  bottomMargin?: string;
}) => {
  return (
    <Container color={color} topMargin={topMargin} bottomMargin={bottomMargin}>
      {children}
    </Container>
  );
};

const Container = styled.div<{
  color: string;
  topMargin: string;
  bottomMargin: string;
}>`
  color: ${({ color }) => color};

  margin-top: ${({ topMargin }) => (topMargin ? topMargin : "")};
  margin-bottom: ${({ bottomMargin }) => (bottomMargin ? bottomMargin : "")};

  font-family: "Spoqa Han Sans Neo";
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
`;

export default InputStatusMessage;
