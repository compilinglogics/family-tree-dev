import React, { useState, useEffect } from "react";
import './FamilyTree.css';  // Add your CSS file here
import axios from "axios";

const FamilyTreeComponentNew = () => {
  const [familyData, setFamilyData] = useState(null); // State to hold API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch data from the API when the component mounts
    axios.get("https://api.example.com/family-tree") // Replace with your actual API endpoint
      .then(response => {
        setFamilyData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Dynamically load the FamilyTree.js script
    const script = document.createElement("script");
    script.src = "https://balkan.app/js/FamilyTree.js";
    script.async = true;
    script.onload = () => {
      if (window.FamilyTree && familyData) {
        initializeFamilyTree(familyData); // Initialize the family tree once the script and data are loaded
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up the script when the component unmounts
    };
  }, [familyData]); // UseEffect depends on familyData

  const initializeFamilyTree = (data) => {
    const options = getOptions();

    // Check if FamilyTree is defined before using it
    if (window.FamilyTree) {
      const chart = new window.FamilyTree(document.getElementById("tree"), {
        mouseScrool: window.FamilyTree.none,
        scaleInitial: options.scaleInitial,
        siblingSeparation: 120,
        template: "john",
        nodeBinding: {
          field_0: "name",
          field_1: "title",
          img_0: "img",
        },
      });

      // Load data from the API into the chart
      chart.load(data);
    }
  };

  const getOptions = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const fit = searchParams.get("fit");
    let scaleInitial = 1;
    if (fit === "yes") {
      scaleInitial = window.FamilyTree.match.boundary;
    }
    return { scaleInitial };
  };

  // Render loading state, error message, or the family tree
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div id="tree" style={{ width: "100%", height: "100%" }} />;
};

export default FamilyTreeComponentNew;
