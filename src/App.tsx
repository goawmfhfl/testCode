import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components/macro";
import { useReactiveVar } from "@apollo/client";

import GlobalStyles from "@styles/GlobalStyles";
import theme from "@styles/theme";
import { modalVar, overModalVar, systemModalVar } from "@cache/index";
import { Pathnames } from "@constants/index";

import Home from "@pages/Home";
import Login from "@pages/Login";
import OAuth from "@pages/OAuth";
import ShopSetting from "@pages/ShopSetting";
import ProductManagement from "@pages/product/index";
import ProductRegistration from "@pages/product/Registration";
import ProductModification from "@pages/product/Modification";
import Sale from "@pages/Sale";
import Inquiry from "@pages/Inquiry";
import Settlement from "@pages/Settlement";
import Notice from "@pages/Notice";
import Error from "@pages/Error";
import Password from "@pages/Password";
import TestOperator from "@pages/TestOperator";

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
          <Route path={Pathnames.Home} element={<Home />} />
          <Route path={Pathnames.Login} element={<Login />} />
          <Route path={Pathnames.Password} element={<Password />} />
          <Route path="oauth" element={<OAuth />}>
            <Route path=":oauthProvider" element={<OAuth />} />
          </Route>
          <Route path={Pathnames.Shop} element={<ShopSetting />} />
          <Route path={Pathnames.Product} element={<ProductManagement />} />
          <Route
            path={Pathnames.ProductRegistration}
            element={<ProductRegistration />}
          />
          <Route
            path={`${Pathnames.Product}/:productId`}
            element={<ProductModification />}
          />
          <Route path={Pathnames.Sale} element={<Sale />} />
          <Route path={Pathnames.Inquiry} element={<Inquiry />} />
          <Route path={Pathnames.Settlement} element={<Settlement />} />
          <Route path={Pathnames.Notice} element={<Notice />} />
          <Route path={Pathnames.Error} element={<Error />} />
          <Route path={"/test"} element={<TestOperator />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
