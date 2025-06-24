import React from "react";
import "./Policy.scss";
import { Container } from "react-bootstrap";
import CommonLine from "../CommonLine/CommonLine";

const Cookie = () => {
  return (
    <div className="cookie-policy web-bg-primary min-h-screen py-5">
      <Container>
        <CommonLine title="Cookie Policy" />

        <div className="rounded_border bg_secondary p-3">
          <p className="same_poppins_2 fw-500 mb-2">Cookies Policy</p>

          <p className="same_poppins_3 mb-3">
            This Cookie Notice describes what types of cookies Rmmbr.me use in connection with our Service, and how you can manage them.
          </p>

          <p className="same_poppins_2 fw-500 mb-2">Types of cookies</p>
          <p className="same_poppins_3 mb-3">
            Cookies are small files that are placed on your device when you interact with online services. Cookies can help services remember information such as your language settings or when you logged in, which can improve your experience of online services. Cookies can also be used to help online services troubleshoot errors and better understand how users interact with the service. We may also use third-party cookies (from other service providers) to support delivery of our Service.
          </p>

          <p className="same_poppins_2 fw-500 mb-2">Managing cookies</p>
          <p className="same_poppins_3 mb-3">
            You may be able to choose which cookies are used when using our Service. Depending on your jurisdiction, you can access your cookie settings by clicking here⁠. If you refuse “Analytics” cookies, the functionality of the Rmmbr.me Service could be affected. Cookies listed as “Essential” are required for the Service to function and cannot be disabled. Your browser may allow you to manage your cookie preferences, including to delete and disable cookies. If you choose to disable cookies, some features of our Service may not operate as intended.
          </p>

          <p className="same_poppins_2 fw-500 mb-2">Essential cookies</p>
          <p className="same_poppins_3 mb-3">
            These cookies are essential to operate our Service. For example, they allow us to authenticate users or enable specific features within our Service, including for security purposes. You will not be able to disable essential cookies.
          </p>

          <p className="same_poppins_2 fw-500 mb-2">Analytics cookies</p>
          <p className="same_poppins_3 mb-3">
            These cookies help us understand how our Service perform and how it is being used including the number of users and how they interact with our Service.
          </p>

          <p className="same_poppins_2 fw-500 mb-2">Additional information</p>
          <p className="same_poppins_3 mb-3">
            For more information, please visit <a href="https://www.allaboutcookies.org">www.allaboutcookies.org</a> and <a href="https://www.youronlinechoices.eu">www.youronlinechoices.eu</a>.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Cookie;
