import './AuthWarapper.scss'
// import logo from "../../assets/images/logo-white.svg";
import logo from "../../assets/images/logoAuth.png";
import { Outlet } from 'react-router-dom'

const AuthWarapper = () => {
    return (
        <section className="login-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 d-flex justify-content-center align-items-center">
                        <div className="logo-place">
                            <img src={logo} alt="loading-img" />
                        </div>
                    </div>
                    <div className="col-lg-6 my-4 d-flex justify-content-center align-items-center">
                        <div className="login-box">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AuthWarapper
