import { Outlet } from "react-router-dom";
import ProtectedRoutes from "../../routes/ProtectedRoute/ProtectedRoutes";
import "./Dashboard.scss";
import Navigation from "../../components/Navigation/Navigation";
import { Container } from "react-bootstrap";

const Dashboard = () => {
  return (
    <ProtectedRoutes>
    <div className="web-bg-primary min-h-screen">
      <Container>
        <Navigation />
        <Outlet />
      </Container>
    </div>
     </ProtectedRoutes>
  );
};

export default Dashboard;
