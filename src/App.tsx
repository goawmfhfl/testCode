import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useReactiveVar } from "@apollo/client";

import Home from "@pages/Home";
import Login from "@pages/Login";
import OAuth from "@pages/OAuth";
import ShopSetting from "@pages/ShopSetting";
import ProductRegistration from "@pages/ProductRegistration";
import GlobalStyles from "@styles/GlobalStyles";
import theme from "@styles/theme";
import { modalVar, overModalVar, systemModalVar } from "@cache/index";

function App() {
  const modal = useReactiveVar(modalVar);
  const overModal = useReactiveVar(overModalVar);
  const systemModal = useReactiveVar(systemModalVar);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          isModalVisible={
            modal.isVisible || overModal.isVisible || systemModal.isVisible
          }
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="oauth" element={<OAuth />}>
            <Route path=":oauthProvider" element={<OAuth />} />
          </Route>
          <Route path="shopSetting" element={<ShopSetting />} />
          <Route
            path="/productRegistration"
            element={<ProductRegistration />}
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
