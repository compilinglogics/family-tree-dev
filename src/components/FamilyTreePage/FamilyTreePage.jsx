import "./FamilyTreePage.scss";
import { useContext, useEffect, useState } from "react";
import MemberModal from "../MemberModal/MemberModal";
// import CommonModal from "../CommonModal/CommonModal";
// import { fileUploadApi } from "../../utils/fileUpload";
import { END_POINTS } from "../../common/endPoints";
import { getApiRequest } from "../../utils/getApiRequest";
import MyFamilyTree from "../FamilyTree/FamilyTree";
import AddMember from "./AddMember";
import EditMember from "./EditMember";
import { postApiRequest } from "../../utils/postRequest";
import { toast } from "react-toastify";
import { getUser } from "../../utils/getUser";
import { fileUploadApi } from "../../utils/fileUpload";
import { Button, Modal } from "react-bootstrap";
import DeleteMemberModal from "./DeleteMemberModal";
import { deleteUser } from "../../utils/familytreeApi";
// import { putUpdateUser } from "../../utils/putUpdateUser";
// import DeleteMemberModal from "../DeleteMemberModal/DeleteMemberModal";
// import { deleteUser } from "../../utils/deleteUser";
// import { addUser } from "../../utils/addUser";

const FamilyTreePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
  const [members, setMembers] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addMember, setAddMember] = useState(false);
    // const { user } = useContext(AuthContext);
    const [highlighted, setHighlighted] = useState(user?._id);
  const [prePartner, setPrePartner] = useState(undefined);
  const [nextPartner, setNextPartner] = useState(undefined);
  const [prevChildren, setPrevChildren] = useState(undefined);
  const [nextChildren, setNextChildren] = useState(undefined);
  const itemsPerPage = 6;
  const [allChildren, setAllChildren] = useState([]);
  const [prevIdx, setPrevIdx] = useState(-1);
  const [nextIdx, setNextIdx] = useState(6);
  const [childrenLen, setChildrenLen] = useState(0);
  const [clickedAddMember, setClickedAddMember] = useState(user._id);
  const [tempCurrentUser, setTempCurrentUser] = useState(user._id);

  const handleOpenInfo = (userId) => {
    const _selectedUser = members.find((member) => member.id == userId);
    setSelectedUser(_selectedUser);
    setModalShow(true);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true); // start loader
  
    const form = new FormData();
    form.append("email", formData.email);
    form.append("relationship_type", formData.relationship_type);
    form.append("additional_data", formData.additional_data);
  
    try {
      if (formData.is_linked == false) {
        const response = await postApiRequest(END_POINTS.NEW_ADD_MEMBER, form);
        if (!response.error) {
          setAddMember(false);
          toast.success(
            `Invite success ${formData.email} as ${formData.relationship_type}`
          );
        } else {
          toast.error(`Invitation Error`);
        }
      } else {
        form.append("fullName", formData.fullName);
        form.append("linkedAccount", formData.linkedAccounts);
        form.append("relation", formData.relationship_type[0]);
        form.append("phone", formData.mobileNumber);
        form.append("countryCode", formData.countryCode);
        form.append("country", formData.country);
        form.append("city", formData.city);
        form.append("dob", formData.dob);
        form.append("gender", formData.gender);
        form.append("isLinked", formData.is_linked);
        form.append("password", formData.password);
        form.append("requesting_user", clickedAddMember);
        if (formData.image) {
          form.append("image", formData.image);
        }
  
        const response = await fileUploadApi(END_POINTS.NEW_ADD_MEMBER, form);
        if (response.data.success) {
          toast.success(response.data.message);
          setAddMember(false);
          setShowModal(true);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // stop loader in both success and error
    }
  };
  

  const handleDeleteUser = async (userId) => {
    try {
      console.log("userId" , userId);
      
      const response = await deleteUser(userId);
      console.log("response" , response);
      if (response.success) {
        setShowDelete(false);
        toast.success(response.message);
        // Optionally, refresh members or perform other actions
      } else {
        toast.error(response.message);
       
      }
    } catch (err) {
      if (
        err.response &&
        err.response.data.error === "Please delete the children first"
      ) {
        toast.error("Please delete the children first");
        setShowDelete(false);
      } else {
        toast.error(`Delete Error`);
      }
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);

  const handleEditSubmit = async (formData) => {
    // Add this method
    const form = new FormData();
    form.append("email", formData.email);
    form.append("relationship_type", formData.relationship_type);
    form.append("additional_data", formData.additional_data);
    form.append("fullname", formData.fullName);
    form.append("linkedAccount", formData.linkedAccounts);
    form.append("mobileNumber", formData.mobileNumber);
    form.append("country", formData.country);
    form.append("city", formData.city);
    form.append("dob", formData.dob);
    form.append("gender", formData.gender);
    formData.is_linked && form.append("is_linked", formData.is_linked);
    formData.is_linked && form.append("requesting_user", clickedAddMember);
    if (formData.image) {
      form.append("image", formData.image);
    }
    // form.append("image", selectedImage)
    try {
      const response = await putUpdateUser(
        `${END_POINTS.UPDATE_USER}/${formData.id}`,
        form
      );
      if (!response.error) {
        setShowEdit(false);
        toast.success(`User ${formData.fullname} updated successfully`);
        // Optionally, refresh members or perform other actions
      } else {
        // Handle error
        toast.error(`Update Error`);
      }
    } catch (err) {
      toast.error(`Update Error`);
    }
  };

  useEffect(() => {
    (async () => {
      // setHighlighted(user._id);
      const data = await getApiRequest(
        END_POINTS.GET_RELATIVES + "/" + user._id
      );
      setNodes(data);

      if (data.relatives?.length === 1) {
        setShowPopup(true);
      }
      
    })();
  }, []);

  useEffect(() => {
    filterMembersByPagination(members);
  }, [prevIdx, nextIdx, prevChildren, nextChildren, allChildren]);

  const filterMembersByPagination = (members) => {
    const childrenToExclude = allChildren
      .filter((child, index) => {
        return index <= prevIdx || index >= nextIdx;
      })
      .map((child) => child.id);

    const filteredMembers = members.filter((member) => {
      return !childrenToExclude.includes(member.id);
    });

    return filteredMembers;
  };

  const setNodes = (data, highlighted = user._id) => {
    setPrePartner(data.prevPartnerId);
    setNextPartner(data.nextPartnerId);

    const _members = data.relatives.map((member) => ({
      ...member,
      id: member._id,
    }));
    console.log("_members", _members);
    const highlightedUser = _members.find((member) => member.id == highlighted);
    // console.log("data", data);

    if (data.partnerId === null) {
      const nullIndex = highlightedUser.pids.indexOf(null);
      const defaultPartnerId = `defaultpartner_${highlightedUser.id}_${nullIndex}`;
      const defaultPartner = {
        id: defaultPartnerId,
        fid: null,
        mid: null,
        fullname: "Unknown",
        city: "unknown",
        country: "unknown",
        gender:
          highlightedUser.gender == "male"
            ? "female"
            : highlightedUser.gender === "female"
            ? "male"
            : "non-binary",
        pids: [highlightedUser.id],
        isDefault: true, // To differentiate default partners
      };
      _members.push(defaultPartner);
      highlightedUser.pids[nullIndex] = defaultPartnerId;
      if (highlightedUser.gender == "male") {
        _members.map((member) => {
          if (member.fid == highlighted) {
            member.mid = defaultPartnerId;
          }
        });
      } else {
        _members.map((member) => {
          if (member.mid == highlighted) {
            member.fid = defaultPartnerId;
          }
        });
      }
    }

    if (
      (highlightedUser?.fid !== null && highlightedUser?.mid === null) ||
      (highlightedUser?.fid === null && highlightedUser?.mid !== null)
    ) {
      const parentId = highlightedUser?.fid || highlightedUser?.mid;
      const defaultParentId = `defaultparent_${highlightedUser.id}`;
      const defaultParent = {
        id: defaultParentId,
        fid: null,
        mid: null,
        pids: [parentId],
        gender: highlightedUser.fid ? "female" : "male",
        isDefault: true, // To differentiate default parents
      };

      // Add default parent to members
      _members.push(defaultParent);

      // Update highlightedUser's fid or mid
      if (!highlightedUser.fid) {
        highlightedUser.fid = defaultParentId;
        _members.find((member) => member.id == parentId).pids = [
          defaultParentId,
        ];
      } else if (!highlightedUser.mid) {
        highlightedUser.mid = defaultParentId;
        _members.find((member) => member.id == parentId).pids = [
          defaultParentId,
        ];
      }

      // Update siblings' null parent with default parent
      _members.forEach((member) => {
        if (member.fid === parentId && member.mid === null) {
          member.mid = defaultParentId;
        } else if (member.mid === parentId && member.fid === null) {
          member.fid = defaultParentId;
        }
      });
    }

    // Filter children of the highlighted user
    const children = _members.filter(
      (member) =>
        member.fid === highlightedUser.id || member.mid === highlightedUser.id
    );

    setAllChildren(children);
    setChildrenLen(children.length);

    // Set initial pagination state for children
    if (children.length > itemsPerPage) {
      setPrevChildren(children[0]?.id || null);
      setNextChildren(children[5]?.id || null);
    } else {
      setPrevChildren(null);
      setNextChildren(null);
    }

    setMembers(_members);
  };

  const paginateChildren = (direction) => {
    if (direction === "next") {
      const fIdx = prevIdx + itemsPerPage;
      const eIdx = nextIdx + itemsPerPage;
      setPrevIdx(fIdx);
      setNextIdx(eIdx);
      setPrevChildren(allChildren[fIdx + 1]?.id || null);
      setNextChildren(allChildren[eIdx - 1]?.id || null);
    } else {
      const fIdx = prevIdx - itemsPerPage;
      const eIdx = nextIdx - itemsPerPage;

      setPrevIdx(fIdx);
      setNextIdx(eIdx);
      setPrevChildren(allChildren[fIdx + 1]?.id || null);
      setNextChildren(allChildren[eIdx - 1]?.id || null);
    }
  };

  const onHighlighted = async (id) => {
    setHighlighted(id);
    const data = await getApiRequest(END_POINTS.GET_RELATIVES + "/" + id);
    setTempCurrentUser(id);  
    setNodes(data, id);
  };

  const setPartner = async (id) => {
    const data = await getApiRequest(
      END_POINTS.GET_RELATIVES +
        "/" +
        highlighted +
        "?partner=" +
        (id ? id : "")
    );
    setNodes(data,tempCurrentUser);
  };


  const [showPopup, setShowPopup] = useState(false);

  

  return (

    <>
    {loading ? (
      // Show loader when loading is true
      <div className="flex items-center justify-center h-[65vh]">
        <p>Loading...</p> {/* Replace with spinner if needed */}
      </div>
    ) : (

    <>
      {!addMember && !showEdit ? ( // Update this line
        <>
          <div style={{ height: "65vh" }}>
            {members?.length > 0 && (
              <MyFamilyTree
                nodes={filterMembersByPagination(members)}
                openInfo={handleOpenInfo}
                onAdd={setAddMember}
                highlighted={highlighted}
                onHighlighted={onHighlighted}
                prePartner={prePartner}
                nextPartner={nextPartner}
                setPartner={setPartner}
                prevChildren={prevChildren}
                nextChildren={nextChildren}
                paginateChildren={paginateChildren}
                prevIdx={prevIdx}
                nextIdx={nextIdx}
                childrenLen={childrenLen}
                setClickedAddMember={setClickedAddMember}
              />
            )}
          </div>
        </>
      ) : addMember ? ( // Update this line
        <>
          <AddMember
            handleSubmit={handleSubmit}
            handleClose={() => {
              setAddMember(false);
              setModalShow(false);
            }}
            handleEditSubmit={handleEditSubmit}
          />
        </>
      ) : (
        // Add this block
        <>
          <EditMember
            userId={selectedUser?.id} // Pass the userId to EditMember
            handleSubmit={handleEditSubmit}
            handleClose={() => {
              setShowEdit(false);
              setModalShow(false);
            }}
          />
        </>
      )}

      <MemberModal
        selectedUser={selectedUser}
        handleDelete={() => {
          setModalShow(false);
          setShowDelete(true);
        }}
        handleEdit={() => {
          setShowEdit(true), setModalShow(false);
        }}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

<Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to Your Family Tree</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Click (+) to add and invite family members to grow your family tree.</p>
          <p>Click 🀛 to edit/delete your account.</p>
          <p>Click your image to go to My Story.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowPopup(false)}>
            Got It
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Linked Account Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Linked account created. Go to <br />
          Profile (click your image in menu) <br />
          Linked account menu <br />
          Select linked account <br />
          You can add unlimited linked accounts
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalClose}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>

      <DeleteMemberModal // Add this block
        userId={selectedUser?.id}
        show={showDelete}
        onHide={() => setShowDelete(false)}
        handleDelete={handleDeleteUser}
      />
    </>
    )}
  </>
  );
};

export default FamilyTreePage;
