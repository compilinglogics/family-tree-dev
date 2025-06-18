import { useEffect, useRef, useState } from "react"
import "./CreatePost.scss"
import { Badge, Button, Form, Image } from "react-bootstrap"
import PhotoVideo from "../../assets/icons/post/create/PhotoVideo.svg"
import Mic from "../../assets/icons/post/create/Mic.svg"
import TagPeople from "../../assets/icons/post/create/TagPeople.svg"
import { uploadPost } from "../../utils/postApi"
import { Modal } from "react-bootstrap"

import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useLocation, useNavigate } from "react-router-dom"
import { familyTree } from "../../utils/familytreeApi"
import WaveSurfer from "wavesurfer.js"
import { getLocalStorageData } from "../../common/commonFunction/commonFunction"
import { getSearchedUser } from "../../utils/getUser"
import { uploadImage } from "../../utils/cloudImageUpload"
import { uploadVideo } from "../../utils/cloudVideoUpload"
import { uploadAudio } from "../../utils/cloudAudioUpload" // Import the new audio upload function

const convertToMp3 = async (webmBlob, setAudioBlob, setAudioUrl) => {
  const arrayBuffer = await webmBlob.arrayBuffer()

  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  const mp3Blob = await encodeMp3(audioBuffer)
  setAudioBlob(mp3Blob) // Update state with MP3 Blob
  setAudioUrl(URL.createObjectURL(mp3Blob)) // Update URL
}

const encodeMp3 = (audioBuffer) => {
  return new Promise((resolve, reject) => {
    try {
      const mp3Encoder = new WaveSurfer.Encoder({
        format: "mp3",
        bitRate: 128,
      })

      mp3Encoder.encode(audioBuffer.getChannelData(0), audioBuffer.sampleRate).then((mp3Blob) => {
        resolve(mp3Blob)
      })
    } catch (error) {
      reject(error)
    }
  })
}

const CreatePost = () => {
  const location = useLocation()
  const { date, mamberId } = location.state || {}
  const savedUserDetails = getLocalStorageData("user")
  const storedUser = JSON.parse(savedUserDetails)
  const navigate = useNavigate()

  const [users, setUser] = useState([])
  const [btnDisable, setBtnDisable] = useState(false)

  const [formData, setFormData] = useState({
    text: "",
    images: [],
    video: null,
    audio: null,
    dob: "",
    gender: "",
    selectedRelation: "",
    realCheck: "isRealOrEdited",
    classificationz: "noNudity",
    restrictPost: "All",
    feelingActivity: "",
    tagPeople: [],
    tagPeopleIds: [],
  })

  const handleRadioChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const [imagePreviews, setImagePreviews] = useState([])
  const [videoPreview, setVideoPreview] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)

 

  const handleSubmit = async (text) => {
    setBtnDisable(true)
    console.log("handleSubmit")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("text", formData.text)
      formDataToSend.append("restrictPost", formData.restrictPost)
      formDataToSend.append("feelingActivity", formData.feelingActivity)
      formDataToSend.append("eventDate", date)
      formDataToSend.append("mainUser", mamberId || storedUser._id)
      formDataToSend.append("type", "post")

      // 🔄 Upload images to Cloudinary and append URLs
      const uploadedImageUrls = []
      for (const image of formData.images) {
        const imageUrl = await uploadImage(image) // Upload to Cloudinary
        if (imageUrl) uploadedImageUrls.push(imageUrl)
      }
      formDataToSend.append("imagesUrls", JSON.stringify(uploadedImageUrls))

      // 🔄 Upload video if available
      if (formData.video) {
        const videoUrl = await uploadVideo(formData.video)
        if (videoUrl) {
          formDataToSend.append("videoUrl", videoUrl)
        }
      }

      // 🔄 Upload audio to Cloudinary if available
      if (formData.audio) {
        console.log("Uploading audio to Cloudinary...")
        const audioUrl = await uploadAudio(formData.audio)
        if (audioUrl) {
          formDataToSend.append("audioUrl", audioUrl)
          console.log("Audio uploaded successfully:", audioUrl)
        } else {
          toast.error("Failed to upload audio. Please try again.")
          setBtnDisable(false)
          return
        }
      }

      // Append other fields
      formDataToSend.append(
        "realCheck",
        JSON.stringify({
          editedMedia: formData.realCheck === "editedMedia",
          isRealOrEdited: formData.realCheck === "isRealOrEdited",
          computerGenerated: formData.realCheck === "computerGenerated",
        }),
      )

      formDataToSend.append(
        "classificationz",
        JSON.stringify({
          isNudity: formData.classificationz === "isNudity",
          noNudity: formData.classificationz === "noNudity",
        }),
      )

      formDataToSend.append("tagPeople", JSON.stringify(formData.tagPeopleIds))

      // 🔄 Send formDataToSend to your backend
      const response = await uploadPost(formDataToSend)

      if (response.success) {
        toast.success("Post submitted successfully!")
      } else {
        console.error("Error in response:", response)
        toast.error("Failed to submit post. Please try again.")
      }

      setBtnDisable(false)
      navigate(-1)
    } catch (error) {
      console.error("Error during submission:", error)
      toast.error("An error occurred while submitting the post.")
      setBtnDisable(false)
    }
  }

  const [showTagPeopleModal, setShowTagPeopleModal] = useState(false)

  const handleOpenTagModal = () => setShowTagPeopleModal(true)
  const handleCloseTagModal = () => setShowTagPeopleModal(false)

  const handleSaveTags = () => {
    handleCloseTagModal()
  }

  const handleTagToggle = (user) => {
    setFormData((prev) => {
      const isAlreadyTagged = prev.tagPeople.some((taggedUser) => taggedUser._id === user._id)

      return {
        ...prev,
        tagPeople: isAlreadyTagged
          ? prev.tagPeople.filter((taggedUser) => taggedUser._id !== user._id)
          : [...prev.tagPeople, user],
        tagPeopleIds: isAlreadyTagged
          ? prev.tagPeopleIds.filter((id) => id !== user._id)
          : [...prev.tagPeopleIds, user._id],
      }
    })
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])

  const handleSearch = async (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredUsers([])
      return
    }

    try {
      const result = await getSearchedUser(term)
      setFilteredUsers(result)
    } catch (error) {
      console.error("Error fetching search results:", error)
      setFilteredUsers([])
    }
  }

  const handleRemoveTag = (id) => {
    setFormData((prev) => ({
      ...prev,
      tagPeople: prev.tagPeople.filter((tagId) => tagId !== id),
    }))
  }

  // Filter users based on the search query
  const filteredUsers1 = users.filter((user) => user.fullName?.toLowerCase().includes(searchQuery?.toLowerCase()))

  const [familyData, setFamilyData] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const fetchFamilyData = async () => {
    try {
      const data = await familyTree(user._id)
      setUser(data.relatives)
    } catch (error) {
      console.error("Failed to fetch family data:", error)
    }
  }

  useEffect(() => {
    fetchFamilyData()
  }, [])

  // for record audio
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      const audioChunks = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
        setAudioBlob(audioBlob)

        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioUrl(audioUrl)

        handleAudioUpload(audioBlob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast.error("Error accessing microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    setAudioUrl(null)
    setFormData((prev) => ({
      ...prev,
      audio: null,
    }))
  }

  const handleAudioUpload = (audioBlob) => {
    setFormData((prev) => ({
      ...prev,
      audio: audioBlob,
    }))
  }

  // record audio end
  const [showModal, setShowModal] = useState(false)

  const handleShow = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const handlePostSubmit = () => {
    handleSubmit("post")
    handleClose()
  }

  const handleStorySubmit = () => {
    handleSubmit("story")
    handleClose()
  }

  return (
    <>
      <div className="post-first-line same_shadow_border p-3 bg_secondary mb-3">
        <div className="mb-2">
          <Image className="avatar me-2" src={storedUser?.profileImageUrl || "/placeholder.svg"} />
          <span className="title fw-500">{storedUser.fullName}</span>

          <Button
            className="post-btn rounded-pill  py-1 float-end fw-400 "
            variant="dark"
            onClick={handleSubmit}
            disabled={btnDisable}
          >
            {btnDisable ? "Uploading..." : "Post"}
          </Button>
        </div>
        <textarea
          className="w-100 p-1 border-0 rounded border border-light"
          name="text"
          id=""
          rows="8"
          value={formData.text}
          onChange={handleChange}
          placeholder="Write about a life event"
        />
      </div>

      <div className="same_shadow_border p-3 pb-0 bg_secondary mb-3 post-action">
        {/* Image Previews with Delete Option */}
        <div className="image-preview-container">
          {/* Media Previews (Images & Video) */}
          <div className="media-preview-container w-100">
            {/* Image Previews */}
            {imagePreviews.map((src, index) => (
              <div key={index} className="preview-item">
                <img src={src || "/placeholder.svg"} alt={`Preview ${index}`} className="preview-image" />
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

      <div className="same_shadow_border p-3 bg_secondary post-action">
        <span className="action-top-line"></span>

        <div className="border-bottom image-actions">
          <label htmlFor="image-upload">
            <div className="d-flex align-items-center grey-medium gap-3 py-3">
              <div className="action-image ps-3">
                <img className="img-fluid" src={PhotoVideo || "/placeholder.svg"} alt="Upload" />
                <input
                  id="image-upload"
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
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
                <img className="img-fluid" src={PhotoVideo || "/placeholder.svg"} alt="Upload Video" />
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

        <div className="border-bottom image-actions">
          <div
            className="d-flex align-items-center grey-medium gap-3 py-3"
            onClick={handleOpenTagModal}
            style={{ cursor: "pointer" }}
          >
            <div className="action-image ps-3">
              <img className="img-fluid" src={TagPeople || "/placeholder.svg"} alt="Tag People" />
            </div>
            <div className="action-text">Tag People</div>
          </div>
        </div>

        {/* Audio Recording Section */}
        <div className={`border-bottom image-actions`}>
          <div className="d-flex align-items-center gap-3 py-2">
            {/* Microphone Icon */}
            <div className="action-image ps-3">
              <img
                className="img-fluid"
                src={Mic || "/placeholder.svg"}
                alt="Record Audio"
                style={{ width: "30px", height: "30px" }}
              />
            </div>

            {/* Buttons and Audio Player */}
            <div className="d-flex align-items-center gap-2">
              <Button
                className="post-btn rounded-pill py-1 fw-400"
                variant={isRecording ? "danger" : "dark"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? "Stop" : "Start"}
              </Button>

              {audioUrl && (
                <>
                  <audio controls src={audioUrl} className="audio-player" style={{ height: "30px" }}></audio>
                  <Button
                    className="post-btn rounded-pill py-1 fw-400"
                    variant="secondary"
                    size="sm"
                    onClick={clearRecording}
                  >
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tag People Modal */}
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
                    const user = users.find((u) => u._id === tagUserId)
                    return (
                      <Badge
                        key={user?._id}
                        bg="primary"
                        className="d-flex align-items-center"
                        style={{ padding: "0.5rem" }}
                      >
                        {tagUserId?.fullName}
                        <span
                          style={{ marginLeft: "8px", cursor: "pointer" }}
                          onClick={() => handleRemoveTag(tagUserId)}
                        >
                          &times;
                        </span>
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Search Input */}
              <Form.Control
                type="text"
                placeholder="Search for people..."
                value={searchTerm}
                onChange={handleSearch}
                className="mb-3"
              />

              {/* User List (Scrollable, Max 5 Items) */}
              <div
                className="user-list"
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                }}
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user._id} className="d-flex align-items-center gap-2 mb-2">
                      <Form.Check
                        type="checkbox"
                        id={`user-${user._id}`}
                        label={user.fullName}
                        checked={formData.tagPeople.some((taggedUser) => taggedUser._id === user._id)}
                        onChange={() => handleTagToggle(user)}
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
          <Button variant="primary" onClick={handleSaveTags} disabled={formData.tagPeople.length === 0}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreatePost
