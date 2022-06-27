import { useEffect } from "react";
import { useLocation, useHref } from "react-router-dom";
import styled from "styled-components";

import Layout from "@components/Layout";

const OAuth = () => {
  useEffect(() => {
    console.log("redirect to oauth page!");
    console.log(location);
  }, []);

  return <Container></Container>;
};

const Container = styled.div``;

export default OAuth;
