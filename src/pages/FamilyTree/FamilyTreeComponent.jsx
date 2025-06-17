import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import './FamilyTree.css'; // Add your CSS file here
import { familyTree } from "../../utils/familytreeApi";

const FamilyTreeComponent = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [familyData, setFamilyData] = useState([]);

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        const data = await familyTree(userId); 
        setFamilyData(data.relatives);
      } catch (error) {
        console.error("Failed to fetch family data:", error);
      }
    };

    fetchFamilyData();
  }, [userId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://balkan.app/js/FamilyTree.js";
    script.async = true;
    script.onload = () => {
      if (window.FamilyTree) {
        initializeFamilyTree();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [familyData]);

  const initializeFamilyTree = () => {
    const options = getOptions();
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

    chart.on('click', function(sender, args) {
      const clickedId = args.node.id;
      const newUrl = `/tree-app/${userId}?id=${clickedId}`;
      if (location.pathname + location.search !== newUrl) {
        navigate(newUrl);
      }
      return false;
    });

    chart.load(familyData);
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

  return <div id="tree" style={{ width: "100%", height: "100%" }} />;
};

export default FamilyTreeComponent;
