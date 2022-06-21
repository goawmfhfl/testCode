import GlobalNavigationBar from "@components/GlobalNavigationBar";
import Footer from "@components/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <GlobalNavigationBar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
