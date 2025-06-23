import React, { useEffect, useState } from 'react';
import CommonLine from '../CommonLine/CommonLine';
import axios from 'axios';

const TermsOfUse = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTerms = async () => {
    try {
      const res = await axios.get("http://157.173.222.27:3002/api/v1/policy/get/terms");
      const htmlContent = res?.data?.data?.content || "";
      setContent(htmlContent);
    } catch (err) {
      console.error("Failed to fetch terms:", err);
      setContent("<p>Unable to load terms at this time.</p>");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <>
      <CommonLine title="Terms of Use" />
      <div className="rounded_border bg_secondary p-3">
        {loading ? (
          <p>Loading terms...</p>
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

export default TermsOfUse;
