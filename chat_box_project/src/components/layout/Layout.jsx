import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SideNav from "./SideNav";
import { Container, Row, Col } from "react-bootstrap";

const Layout = () => {
  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs={12}>
          <Header />
        </Col>
      </Row>
      <Row >
        <Col xs={1} className="p-0">
          <SideNav />
        </Col>
        <Col xs={11} className="p-3">
          <main className="App">
            <Outlet />
          </main>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Footer />
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
