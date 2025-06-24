import React from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";

const CookiePopup = () => {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Accept"
            declineButtonText="Decline"
            enableDeclineButton
            cookieName="userConsent"
            style={{
                background: "#fff",
                color: "#333",
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "320px",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: "1000",
                textAlign: "left"
            }}
            buttonStyle={{
                background: "#4caf50",
                color: "#fff",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                marginRight: "8px"
            }}
            declineButtonStyle={{
                background: "#d32f2f",
                color: "#fff",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
            }}
            expires={365}
        >
            <b>🍪 We use cookies!</b> <br />
            This website uses cookies to improve your experience.  
            <a href="/cookie" style={{ color: "#007bff", textDecoration: "none" }}> Learn more</a>.
        </CookieConsent>
    );
};

export default CookiePopup;
