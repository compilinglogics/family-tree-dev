import React, { useEffect, useRef, useState } from 'react'
import "./CreatePost.scss"
import { Badge, Button, Form, Image } from 'react-bootstrap'
import PhotoVideo from '../../assets/icons/post/create/PhotoVideo.svg'
import Mic from '../../assets/icons/post/create/Mic.svg'
import TagPeople from '../../assets/icons/post/create/TagPeople.svg'
import Feelings from '../../assets/icons/post/create/Smile.svg'
import Restrict from '../../assets/icons/post/create/Restrict.svg'
import Map from '../../assets/icons/post/create/Map.svg'
import { updatePost, uploadPost } from '../../utils/postApi'
import { Modal } from 'react-bootstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom'
import { familyTree } from '../../utils/familytreeApi'



const postActions = [
    
    {
        id: 7,
        title: 'Check in',
        image: Map,
    },
   
]





import WaveSurfer from "wavesurfer.js";
import { getLocalStorageData } from '../../common/commonFunction/commonFunction'

const convertToMp3 = async (webmBlob) => {
    const arrayBuffer = await webmBlob.arrayBuffer();

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const mp3Blob = await encodeMp3(audioBuffer);
    setAudioBlob(mp3Blob); // Update state with MP3 Blob
    setAudioUrl(URL.createObjectURL(mp3Blob)); // Update URL
};

const encodeMp3 = (audioBuffer) => {
    return new Promise((resolve, reject) => {
        try {
            const mp3Encoder = new WaveSurfer.Encoder({
                format: "mp3",
                bitRate: 128,
            });

            mp3Encoder.encode(audioBuffer.getChannelData(0), audioBuffer.sampleRate).then((mp3Blob) => {
                resolve(mp3Blob);
            });
        } catch (error) {
            reject(error);
        }
    });
};





const UpdatePost = () => {
    const location = useLocation();
    const { date, mamberId, item } = location.state || {};
    const savedUserDetails = getLocalStorageData("user");
    const storedUser = JSON.parse(savedUserDetails)
    const navigate = useNavigate();

    const [users, setUser] = useState([]);
    const [btnDisable, setBtnDisable] = useState(false);


    const [formData, setFormData] = useState({
        text: item.text,
        images: [],
        video: null,
        audio: null,
        dob: '',
        gender: '',
        selectedRelation: '',
        realCheck: 'isRealOrEdited',
        classificationz: 'noNudity',
        restrictPost: '',
        feelingActivity: '',
        tagPeople: [],

    });



    const handleRadioChange = (category, value) => {
        setFormData((prev) => ({
            ...prev,
            [category]: value,
        }));
    };



    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);

    const handleChange = (event) => {
        const { name, type, files, value } = event.target;

        if (type === "file") {
            if (name === "images") {
                // Handle multiple image uploads
                const fileArray = Array.from(files);
                const previewArray = fileArray.map((file) => URL.createObjectURL(file));

                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...fileArray], // Store image files
                }));

                setImagePreviews((prev) => [...prev, ...previewArray]); // Store image previews
            } else if (name === "video") {
                // Handle single video upload
                const file = files[0];

                setFormData((prev) => ({
                    ...prev,
                    video: file, // Store video file
                }));

                setVideoPreview(URL.createObjectURL(file)); // Store video preview
            } else {
                // Handle other file uploads (if needed)
                setFormData((prev) => ({
                    ...prev,
                    [name]: files[0], // Store single file (e.g., audio)
                }));
            }
        } else {
            // Handle text input, select fields, etc.
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    
    // Remove selected image
    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setFormData((prev) => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
    };

    // Remove video
    const removeVideo = () => {
        setFormData((prev) => ({ ...prev, video: null }));
        setVideoPreview(null);
    };

    const handleSubmit = async () => {
        setBtnDisable(true)
        try {
            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append("text", formData.text);
            formDataToSend.append("restrictPost", formData.restrictPost);
            formDataToSend.append("feelingActivity", formData.feelingActivity);
            // formDataToSend.append("eventDate", date);
            formDataToSend.append("audio", formData.audio);
            formDataToSend.append("mainUser", item.mainUser?._id );

            console.log(item, "item");
            

             // Append multiple images
             formData.images.forEach((image) => {
                formDataToSend.append("images", image);
            });


            // Append video
            if (formData.video) {
                formDataToSend.append("video", formData.video);
            }

            // Append nested objects as JSON strings
            formDataToSend.append(
                "realCheck",
                JSON.stringify({
                    editedMedia: formData.realCheck === "editedMedia",
                    isRealOrEdited: formData.realCheck === "isRealOrEdited",
                    computerGenerated: formData.realCheck === "computerGenerated",
                })
            );

            formDataToSend.append(
                "classificationz",
                JSON.stringify({
                    isNudity: formData.classificationz === "isNudity",
                    noNudity: formData.classificationz === "noNudity",
                })
            );

            // Append tagPeople array
            formDataToSend.append("tagPeople", JSON.stringify(formData.tagPeople));

            // Debug FormData content
            // for (let pair of formDataToSend.entries()) {
            //     console.log(pair[0], pair[1]);
            // }


            

            const response = await updatePost(formDataToSend, item._id);

            if (response.success) {
                console.log("Response:", response);
                toast.success("Post submitted successfully!");
            } else {
                console.error("Error in response:", response);
            }
            setBtnDisable(false)
            navigate(-1)
        } catch (error) {
            setBtnDisable(false)
            navigate(-1)
            console.error("Error during submission:", error);
        }
    };


    const [showTagPeopleModal, setShowTagPeopleModal] = useState(false);

    const handleOpenTagModal = () => setShowTagPeopleModal(true);
    const handleCloseTagModal = () => setShowTagPeopleModal(false);

    const handleSaveTags = () => {
        console.log('Tagged People:', formData.tagPeople); // For debugging
        handleCloseTagModal();
    };

    const handleTagToggle = (userId) => {
        setFormData((prev) => ({
            ...prev,
            tagPeople: prev.tagPeople.includes(userId)
                ? prev.tagPeople.filter((id) => id !== userId) // Remove if already selected
                : [...prev.tagPeople, userId], // Add if not selected
        }));
    };

    const [searchQuery, setSearchQuery] = useState("");

    const handleRemoveTag = (id) => {
        console.log(id);
        
        setFormData((prev) => ({
            ...prev,
            tagPeople: prev.tagPeople.filter((tagId) => tagId !== id),
        }));
    };

    // Filter users based on the search query
    const filteredUsers = users.filter((user) =>
        user.fullName?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
    

    const [familyData, setFamilyData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const fetchFamilyData = async () => {
        // console.log("useruseruser", user);

        try {
            const data = await familyTree(user._id);
            console.log("data.relatives" , data.relatives);
            console.log("users" , users);
            console.log("filteredUsers" , filteredUsers);
            
            setUser(data.relatives);

        } catch (error) {
            console.error("Failed to fetch family data:", error);
        }
    };
    useEffect(() => {
        fetchFamilyData();
    }, []);


    // for record audio

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            const audioChunks = [];
    
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
    
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                setAudioBlob(audioBlob);
    
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
    
                handleAudioUpload(audioBlob);
            };
    
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
        

    const clearRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
    };

    const handleAudioUpload = (audioBlob) => {
        setFormData((prev) => ({
            ...prev,
            audio: audioBlob,
        }));
    };


    return (
        <>
            <div className='post-first-line same_shadow_border p-3 bg_secondary mb-3'>
                <div className='mb-2'>
                    <Image className='avatar me-2' src={storedUser?.profileImageUrl} />
                    <span className='title fw-500'>{storedUser.fullName}</span>
                    <Button className="post-btn rounded-pill  py-1 float-end fw-400 " variant='dark'
                        onClick={handleSubmit}
                        disabled={btnDisable}
                    >Post</Button>
                </div>
                <textarea
                    className="w-100 p-1 border-0 rounded border border-light"
                    name="text"
                    id=""
                    rows="8"
                    value={formData.text}
                    onChange={handleChange}
                />
            </div>

            {/* <div className='same_shadow_border p-3 pb-0 bg_secondary mb-3 post-action'>
                <Form>
                    <span className="d-block same_poppins_3 fw-500 mb-3">RealCheck*</span>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="edited-media"
                            label="Edited media"
                            className="grey-medium mb-2"
                            name="realCheck" // Group name for mutual exclusivity
                            checked={formData.realCheck === 'editedMedia'}
                            onChange={() => handleRadioChange('realCheck', 'editedMedia')}
                        />
                        <Form.Check
                            type="radio"
                            id="real-unedited-media"
                            label="Real and un-edited media"
                            className="grey-medium mb-2"
                            name="realCheck"
                            checked={formData.realCheck === 'isRealOrEdited'}
                            onChange={() => handleRadioChange('realCheck', 'isRealOrEdited')}
                        />
                        <Form.Check
                            type="radio"
                            id="computer-generated"
                            label="Wholly or partially computer-generated media"
                            className="grey-medium mb-2"
                            name="realCheck"
                            checked={formData.realCheck === 'computerGenerated'}
                            onChange={() => handleRadioChange('realCheck', 'computerGenerated')}
                        />
                    </div>

                    <span className="d-block same_poppins_3 fw-500 mb-3">Classification*</span>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="no-nudity"
                            label="No nudity, sex, violence or weapons"
                            className="grey-medium mb-2"
                            name="classificationz"
                            checked={formData.classificationz === 'noNudity'}
                            onChange={() => handleRadioChange('classificationz', 'noNudity')}
                        />
                        <Form.Check
                            type="radio"
                            id="contains-nudity"
                            label="Contains nudity, sex, violence or weapons"
                            className="grey-medium mb-2"
                            name="classificationz"
                            checked={formData.classificationz === 'isNudity'}
                            onChange={() => handleRadioChange('classificationz', 'isNudity')}
                        />
                    </div>
                </Form>


            </div> */}

<div className='same_shadow_border p-3 pb-0 bg_secondary mb-3 post-action'>
                {/* Image Previews with Delete Option */}
                <div className="image-preview-container">
                    {/* Media Previews (Images & Video) */}
                    <div className="media-preview-container">
                        {/* Image Previews */}
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="preview-item">
                                <img src={src} alt={`Preview ${index}`} className="preview-image" />
                                <button type="button" className="remove-btn" onClick={() => removeImage(index)}>
                                    ❌
                                </button>
                            </div>
                        ))}

                        {/* Video Preview */}
                        {videoPreview && (
                            <div className="preview-item">
                                <video className="preview-video" controls>
                                    <source src={videoPreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <button type="button" className="remove-btn" onClick={removeVideo}>
                                    ❌
                                </button>
                            </div>
                        )}
                    </div>

                </div>


            </div>



            <div className='same_shadow_border p-3 bg_secondary post-action'>
                <span className='action-top-line'></span>


                <div className={`border-bottom image-actions`}>
                    <label htmlFor="image-upload">
                        <div className="d-flex align-items-center grey-medium gap-3 py-3">
                            <div className="action-image ps-3">
                                <img className="img-fluid" src={PhotoVideo} alt="Upload Video" />
                                <Form.Control
                                    id="image-upload"
                                    type="file"
                                    name="images"
                                    multiple
                                    className="d-none"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="action-text">Photo</div>
                        </div>
                    </label>
                </div>

                <div className={`border-bottom image-actions`}>

                    <label htmlFor="video-upload">
                        <div className="d-flex align-items-center grey-medium gap-3 py-3">
                            <div className="action-image ps-3">
                                <img className="img-fluid" src={PhotoVideo} alt="Upload Video" />
                                <Form.Control
                                    id="video-upload"
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    className="d-none"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="action-text">Video</div>
                        </div>
                    </label>
                </div>

                {/* <div className={`border-bottom image-actions`}>

                    <div className="d-flex align-items-center grey-medium gap-3 py-3">
                        <div className="action-image ps-3">
                            <img className="img-fluid" src={Restrict} alt="Upload Video" />
                        </div>
                        <div className="action-text">Restrict Post</div>
                    </div>
                    <div className="radios d-flex ps-3 gap-3 mb-3 ">
                        {['Me Only', 'Tagged only', 'Family only', 'Seal'].map((item) => (
                            <Form.Check
                                type="radio"
                                id="contains-nudity"
                                label={item}
                                className="grey-medium mb-2"
                                name="restrictPost"
                                checked={formData.restrictPost === item}
                                onChange={() => handleRadioChange('restrictPost', item)}
                            />

                        ))}
                    </div>
                </div> */}

                {/* <div className={`border-bottom image-actions`}>

                    <div className="d-flex align-items-center grey-medium gap-3 py-3">
                        <div className="action-image ps-3">
                            <img className="img-fluid" src={Feelings} alt="Upload Video" />
                        </div>
                        <div className="action-text">Feeling/ Activity</div>
                    </div>
                    <div className="radios d-flex ps-3 gap-3 mb-3 ">
                        {['Happy', 'Sad', 'Cry', 'Funny', 'Normal'].map((item) => (
                            <Form.Check
                                type="radio"
                                id="contains-nudity"
                                label={item}
                                className="grey-medium mb-2"
                                name="feelingActivity"
                                checked={formData.feelingActivity === item}
                                onChange={() => handleRadioChange('feelingActivity', item)}
                            />

                        ))}
                    </div>
                </div> */}

                <div className="border-bottom image-actions">
                    <div
                        className="d-flex align-items-center grey-medium gap-3 py-3"
                        onClick={handleOpenTagModal}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="action-image ps-3">
                            <img className="img-fluid" src={TagPeople} alt="Tag People" />
                        </div>
                        <div className="action-text">Tag People</div>
                    </div>
                </div>

                {/* <div className={`border-bottom image-actions`}>
                    <label htmlFor="audio-upload">
                        <div className="d-flex align-items-center grey-medium gap-3 py-3">
                            <div className="action-image ps-3">
                                <img className="img-fluid" src={Mic} alt="Upload Video" />
                                <Form.Control
                                    id="audio-upload" 
                                    type="file"
                                    name="audio"
                                    className="d-none"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="action-text">Audio</div>
                        </div>
                    </label>
                </div> */}

               {/* This is for audio record */}
                <div className={`border-bottom image-actions`}>
                    <div className="d-flex align-items-center gap-3 py-2">
                        {/* Microphone Icon */}
                        <div className="action-image ps-3">
                            <img className="img-fluid" src={Mic} alt="Record Audio" style={{ width: "30px", height: "30px" }} />
                        </div>

                        {/* Buttons and Audio Player */}
                        <div className="d-flex align-items-center gap-2">
                            <Button
                            className="post-btn rounded-pill  py-1 float-end fw-400 "
                                variant={isRecording ? "danger" : "dark"}
                                size="sm" // Makes the button smaller
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? "Stop" : "Start"}
                            </Button>

                            {audioUrl && (
                                <>
                                    <audio controls src={audioUrl} className="audio-player" style={{ height: "30px" }}></audio>
                                    <Button
                                    className="post-btn rounded-pill  py-1 float-end fw-400 "
                                        variant="secondary"
                                        size="sm" // Makes the button smaller
                                        onClick={clearRecording}
                                    >
                                        Clear
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>



                {/* {postActions.length > 0 && postActions.map((obj, index) =>
                    <div key={index} className={(postActions.length - 1) !== index && `border-bottom image-actions`}>
                        <div class="d-flex align-items-center grey-medium gap-3 py-3">
                            <div class="action-image ps-3">
                                <img className='img-fluid' src={obj.image} alt="" />
                            </div>
                            <div class="action-text">{obj.title}</div>
                        </div>
                        {obj.radios &&
                            <div className="radios d-flex ps-3 gap-3 mb-3 ">
                                {obj.radios.map((name, index) => (
                                    <Form.Check
                                        type='radio'
                                        name={obj.title}
                                        label={name}
                                        id={`disabled-default-${name}`}
                                    />
                                ))}
                            </div>
                        }
                    </div>
                )} */}
            </div>


            {/* popups */}
            <Modal show={showTagPeopleModal} onHide={handleCloseTagModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Tag People</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {users.length > 0 ? (

                        <div>
                            {/* Selected Tags */}
                            <div className="mb-3">
                                <Form.Label>Selected People:</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {formData.tagPeople.map((tagUserId) => {
                                        const user = users.find((u) => u._id === tagUserId);
                                        return (
                                            <Badge
                                                key={user?._id}
                                                bg="primary"
                                                className="d-flex align-items-center"
                                                style={{ padding: "0.5rem" }}
                                            >
                                                {user?.fullName}
                                                <span
                                                    style={{ marginLeft: "8px", cursor: "pointer" }}
                                                    onClick={() => handleRemoveTag(tagUserId)}
                                                >
                                                    &times;
                                                </span>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Search Input */}
                            <Form.Control
                                type="text"
                                placeholder="Search for people..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mb-3"
                            />

                            {/* User List (Scrollable, Max 5 Items) */}
                            <div
                                className="user-list"
                                style={{
                                    maxHeight: "150px", // Limit visible items to 5 (approximately)
                                    overflowY: "auto",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    padding: "10px",
                                }}
                            >
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user._id}
                                            className="d-flex align-items-center gap-2 mb-2"
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                id={`user-${user._id}`}
                                                label={user.fullName}
                                                checked={formData.tagPeople.includes(user._id)}
                                                onChange={() => handleTagToggle(user._id)}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p>No users found.</p>
                                )}
                            </div>
                        </div>

                    ) : (
                        <p>No users available for tagging.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTagModal}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveTags}
                        disabled={formData.tagPeople.length === 0} // Disable if no users are selected
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdatePost
