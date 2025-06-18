import "./Post.scss"
import { Button, Modal } from "react-bootstrap"
import PPCoin from "../../assets/images/PP-coin.svg"
import LinkIcon from "../../assets/icons/post/Link-icon.svg"
import Verified from "../../assets/icons/post/Verified.svg"
import like from "../../assets/images/like.svg"
import likeNot from "../../assets/images/likeNot.svg"
import message from "../../assets/images/message.svg"
import share from "../../assets/images/share.svg"
import { Link } from "react-router-dom"
import { getAllPost } from "../../utils/postApi"
import { useEffect, useState } from "react"
import { addComment, postLike } from "../../utils/familytreeApi"
import Comment from "./Comment"
import { toast } from "react-toastify"
import PostDropdown from "./PostDropdown"
import MediaViewer from "./MediaViewer"
import { AiFillPlayCircle } from "react-icons/ai"

const Post = () => {
  const [posts, setPosts] = useState([])
  const [stories, setStories] = useState([])
  const [activeTab, setActiveTab] = useState("posts")
  const [activeCommentBox, setActiveCommentBox] = useState(null)
  const [comments, setComments] = useState({})
  const user = JSON.parse(localStorage.getItem("user"))

  // Post functions
  const callPostApi = async () => {
    try {
      const response = await getAllPost(user._id, "post")
      if (response.success) setPosts(response.posts)
    } catch (error) {
      toast.error(error?.message)
    }
  }

  // Temporary story implementation
  const callStoryApi = async () => {
    try {
      const response = await getAllPost(user._id, "story")
      if (response.success) setStories(response.posts)
    } catch (error) {
      toast.error(error?.message)
    }
  }

  useEffect(() => {
    callPostApi()
    callStoryApi()
  }, [])

  // Comment functions
  const toggleCommentBox = (postId) => {
    setActiveCommentBox((prev) => (prev === postId ? null : postId))
  }

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({ ...prev, [postId]: value }))
  }

  const handleCommentSubmit = async (postId) => {
    try {
      if (comments[postId]?.trim()) {
        const response = await addComment({ id: postId, comment: comments[postId] })
        callPostApi()
        setComments((prev) => ({ ...prev, [postId]: "" }))
        toast.success(response?.message)
        setActiveCommentBox(null)
      }
    } catch (error) {
      toast.error(error?.message)
    }
  }

  // Like function
  const likePost = async (postId) => {
    try {
      const likeRes = await postLike(postId)
      toast.success(likeRes?.message)
      callPostApi()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  // Date formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Tab styling
  const tabStyle = (isActive) => ({
    color: isActive ? "#28a745" : "#6c757d",
    border: "none",
    borderBottom: `3px solid ${isActive ? "#28a745" : "transparent"}`,
    backgroundColor: "transparent",
    padding: "10px 20px",
    fontWeight: "500",
  })

  const [shareUrl, setShareUrl] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleShareClick = (postId) => {
    setShareUrl(`${window.location.origin}/seepost/${postId}`)
    setShowModal(true)
  }

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopySuccess(true)
          setTimeout(() => setCopySuccess(false), 2000)
        })
        .catch((err) => {
          console.error("Clipboard write failed:", err)
        })
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = shareUrl
      textArea.style.position = "fixed"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand("copy")
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err)
      }

      document.body.removeChild(textArea)
    }
  }

  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const [activeMedia, setActiveMedia] = useState(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [allCurrentMedia, setAllCurrentMedia] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openMediaModal = (mediaData) => {
    setActiveMedia(mediaData)
    setCurrentMediaIndex(mediaData.index)
    setAllCurrentMedia(mediaData.allMedia)
    setIsModalOpen(true)
  }

  const closeMediaModal = () => {
    setIsModalOpen(false)
    setActiveMedia(null)
    setAllCurrentMedia([])
    setCurrentMediaIndex(0)
  }

  const goToPrevious = () => {
    if (currentMediaIndex > 0) {
      const newIndex = currentMediaIndex - 1
      setCurrentMediaIndex(newIndex)
      setActiveMedia(allCurrentMedia[newIndex])
    }
  }

  const goToNext = () => {
    if (currentMediaIndex < allCurrentMedia.length - 1) {
      const newIndex = currentMediaIndex + 1
      setCurrentMediaIndex(newIndex)
      setActiveMedia(allCurrentMedia[newIndex])
    }
  }

  const [isAllMediaOpen, setIsAllMediaOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const openAllMediaModal = (item) => {
    setSelectedItem(item)
    setIsAllMediaOpen(true)
  }

  const closeAllMediaModal = () => {
    setSelectedItem(null)
    setIsAllMediaOpen(false)
  }

  const media = []

  if (selectedItem?.videoUrl) {
    media.push({ type: "video", url: selectedItem.videoUrl })
  }

  if (selectedItem?.imagesUrls?.length) {
    selectedItem.imagesUrls.forEach((imgUrl) => {
      media.push({ type: "image", url: imgUrl })
    })
  }

  const [expandedIndexes, setExpandedIndexes] = useState({})

  const toggleExpanded = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const getAllMediaForItem = (item) => {
    const allMedia = []
    if (item.videoUrl) {
      allMedia.push({ type: "video", src: item.videoUrl })
    }
    if (item.imagesUrls?.length) {
      item.imagesUrls.forEach((img) => {
        allMedia.push({ type: "image", src: img })
      })
    }
    return allMedia
  }

  return (
    <div className="pb-3">
      {posts.length === 0 ? (
        <div className="feed-container flex justify-center items-center h-screen border mt-5 p-5">
          <div className="bg-gray-100 p-6 rounded-2xl shadow-md text-center max-w-md">
            <p className="text-lg font-semibold">Your feed is empty.</p>
            <p className="text-gray-600 mt-2">Stories from your family and followers will appear here.</p>
            <p className="text-gray-600 mt-2">You can start writing your story in the text box above.</p>
            <p className="text-gray-600 mt-2">
              You will be prompted to enter the 'event date', the most approximate date of the event in the story.
            </p>
          </div>
        </div>
      ) : (
        posts
          .filter((item) => item.isApproved)
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).toISOString().split("T")[0]
            const dateB = new Date(b.createdAt).toISOString().split("T")[0]

            if (dateA !== dateB) {
              return new Date(dateB) - new Date(dateA)
            }

            return b.userId.ppScore - a.userId.ppScore
          })
          .map((item, index) => {
            const isExpanded = expandedIndexes[index]
            const lineCount = item.text.split("\n").length

            return (
              <div key={item._id} className="main-post-line same_shadow_border bg_secondary py-3 px-4 mt-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <Link to={`/post/${item?.mainUser?._id}`}>
                      <img
                        className="avatar me-2 rounded-pill"
                        src={item.userId?.profileImageUrl || "/placeholder.svg"}
                      />
                    </Link>
                    <div className="d-flex flex-column">
                      <span className="d-flex align-items-center mb-1">
                        <span className="name">{item.userId?.fullName}</span>
                        {item?.userId?.greenTick && (
                          <img className="verified-icon ms-1" src={Verified || "/placeholder.svg"} alt="" />
                        )}
                        {item?.userId?.isLinked && (
                          <img className="link-icon" src={LinkIcon || "/placeholder.svg"} alt="" />
                        )}
                      </span>
                      <div className="post-location">
                        {item.userId?.country} {new Date(item.userId?.dob).getFullYear()}{" "}
                        <span className="coins-counter">
                          <span className="number">{item.userId?.ppScore?.toFixed(2)}</span>
                          <img className="img-fluid" src={PPCoin || "/placeholder.svg"} />
                        </span>
                      </div>
                    </div>
                  </div>
                  {item.mainUser._id === user._id ? (
                    <PostDropdown item={item} page={"my-post"} getApi={callPostApi} />
                  ) : (
                    <PostDropdown item={item} page={"all-post"} getApi={callPostApi} />
                  )}
                </div>

                <div key={index} className="mb-3">
                  <div
                    className="image-post-content"
                    style={{
                      whiteSpace: "pre-line",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: isExpanded ? "unset" : 8,
                    }}
                  >
                    {item.text}
                  </div>

                  {lineCount > 8 && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="text-primary mt-1 p-0 border-0 bg-transparent"
                      style={{ cursor: "pointer" }}
                    >
                      {isExpanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>

                {item?.tagPeople?.map((tag) => (
                  <div key={tag.id}> @{tag.fullName}</div>
                ))}

                <div className="col-12">
                  <div className="media-grid">
                    {/* Video as first item if available */}
                    {item.videoUrl && (
                      <div
                        className="media-grid-item"
                        onClick={() =>
                          openMediaModal({
                            type: "video",
                            src: item.videoUrl,
                            index: 0,
                            allMedia: getAllMediaForItem(item),
                          })
                        }
                      >
                   <div className="video-thumbnail-wrapper" style={{ height: "200px" }}>
      <video className="img-fluid rounded media-video" muted loop>
        <source src={item.videoUrl} type="video/mp4" />
      </video>
      <div className="play-button-overlay">
        {/* Option 1: Use the React icon with transform fix */}
        <AiFillPlayCircle size={40} />

        {/* Option 2: Use a simple triangle (uncomment and add 'use-triangle' class) */}
        {/* <div className="play-button-overlay use-triangle"></div> */}

        {/* Option 3: Use Unicode play symbol */}
        {/* <span style={{ fontSize: '24px', fontWeight: 'bold' }}>▶</span> */}
      </div>
    </div>
                      </div>
                    )}

                    {/* Display first 3 images */}
                    {item.imagesUrls?.slice(0, item.videoUrl ? 2 : 3).map((img, index) => (
                      <div
                        key={index}
                        className="media-grid-item"
                        onClick={() =>
                          openMediaModal({
                            type: "image",
                            src: img,
                            index: item.videoUrl ? index + 1 : index,
                            allMedia: getAllMediaForItem(item),
                          })
                        }
                      >
                        <div className="video-thumbnail-wrapper">
                          <img
                            src={img || "/placeholder.svg"}
                            alt="post"
                            className="img-fluid rounded media-grid-img"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Show +X overlay for 4+ total media items */}
                    {(item.videoUrl ? 1 : 0) + (item.imagesUrls?.length || 0) >= 4 && (
                      <div className="media-grid-item media-overlay" onClick={() => openAllMediaModal(item)}>
                        +{(item.videoUrl ? 1 : 0) + (item.imagesUrls?.length || 0) - (item.videoUrl ? 3 : 3)}
                      </div>
                    )}
                  </div>
                </div>

                {item.audioUrl && (
                  <div className="audio-player-simple mb-3">
                    <div className="d-flex align-items-center gap-2 p-2 bg-light rounded" style={{ maxWidth: "300px" }}>
                      <button
                        className="btn btn-link p-0 text-dark"
                        onClick={(e) => {
                          const audio = e.target.closest(".audio-player-simple").querySelector("audio")
                          if (audio.paused) {
                            audio.play()
                            e.target.innerHTML = "⏸️"
                          } else {
                            audio.pause()
                            e.target.innerHTML = "▶️"
                          }
                        }}
                        style={{ fontSize: "14px", textDecoration: "none", minWidth: "20px" }}
                      >
                        ▶️
                      </button>

                      <span className="text-muted small" style={{ minWidth: "35px", fontSize: "12px" }}>
                        0:00
                      </span>

                      <div className="flex-grow-1 mx-2">
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="100"
                          defaultValue="0"
                          style={{
                            height: "4px",
                            background: "#e9ecef",
                            outline: "none",
                          }}
                        />
                      </div>

                      <button
                        className="btn btn-link p-0 text-muted"
                        style={{ fontSize: "14px", textDecoration: "none" }}
                      >
                        🔊
                      </button>

                      <audio
                        className="d-none"
                        preload="metadata"
                        onTimeUpdate={(e) => {
                          const audio = e.target
                          const container = audio.closest(".audio-player-simple")
                          const timeDisplay = container.querySelector(".text-muted")
                          const progressBar = container.querySelector(".form-range")

                          const minutes = Math.floor(audio.currentTime / 60)
                          const seconds = Math.floor(audio.currentTime % 60)
                          timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`

                          if (audio.duration) {
                            progressBar.value = (audio.currentTime / audio.duration) * 100
                          }
                        }}
                        onEnded={(e) => {
                          const container = e.target.closest(".audio-player-simple")
                          const playButton = container.querySelector("button")
                          playButton.innerHTML = "▶️"
                        }}
                      >
                        <source src={item.audioUrl} type="audio/webm" />
                        <source src={item.audioUrl} type="audio/mpeg" />
                        <source src={item.audioUrl} type="audio/wav" />
                      </audio>
                    </div>
                  </div>
                )}

                <div className="mb-1 d-flex justify-content-between align-items-center">
                  <span className="comment-likes">
                    {item.comments.filter((c) => c.isAccepted).length} Comments · {item.shares} Shares ·{" "}
                    {item.likes?.length} Likes
                  </span>
                  <span className="comment-likes">{formatDate(item.createdAt)}</span>
                </div>

                <div className="post-item mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2 align-items-center">
                      {item.likes?.includes(user._id) ? (
                        <img
                          onClick={() => likePost(item._id)}
                          src={likeNot || "/placeholder.svg"}
                          alt="like"
                          className="like-img"
                        />
                      ) : (
                        <img
                          onClick={() => likePost(item._id)}
                          src={like || "/placeholder.svg"}
                          alt="like"
                          className="like-img"
                        />
                      )}
                      <img
                        src={message || "/placeholder.svg"}
                        alt="comment"
                        className="like-img"
                        onClick={() => toggleCommentBox(item._id)}
                      />
                      <img
                        src={share || "/placeholder.svg"}
                        alt="share"
                        className="like-img me-2"
                        onClick={() => handleShareClick(item._id)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>

                  {activeCommentBox === item._id && (
                    <div className="mt-3 d-flex align-items-center gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a comment..."
                        value={comments[item._id] || ""}
                        onChange={(e) => handleCommentChange(item._id, e.target.value)}
                      />
                      <Button
                        onClick={() => handleCommentSubmit(item._id)}
                        variant="dark"
                        className="accept-button rounded-pill py-2 px-5"
                      >
                        Comment
                      </Button>
                    </div>
                  )}
                </div>

                <hr className="horizontal-line-between-comment" />

                {item.comments
                  .filter((c) => c.isAccepted)
                  .reverse()
                  .map((comment) => (
                    <Comment key={comment._id} comment={comment} PostId={item._id} />
                  ))}
              </div>
            )
          })
      )}

      <MediaViewer show={isAllMediaOpen} onHide={() => setIsAllMediaOpen(false)} mediaItems={media} />

      {/* Bootstrap Modal for Enlarged Media */}
      <Modal show={isModalOpen} onHide={closeMediaModal} centered size="lg">
        <Modal.Body className="p-0 text-center position-relative">
          {activeMedia?.type === "video" ? (
            <video controls autoPlay className="w-100">
              <source src={activeMedia.src} type="video/mp4" />
            </video>
          ) : (
            <img src={activeMedia?.src || "/placeholder.svg"} alt="enlarged" className="img-fluid rounded" />
          )}

          {/* Navigation arrows - only show if less than 4 total media items */}
          {allCurrentMedia.length > 1 && allCurrentMedia.length < 4 && (
            <>
              {/* Previous button */}
              {currentMediaIndex > 0 && (
                <button
                  className="btn btn-dark position-absolute"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1000,
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    border: "2px solid rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                  }}
                  onClick={goToPrevious}
                >
                  &#8249;
                </button>
              )}

              {/* Next button */}
              {currentMediaIndex < allCurrentMedia.length - 1 && (
                <button
                  className="btn btn-dark position-absolute"
                  style={{
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1000,
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    border: "2px solid rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: "white",
                  }}
                  onClick={goToNext}
                >
                  &#8250;
                </button>
              )}

              {/* Media counter */}
              <div
                className="position-absolute bg-dark text-white px-2 py-1 rounded"
                style={{
                  bottom: "10px",
                  right: "10px",
                  fontSize: "12px",
                  zIndex: 1000,
                }}
              >
                {currentMediaIndex + 1} / {allCurrentMedia.length}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share this Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control mb-2" value={shareUrl} readOnly />
          <Button variant="primary" onClick={handleCopy} className="w-100">
            Copy Link
          </Button>
          {copySuccess && <p className="text-success mt-2 text-center">Copied to clipboard!</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Post



