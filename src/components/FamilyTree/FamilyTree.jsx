import "./FamilyTree.scss";
import { FamilyTree, common } from "./FamilyTreeModule";
import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const MyFamilyTree = ({
  nodes,
  openInfo,
  onAdd,
  highlighted,
  onHighlighted,
  prePartner,
  nextPartner,
  setPartner,
  prevChildren,
  nextChildren,
  paginateChildren,
  prevIdx,
  nextIdx,
  childrenLen,
  setClickedAddMember
}) => {

  const navigate = useNavigate();  
  const user = JSON.parse(localStorage.getItem("user"));

  const filterNodes = (nodes) => {
    const allIds = nodes.map(item => item.id);
    nodes.forEach(item => {
      item.pids = [...new Set(item.pids.filter(pid => allIds.includes(pid)))];
    });

    return nodes
  };

  MyFamilyTree.propTypes = {
    nodes: PropTypes.array.isRequired,
    openInfo: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    highlighted: PropTypes.string.isRequired,
    onHighlighted: PropTypes.func.isRequired,
    prePartner: PropTypes.string,
    nextPartner: PropTypes.string,
    setPartner: PropTypes.func,
    prevChildren: PropTypes.string,
    nextChildren: PropTypes.string,
    paginateChildren: PropTypes.func,
    prevIdx: PropTypes.number,
    nextIdx: PropTypes.number,
    childrenLen: PropTypes.number,
    setClickedAddMember: PropTypes.func,
  };

  const divRef = useRef(null);

  useEffect(() => {
    const family = new FamilyTree(divRef.current, {
      template: "myTemplate",
      nodes: filterNodes(nodes),
      collapse: {
        level: 6,
      },
      nodeBinding: {
        html: "html",
      },
      connectors: {
        color: "#00aaff",
        lineType: "solid",
      },
      mixedHierarchyNodesSeparation: 100,
      nodeMenu: {},
      roots: [nodes[0].id],
      zoom: false,
      scaleInitial: FamilyTree.match.boundary,
    });

    const highlightedNode = nodes.find((node) => node.id === highlighted);
    family.on("field", (sender, args) => {
      if (args.name == "html") {
        const isPartner = highlightedNode.pids.includes(args.data.id);
        args.value = common({
          ...args.data,
          isCurrent: args.data.id == user?._id,
          highlighted: args.data.id == highlighted,
          prevPartner: isPartner ? prePartner : undefined,
          nextPartner: isPartner ? nextPartner : undefined,
          prevChildren,
          nextChildren,
          paginateChildren,
          prevIdx,
          nextIdx,
          childrenLen,
        });
      }
    });


    family.onNodeClick((args) => {
      if (args.node.id == highlighted) {
        navigate(`/post/${args.node.id}`)
        return false;
      } else {
        console.log("no this is false");
      }
    
      console.log("click one");
    
      if (args.node.id.includes("default")) return false;
    
      onHighlighted(args.node.id);
      return false;
    });

    family.on("render-link", (sender, args) => {
      const node = nodes.find((n) => n.id === args.node.id);
      const partnerNode = nodes.find((n) => n.id === args.cnode.id);

      if (node && partnerNode) {
        const isPreviousPartner =
          node.pids.includes(partnerNode.id) &&
          node.current_pid !== partnerNode.id;
        if (isPreviousPartner) {
          args.html = args.html.replace("path", "path stroke-dasharray='3, 2'");
        }
      }
    });

    window.handleMenuClick = (nodeId) => {
      event.stopPropagation();
      openInfo(nodeId);
    };

    window.handleAdd = (id) => {
      event.stopPropagation();
      console.log(id);
      setClickedAddMember(id); // check what is this
      onAdd(true);
    };

    window.handlePrev = () => {
      event.stopPropagation();
      if (prePartner !== undefined) {
        setPartner(prePartner);
      }
    };

    window.handleNext = () => {
      event.stopPropagation();
      if (nextPartner !== undefined) {
        setPartner(nextPartner);
      }
    };

    window.handlePrevPage = () => {
      event.stopPropagation();
      paginateChildren("prev");
    };

    window.handleNextPage = () => {
      event.stopPropagation();
      paginateChildren("next");
    };

    return () => {
      delete window.handleMenuClick;
      delete window.handleAdd;
      delete window.handlePrev;
      delete window.handleNext;
      delete window.handlePrevPage;
      delete window.handleNextPage;
    };
  }, [nodes]);

  return (
    <div style={{ backgroundColor: "#F8F8F8" }}>
      <div id="tree" ref={divRef} style={{ backgroundColor: "#F8F8F8", height: "70vh" }}></div>
      
    </div>
  ); 
};

export default MyFamilyTree;