import React, { useEffect, useState } from 'react';
import CommonLine from '../CommonLine/CommonLine';
import axios from 'axios';

const PrivacyPolicy = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPrivacy = async () => {
    try {
      const res = await axios.get("http://157.173.222.27:3002/api/v1/policy/get/privacy");
      const htmlContent = res?.data?.data?.content || "";
      setContent(htmlContent);
    } catch (err) {
      console.error("Failed to fetch privacy policy:", err);
      setContent("<p>Unable to load privacy policy at this time.</p>");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacy();
  }, []);

  return (
    <>
      <CommonLine title="Privacy Policy" />
      <div className="rounded_border bg_secondary p-3">
        {loading ? (
          <p>Loading privacy policy...</p>
        ) : (
          <div
            className="same_poppins_3 mb-3"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </>
  );
};

export default PrivacyPolicy;
