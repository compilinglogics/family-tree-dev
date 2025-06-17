import { Navigate } from "react-router-dom";
import { getLocalStorageData } from "../../common/commonFunction/commonFunction";
import PropTypes from 'prop-types';

const ProtectedRoutes = ({ children }) => {
    const token = getLocalStorageData("token");
    return token ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoutes


ProtectedRoutes.propTypes = {
    children: PropTypes.any
};