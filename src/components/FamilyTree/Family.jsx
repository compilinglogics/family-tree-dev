import React, { useEffect, useState } from "react";
import { familyTree } from "../../utils/familytreeApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFamilyDataList } from "../../store/feature/treeSlice";

const Family = () => {
  // const { userId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [familyData, setFamilyData] = useState([]);
  const [familyData2, setFamilyData1] = useState([
    {
      id: 0,
      pids: [1],
      name: "Richard",
      gender: "female",
      img: "http://157.173.222.27:3002/api/v1/user/get-image/0859-Screenshot-2024-11-07-at-12.00.04-AM.png",
      dob: "1992-01-01T00:00:00.000Z",
      country: "Country 1",
      city: "City 1",
      tags: ["female"],
    },
    {
      id: 1,
      pids: [3, 4, 4, null, null, null],
      fid: 2,
      name: "Pankaj Kushwah",
      gender: "male",
      img: "https://cdn.balkan.app/shared/f14.png",
      dob: "2001-02-18T00:00:00.000Z",
      country: "",
      city: "Indore",
      relation: "Current Partner",
      tags: ["male"],
    },
    {
      id: 2,
      pids: [],
      name: "Arvind Kumar gupta",
      gender: "male",
      img: "https://cdn.balkan.app/shared/f14.png",
      dob: "2001-02-17T18:30:00.000Z",
      country: "Bharat",
      city: "Indore",
      relation: "Sibling",
      tags: ["male"],
    },
    {
      id: 3,
      pids: [],
      fid: 2,
      name: "Anand",
      gender: "male",
      img: "https://cdn.balkan.app/shared/f14.png",
      dob: "2001-02-17T18:30:00.000Z",
      country: "Bharat",
      city: "Indore",
      tags: ["male"],
    },
    {
      id: 4,
      pids: [1],
      name: "Sheetal",
      gender: "female",
      img: "https://cdn.balkan.app/shared/f13.png",
      dob: "2024-10-17T00:00:00.000Z",
      country: "Country 1",
      city: "City 1",
      tags: ["female"],
    },
    {
      id: 15,
      pids: [],
      fid: 2,
      name: "arvind new",
      gender: "non-binary",
      img: "http://157.173.222.27:3002/api/v1/user/get-image/0423-Screenshot-2024-10-19-at-1.36.39â\u0080¯AM.png",
      dob: "2024-11-01T00:00:00.000Z",
      country: "Country 1",
      city: "City 1",
      relation: "Child",
      tags: ["non-binary"],
    },
  ]);

  useEffect(() => {
    const fetchFamilyData = async () => {
      // console.log("useruseruser", user);

      try {
        const data = await familyTree(user._id);
        setFamilyData(data.relatives);
        dispatch(setFamilyDataList(data.relatives));
        // console.log("familyDatafamilyData", familyData);
      } catch (error) {
        console.error("Failed to fetch family data:", error);
      }
    };

    fetchFamilyData();
  }, []);

  useEffect(() => {
    // Step 1: Dynamically load the FamilyTree.js script
    const script = document.createElement("script");
    script.src = "https://balkan.app/js/FamilyTree.js";
    script.async = true;
    script.onload = () => {
      if (window.FamilyTree) {
        // console.log("FamilyTree loaded successfully.");

        // Step 3: Define all templates: "main", "main_male", and "main_female"
        defineTemplates();

        // Step 4: Initialize FamilyTree
        initFamilyTree();
      } else {
        console.error("FamilyTree script did not load properly.");
      }
    };

    // Handle any script loading errors
    script.onerror = () => {
      console.error("Error loading FamilyTree.js");
    };

    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [familyData]);

  // Function to define the necessary templates
  const defineTemplates = () => {
    // Define the "main" template
    FamilyTree.templates.base.defs = `<g transform="matrix(0.05,0,0,0.05,-12,-9)" id="line">
            <path fill="#2bad28" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909  l-8.431-8.909C181.284,5.762,98.663,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778 c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654 c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z"/>
            </g>
         <g transform="matrix(1,0,0,1,0,0)" id="dot"></g>
          <g id="base_node_menu" style="cursor:pointer;">
              <rect x="0" y="0" fill="transparent" width="22" height="22"></rect>
              <circle cx="4" cy="11" r="2" fill="#b1b9be"></circle>
              <circle cx="11" cy="11" r="2" fill="#b1b9be"></circle>
              <circle cx="18" cy="11" r="2" fill="#b1b9be"></circle>
          </g>
          <g style="cursor: pointer;" id="base_tree_menu">
              <rect x="0" y="0" width="25" height="25" fill="transparent"></rect>
              ${FamilyTree.icon.addUser(25, 25, "#fff", 0, 0)}
          </g>
          <g style="cursor: pointer;" id="base_tree_menu_close">
              <circle cx="12.5" cy="12.5" r="12" fill="#F57C00"></circle>
              ${FamilyTree.icon.close(25, 25, "#fff", 0, 0)}
          </g>            
          <g id="base_up">
              <circle cx="15" cy="0" r="15" fill="#fff" stroke="#b1b9be" stroke-width="1"></circle>
              ${FamilyTree.icon.ft(20, 20, "#b1b9be", 5, -10)}
          </g>
          <clipPath id="base_img_0">
            <circle id="base_img_0_stroke" cx="100" cy="62" r="35"/>
          </clipPath>
          <clipPath id="base_img_1">
            <circle id="base_img_1_stroke" cx="100" cy="62" r="35"/>
          </clipPath>
          `;

    FamilyTree.templates.main = Object.assign({}, FamilyTree.templates.base);
    FamilyTree.templates.main.size = [200, 200];
    FamilyTree.templates.main.defs = `<style>
                                            .{randId} .bft-edit-form-header, .{randId} .bft-img-button{
                                                background-color: #aeaeae;
                                            }
                                            .{randId}.male .bft-edit-form-header, .{randId}.male .bft-img-button{
                                                background-color: #6bb4df;
                                            }        
                                            .{randId}.male div.bft-img-button:hover{
                                                background-color: #cb4aaf;
                                            }
                                            .{randId}.female .bft-edit-form-header, .{randId}.female .bft-img-button{
                                                background-color: #cb4aaf;
                                            }        
                                            .{randId}.female div.bft-img-button:hover{
                                                background-color: #6bb4df;
                                            }
        </style>`;
    FamilyTree.templates.main.nodeMenuButton = `<g style="cursor:pointer;" transform="matrix(1,0,0,1,93,15)" data-ctrl-n-menu-id="{id}">
            <rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect>
            <line x1="0" y1="0" x2="0" y2="3" stroke-width="2" stroke="rgb(0, 0, 0)" />
            <line x1="7" y1="0" x2="7" y2="3" stroke-width="2" stroke="rgb(0, 0, 0)" />
            <line x1="14" y1="0" x2="14" y2="3" stroke-width="2" stroke="rgb(0, 0, 0)" />
        </g>`;
    FamilyTree.templates.main.node =
      '<rect x="0" y="0" height="{h}" width="{h}" fill="#ffffff" stroke-width="3" stroke="#6bb4df" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#6bb4df" rx="5" ry="5"></rect>';
    FamilyTree.templates.main.field_0 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 14px;" font-variant="all-small-caps"  font-weight="bold" fill="black" x="100" y="115" text-anchor="middle">{val}</text>';
    FamilyTree.templates.main.field_1 =
      "<text " +
      FamilyTree.attr.width +
      ' ="190" data-text-overflow="multiline" style="font-size: 16px;" fill="black" x="100" y="135" text-anchor="middle">{val}</text>';
    FamilyTree.templates.main.field_2 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.main.field_3 =
      "<text " +
      FamilyTree.attr.width +
      ' ="60" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';

    FamilyTree.templates.main.img_0 = `<clipPath id="ulaImg">
       <rect x="60" y="26" width="80" height="80"></rect>
        </clipPath>
        <image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="60" y="26" width="80" height="80"></image>`;
    FamilyTree.templates.main_male = Object.assign(
      {},
      FamilyTree.templates.main
    );
    FamilyTree.templates.main_male.node =
      '<rect x="0" y="0" height="{h}" width="{h}" fill="#ffffff" stroke-width="3" stroke="#6bb4df" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#6bb4df" rx="5" ry="5"></rect>';
    FamilyTree.templates.main_other = Object.assign(
      {},
      FamilyTree.templates.main
    );
    FamilyTree.templates.main_other.node = `
                <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" fill="#ffffff" stroke-width="3" stroke="#ffad00"></polygon>`;

    FamilyTree.templates.main_male.img_0 = `<clipPath id="ulaImg">
       <rect x="60" y="26" width="80" height="80"></rect>
        </clipPath>
        <image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="60" y="26" width="80" height="80"></image>`;
    FamilyTree.templates.main_male_child = Object.assign(
      {},
      FamilyTree.templates.main_male
    );
    FamilyTree.templates.main_male_child.link =
      '<path stroke-linejoin="round" stroke="#2bad28" stroke-width="2px" fill="none" d="{rounded}" />';

    FamilyTree.templates.main_female = Object.assign(
      {},
      FamilyTree.templates.main_male
    );
    FamilyTree.templates.main_female.node =
      '<rect x="0" y="0" height="{h}" width="{h}" fill="#ffffff" stroke-width="3" stroke="#6bb4df" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#6bb4df" rx="5" ry="5"></rect>';
    FamilyTree.templates.main_female.img_0 = `<use xlink:href="#base_img_0_stroke" /> 
           <circle id="base_img_0_stroke" fill="#cb4aaf" cx="100" cy="62" r="37"/>
          <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="65" y="26" width="72" height="72"></image>`;
    FamilyTree.templates.main_female_child = Object.assign(
      {},
      FamilyTree.templates.main_female
    );
    FamilyTree.templates.main_female_child.link =
      '<path stroke-linejoin="round" stroke="#2bad28" stroke-width="2px" fill="none" d="{rounded}" />';

    FamilyTree.templates.step = Object.assign({}, FamilyTree.templates.main);
    FamilyTree.templates.step.defs = `<style>
                                            .{randId} .bft-edit-form-header, .{randId} .bft-img-button{
                                                background-color: #aeaeae;
                                            }
                                            .{randId}.male .bft-edit-form-header, .{randId}.male .bft-img-button{
                                                background-color: #F68C20;
                                            }        
                                            .{randId}.male div.bft-img-button:hover{
                                                background-color: #cb4aaf;
                                            }
                                            .{randId}.female .bft-edit-form-header, .{randId}.female .bft-img-button{
                                                background-color: #F68C20;
                                            }        
                                            .{randId}.female div.bft-img-button:hover{
                                                background-color: #6bb4df;
                                            }
        </style>`;
    FamilyTree.templates.step.node =
      '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#F68C20" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="20" width="{w}" fill="#F68C20" stroke-width="1" stroke="#F68C20" rx="5" ry="5"></rect>' +
      '<line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="#F68C20"></line>';
    FamilyTree.templates.step.img_0 = `<use xlink:href="#base_img_0_stroke"/> 
           <circle id="base_img_0_stroke" fill="#F68C20" cx="45" cy="62" r="37"/>
          <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="10" y="26" width="72" height="72"></image>`;
    FamilyTree.templates.step.link =
      '<path stroke-dasharray="4, 2" stroke-linejoin="round" stroke="#F68C20" stroke-width="1px" fill="none" d="{rounded}" />';
    FamilyTree.templates.single = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.single.size = [200, 200];
    FamilyTree.templates.single.defs = `<style>
                                            .{randId} .bft-edit-form-header, .{randId} .bft-img-button{
                                                background-color: #aeaeae;
                                            }
                                            .{randId}.male .bft-edit-form-header, .{randId}.male .bft-img-button{
                                                background-color: #6bb4df;
                                            }        
                                            .{randId}.male div.bft-img-button:hover{
                                                background-color: #cb4aaf;
                                            }
                                            .{randId}.female .bft-edit-form-header, .{randId}.female .bft-img-button{
                                                background-color: #cb4aaf;
                                            }        
                                            .{randId}.female div.bft-img-button:hover{
                                                background-color: #6bb4df;
                                            }
        </style>`;
    FamilyTree.templates.single.node =
      '<rect x="0" y="0" height="{h}" width="{h}" fill="#ffffff" stroke-width="3" stroke="#6bb4df" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#6bb4df" rx="5" ry="5"></rect>';
    FamilyTree.templates.single.field_0 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 14px;" font-variant="all-small-caps"  font-weight="bold" fill="black" x="100" y="115" text-anchor="middle">{val}</text>';
    FamilyTree.templates.single.field_1 =
      "<text " +
      FamilyTree.attr.width +
      ' ="190" data-text-overflow="multiline" style="font-size: 16px;" fill="black" x="100" y="135" text-anchor="middle">{val}</text>';
    FamilyTree.templates.single.field_2 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.single.field_3 =
      "<text " +
      FamilyTree.attr.width +
      ' ="60" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.single.nodeMenuButton = `<use ${FamilyTree.attr.control_node_menu_id}="{id}" x="89" y="5" xlink:href="#base_node_menu" />`;
    FamilyTree.templates.single_male = Object.assign(
      {},
      FamilyTree.templates.single
    );
    FamilyTree.templates.single_male.node =
      '<rect x="0" y="0" height="{h}" width="{h}" fill="#ffffff" stroke-width="3" stroke="#6bb4df" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#6bb4df" rx="5" ry="5"></rect>';
    FamilyTree.templates.single_male.img_0 = `<clipPath id="ulaImg">
           <rect x="60" y="26" width="80" height="80"></rect>
            </clipPath>
            <image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="60" y="26" width="80" height="80"></image>`;
    FamilyTree.templates.single_female = Object.assign(
      {},
      FamilyTree.templates.single_male
    );
    FamilyTree.templates.single_female.node =
      '<rect x="0" y="0" height="{h}" width="{h}" fill="#ffffff" stroke-width="3" stroke="#6bb4df" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#6bb4df" rx="5" ry="5"></rect>';
    FamilyTree.templates.single_female.img_0 = `<use xlink:href="#base_img_1_stroke"/> 
           <circle id="base_img_1_stroke" fill="#cb4aaf" cx="100" cy="62" r="37"/>
          <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_1)" xlink:href="{val}" x="65" y="26" width="72" height="72"></image>`;

    FamilyTree.templates.family_single_male = Object.assign(
      {},
      FamilyTree.templates.single_male
    );
    FamilyTree.templates.family_single_male.link =
      '<path stroke-linejoin="round" stroke="#2bad28" stroke-width="2px" fill="none" d="{rounded}" />';
    FamilyTree.templates.family_single_female = Object.assign(
      {},
      FamilyTree.templates.single_female
    );
    FamilyTree.templates.family_single_female.link =
      '<path stroke-linejoin="round" stroke="#2bad28" stroke-width="2px" fill="none" d="{rounded}" />';

    FamilyTree.templates.single_step = Object.assign(
      {},
      FamilyTree.templates.single_male
    );
    FamilyTree.templates.single_step.node =
      '<rect x="0" y="0" height="{h}" width="{h}" fill="#ffffff" stroke-width="3" stroke="#6bb4df" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#6bb4df" rx="5" ry="5"></rect>';
    FamilyTree.templates.single_step.img_0 = `<use xlink:href="#base_img_1_stroke"/> 
           <circle id="base_img_1_stroke" fill="#F68C20" cx="100" cy="62" r="37"/>
          <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_1)" xlink:href="{val}" x="65" y="26" width="72" height="72"></image>`;
    FamilyTree.templates.single_step.link =
      '<path stroke-linejoin="round" stroke-dasharray="6, 4" stroke="#F68C20" stroke-width="1px" fill="none" d="{rounded}" />';

    FamilyTree.templates.group = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.group.size = [250, 120];
    FamilyTree.templates.group.node =
      '<rect rx="50" ry="50" x="0" y="0" height="{h}" width="{w}" fill="#d9d9d9" stroke-width="3" stroke="#d9d9d9"></rect>';
    FamilyTree.templates.group.nodeMenuButton = "";
    FamilyTree.templates.group.field_0 =
      '<text data-width="220" style="font-size: 18px;" fill="black" x="{cw}" y="30" text-anchor="middle">' +
      "{val}</text>";
    FamilyTree.templates.group.field_1 = "";

    FamilyTree.templates.group.ripple = {
      radius: 50,
      color: "#aeaeae",
    };

    FamilyTree.templates.group.min = Object.assign(
      {},
      FamilyTree.templates.group
    );
    FamilyTree.templates.group.min.img_0 = "";
    FamilyTree.templates.group.min.field_1 = "{val}";
    FamilyTree.templates.group.min.nodeMenuButton = "";
    FamilyTree.orientation.top;

    /// male code....
    FamilyTree.templates.male = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.male.size = [200, 200];
    FamilyTree.templates.male.node =
      '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#ccc" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#b1b9be" rx="5" ry="5"></rect>';

    FamilyTree.templates.male.field_0 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 14px;" font-variant="all-small-caps"  font-weight="bold" fill="black" x="100" y="115" text-anchor="middle">{val}</text>';
    FamilyTree.templates.male.field_1 =
      "<text " +
      FamilyTree.attr.width +
      ' ="190" data-text-overflow="multiline" style="font-size: 16px;" fill="black" x="100" y="135" text-anchor="middle">{val}</text>';
    FamilyTree.templates.male.field_2 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.male.field_3 =
      "<text " +
      FamilyTree.attr.width +
      ' ="100" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.male.nodeMenuButton = `<use ${FamilyTree.attr.control_node_menu_id}="{id}" x="89" y="5" xlink:href="#base_node_menu" />`;

    FamilyTree.templates.male.img_0 = `
      <defs>
        <!-- Define a square clip path -->
        <clipPath id="square_clip">
          <rect x="65" y="26" width="72" height="72" />
        </clipPath>
      </defs>
    
      <!-- Square frame -->
      <rect id="base_img_1_stroke" fill="#6bb4df" stroke="blue" stroke-width="4" x="65" y="26" width="72" height="72" />
    
      <!-- Image clipped within the square -->
      <image
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#square_clip)"
        xlink:href="{val}"
        x="65"
        y="26"
        width="72"
        height="72">
      </image>
    `;
    ///femail code....
    FamilyTree.templates.female = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.female.size = [200, 200];
    FamilyTree.templates.female.node =
      '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#ccc" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#b1b9be" rx="5" ry="5"></rect>';

    FamilyTree.templates.female.field_0 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 14px;" font-variant="all-small-caps"  font-weight="bold" fill="black" x="100" y="115" text-anchor="middle">{val}</text>';
    FamilyTree.templates.female.field_1 =
      "<text " +
      FamilyTree.attr.width +
      ' ="190" data-text-overflow="multiline" style="font-size: 16px;" fill="black" x="100" y="135" text-anchor="middle">{val}</text>';
    FamilyTree.templates.female.field_2 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.female.field_3 =
      "<text " +
      FamilyTree.attr.width +
      ' ="60" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.female.nodeMenuButton = `<use ${FamilyTree.attr.control_node_menu_id}="{id}" x="89" y="5" xlink:href="#base_node_menu" />`;

    FamilyTree.templates.female.img_0 = `<use xlink:href="#base_img_1_stroke"/> 
           <circle id="base_img_1_stroke" fill="#cb4aaf" cx="100" cy="62" r="37"/>
          <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_1)" xlink:href="{val}" x="65" y="26" width="72" height="72"></image>`;
    /// Non binary code.....
    FamilyTree.templates.non_binary = Object.assign(
      {},
      FamilyTree.templates.tommy
    );
    FamilyTree.templates.non_binary.size = [200, 200];
    FamilyTree.templates.non_binary.node =
      '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#ccc" rx="5" ry="5"></rect>' +
      '<rect x="0" y="0" height="0" width="{w}" fill="#6bb4df" stroke-width="1" stroke="#b1b9be" rx="5" ry="5"></rect>';

    FamilyTree.templates.non_binary.field_0 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 14px;" font-variant="all-small-caps"  font-weight="bold" fill="black" x="100" y="115" text-anchor="middle">{val}</text>';
    FamilyTree.templates.non_binary.field_1 =
      "<text " +
      FamilyTree.attr.width +
      ' ="190" data-text-overflow="multiline" style="font-size: 16px;" fill="black" x="100" y="135" text-anchor="middle">{val}</text>';
    FamilyTree.templates.non_binary.field_2 =
      "<text " +
      FamilyTree.attr.width +
      ' ="160" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.non_binary.field_3 =
      "<text " +
      FamilyTree.attr.width +
      ' ="100" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
    FamilyTree.templates.non_binary.nodeMenuButton = `<use ${FamilyTree.attr.control_node_menu_id}="{id}" x="89" y="5" xlink:href="#base_node_menu" />`;
    FamilyTree.templates.non_binary.img_0 = `
      <defs>
        <!-- Define the four-point diamond shape -->
        <clipPath id="diamond_clip">
          <polygon points="100,20 140,60 100,100 60,60" />
        </clipPath>
      </defs>
    
      <!-- Diamond polygon frame -->
      <polygon fill="#6bb4df" points="100,17 143,60 100,103 57,60" />
    
      <!-- Image clipped within the diamond shape -->
      <image
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#diamond_clip)"
        xlink:href="{val}"
        x="50"
        y="10"
        width="100"
        height="100">
      </image>
    `;

    FamilyTree.templates.group.min = Object.assign(
      {},
      FamilyTree.templates.group
    );
    FamilyTree.templates.group.min.img_0 = "";
    FamilyTree.templates.group.min.field_1 = "{val}";
    FamilyTree.templates.group.min.nodeMenuButton = "";
  };

  const initFamilyTree = () => {
    const treeElement = document.getElementById("tree");
    if (!treeElement) {
      console.error("Tree element not found in DOM.");
      return;
    }

    try {
      // Step 5: Initialize FamilyTree instance
      const family = new FamilyTree(treeElement, {
        template: "main",
        miniMap: false,
        zoom: false,
        nodeMenu: {},
        toolbar: {
          fullScreen: true,
          zoom: true,
          fit: true,
          expandAll: true,
        },

        nodeBinding: {
          field_0: "name",
          field_1: "city",
          field_2: "dob",
          img_0: "img",
        },
        orderBy: "orderId",
        tags: {
          step: {
            template: "step",
          },
          single_male: {
            template: "single_male",
          },
          single_female: {
            template: "single_female",
          },
          single_step: {
            template: "single_step",
          },
          main_female_child: {
            template: "main_female_child",
          },
          main_male_child: {
            template: "main_male_child",
          },
          family_single_female: {
            template: "family_single_female",
          },
          family_single_male: {
            template: "family_single_male",
          },
          group: {
            min: true,
            template: "group",
            subTreeConfig: {
              siblingSeparation: 3,
              columns: 2,
            },
          },
          "non-binary": {
            template: "non_binary",
          },
          male: {
            template: "male",
          },
          female: {
            template: "female",
          },
        },
      });

      //////////////////////////////  //////////////////  //////////////////

      // // Event listener on the container
      // treeElement.addEventListener('click', function (event) {
      //     const clickedNode = event.target.closest('rect, image'); // Check if clicked element is a profile node

      //     if (clickedNode) {
      //         // Extract the ID from the parent node or SVG element
      //         const nodeId = clickedNode.closest('.balkangraph-node')?.getAttribute('data-id');
      //         if (nodeId) {
      //             console.log("Clicked member ID:", nodeId);

      //             // Construct the new URL and navigate
      //             const newUrl = `/add-mamber/${nodeId}`;
      //             if (location.pathname + location.search !== newUrl) {
      //                 navigate(newUrl);
      //             }
      //         }
      //     }

      //     // Prevent any other behaviors like details popups
      //     event.stopPropagation();
      //     event.preventDefault();
      // });
      //////////////////////////////  //////////////////  //////////////////

      // Ensure the click event navigates to the add member page
      //    family.on('click', function(sender, args) {
      //     const clickedId = args.node.id;
      //     const newUrl = `/add-mamber/${clickedId}`;
      //     if (location.pathname + location.search !== newUrl) {
      //         navigate(newUrl);
      //     }
      //     return false; // Prevent any default action or propagation
      // });

      family.on("click", function (sender, args) {
        args.cancel = true; // Prevent default behavior
        const clickedId = args.node.id;
        console.log("id of clicked member", clickedId);

        const newUrl = `/add-mamber/${clickedId}`;
        if (location.pathname + location.search !== newUrl) {
          navigate(newUrl);
        }
        return false; // Stop further event propagation
      });

      family.load(familyData);

      // console.log("FamilyTree initialized successfully.");
    } catch (error) {
      console.error("Error initializing FamilyTree:", error);
    }
  };

  return (
    <div>
      <svg
        className="tommy bft-dark"
        style={{
          position: "fixed",
          top: "-10000px",
          left: "-10000px",
          display: "block",
        }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <text
          id="test_field"
          style={{ fontSize: "18px", fontWeight: "bold" }}
          fill="#ffffff"
          x="10"
          y="90"
          textAnchor="start"
        ></text>
      </svg>
      <div id="tree" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default Family;
