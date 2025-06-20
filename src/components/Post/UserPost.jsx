import { useEffect, useState } from "react"
import { getUserPost } from "../../utils/postApi"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import LinkIcon from "../../assets/icons/post/Link-icon.svg"
import PPCoin from "../../assets/images/PP-coin.svg"
import PostDropdown from "./PostDropdown"
import likeNot from "../../assets/images/likeNot.svg"
import message from "../../assets/images/message.svg"
import share from "../../assets/images/share.svg"
import like from "../../assets/images/like.svg"
import { addComment, postLike } from "../../utils/familytreeApi"
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap"
import ThreeDots from "../../assets/images/3 dots.svg"
import CommonModal from "../CommonModal/CommonModal"
import MainCalendar from "../MainCalendar/MainCalendar"
import CommonLine from "../CommonLine/CommonLine"
import Comment from "./Comment"
import MediaViewer from "./MediaViewer"
import { AiFillPlayCircle } from "react-icons/ai"
import Verified from "../../assets/images/verified.svg" // Declare the Verified variable

export default function UserPost() {
  const { Id } = useParams()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [newuser, setnewuser] = useState([])
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))
  const [activeCommentBox, setActiveCommentBox] = useState(null)
  const [comments, setComments] = useState({})
  const [calendar, setCalendar] = useState(false)
  const navigate = useNavigate()

  // Generate years dynamically
  const currentYear = new Date().getFullYear()
  // const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Last 10 years
  const years = [...new Set(posts.map((post) => new Date(post.eventDate).getFullYear()))].sort((a, b) => b - a)

  // Fetch posts
  const callPostApi = async () => {
    try {
      const response = await getUserPost(Id)
      if (response.success) {
        setPosts(response.posts)
        setFilteredPosts(response.posts)
        setnewuser(response.user)
      }
    } catch (error) {
      toast.error(error?.message)
    }
  }

  useEffect(() => {
    callPostApi()
  }, [])

  // Filter posts based on selected year and month
  useEffect(() => {
    let filtered = posts
    if (selectedYear) {
      filtered = filtered.filter((post) => new Date(post.eventDate).getFullYear() === selectedYear)
    }
    if (selectedMonth !== null) {
      filtered = filtered.filter((post) => new Date(post.eventDate).getMonth() + 1 === selectedMonth)
    }
    setFilteredPosts(filtered)
  }, [selectedYear, selectedMonth, posts])
  // Date formatting
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      // hour: 'numeric',
      // minute: '2-digit',
      // hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Comment functions
  const toggleCommentBox = (postId) => {
    setActiveCommentBox((prev) => (prev === postId ? null : postId))
  }

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({ ...prev, [postId]: value }))
  }

  const handleCommentSubmit = async (postId) => {
    console.log(addComment)
    try {
      if (comments[postId]?.trim()) {
        const response = await addComment({ id: postId, comment: comments[postId] })
        callPostApi()
        setComments((prev) => ({ ...prev, [postId]: "" }))
        setActiveCommentBox(null)
        toast.success(response?.message)
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

  const [date, setDate] = useState(new Date())
  const [selectedId, setSelectedId] = useState(Id)
  const onSubmit = () => {
    const date_n = new Date(date)

    // Extract year, month, and day
    const year = date_n.getFullYear()
    const month = String(date_n.getMonth() + 1).padStart(2, "0") // Months are 0-based, so add 1
    const day = String(date_n.getDate()).padStart(2, "0") // Ensure two digits for day

    // Combine into desired format
    const formattedDate = `${year}-${month}-${day}`

    navigate("/post", { state: { date: formattedDate, mamberId: selectedId } })
  }

  // url

  const [shareUrl, setShareUrl] = useState("") // Store URL for sharing
  const [showModal, setShowModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const handleShareClick = (postId) => {
    console.log(postId)

    setShareUrl(`${window.location.origin}/seepost/${postId}`) // Set share URL
    setShowModal(true) // Show modal
  }

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern secure method
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
      // Fallback method
      const textArea = document.createElement("textarea")
      textArea.value = shareUrl
      textArea.style.position = "fixed" // Avoid scrolling to bottom
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
  // ______________________

  const [activeMedia, setActiveMedia] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  const getAllMediaForItem = (item) => {
    const media = []
    if (item.videoUrl) {
      media.push({ type: "video", src: item.videoUrl })
    }
    if (item.imagesUrls) {
      item.imagesUrls.forEach((img) => {
        media.push({ type: "image", src: img })
      })
    }
    return media
  }

  const openMediaModal = (media) => {
    setActiveMedia(media)
    setIsModalOpen(true)
    setCurrentMediaIndex(media.index || 0)
  }

  const closeMediaModal = () => setIsModalOpen(false)

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1)
      setActiveMedia({
        ...activeMedia,
        src: activeMedia.allMedia[currentMediaIndex - 1].src,
        type: activeMedia.allMedia[currentMediaIndex - 1].type,
      })
    }
  }

  const handleNextMedia = () => {
    if (currentMediaIndex < activeMedia?.allMedia?.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1)
      setActiveMedia({
        ...activeMedia,
        src: activeMedia.allMedia[currentMediaIndex + 1].src,
        type: activeMedia.allMedia[currentMediaIndex + 1].type,
      })
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

  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const handleShowAllImages = (item) => {
    console.log("this is running")

    setSelectedMedia([...(item.videoUrl ? [item.videoUrl] : []), ...(item.imagesUrls || [])])
    setShowImageModal(true)
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

  return (
    <div>
      <CommonLine title="My story" />
      <div
        onClick={() => setCalendar(true)}
        className="event-line bg_secondary d-flex justify-content-between align-items-center p-3 "
      >
        <div className="d-flex">
          <img className="avatar me-2 rounded-pill" src={newuser?.profileImageUrl || "/placeholder.svg"} />

          <div className="">
            <span className="ps-1">{newuser?.fullName}</span> <br />
            <small className="text-muted">{new Date(newuser?.dob).getUTCFullYear()}</small>
            {", "}
            <small className="text-muted">{newuser?.country}</small>
          </div>
        </div>
        <Button className="post-line-btn p-0" variant="transparent">
          <img className="img-fluid" src={ThreeDots || "/placeholder.svg"} />
        </Button>
      </div>
      {/* Year & Month Selector Section */}
      <div className="d-flex my-3 align-items-center gap-3 p-3 bg_secondary rounded">
        {/* Year Dropdown */}
        <DropdownButton id="dropdown-year" title={selectedYear || new Date().getFullYear()} variant="outline-dark">
          {years.map((year) => (
            <Dropdown.Item key={year} onClick={() => setSelectedYear(year)}>
              {year}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        {/* Month Dropdown */}
        {/* <DropdownButton
                    id="dropdown-month"
                    title={selectedMonth ? `Month ${selectedMonth}` : "Select Month"}
                    variant="outline-dark"
                >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <Dropdown.Item key={month} onClick={() => setSelectedMonth(month)}>
                            {month}
                        </Dropdown.Item>
                    ))}
                </DropdownButton> */}
      </div>

      {/* Display Filtered Posts */}
      {filteredPosts
        .filter((item) => item.isApproved)
        // .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
        .map((item, index) => {
          const isExpanded = expandedIndexes[index]
          const lineCount = item.text.split("\n").length

          return (
            <div key={item._id} className="main-post-line same_shadow_border bg_secondary py-3 px-4 mt-3">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <img
                    className="avatar me-2 rounded-pill"
                    src={item.mainUser?.profileImageUrl || "/placeholder.svg"}
                  />
                  <div className="d-flex flex-column">
                    <span className="d-flex align-items-center mb-1">
                      <span className="name">{item.mainUser?.fullName}</span>
                      {item?.mainUser?.greenTick && (
                        <img className="verified-icon ms-1" src={Verified || "/placeholder.svg"} alt="" />
                      )}
                      {item?.mainUser?.isLinked && (
                        <img className="link-icon" src={LinkIcon || "/placeholder.svg"} alt="" />
                      )}
                      {/* <Link className="line-height-0">
                      <img className="link-icon" src={LinkIcon || "/placeholder.svg"} alt="" />
                    </Link> */}
                    </span>
                    <div className="post-location">
                      {item.mainUser?.country} {new Date(item.mainUser?.dob).getFullYear()}{" "}
                      <span className="coins-counter">
                        <span className="number">{item.mainUser?.ppScore?.toFixed(2)}</span>
                        <img className="img-fluid" src={PPCoin || "/placeholder.svg"} />
                      </span>
                    </div>
                  </div>
                </div>
                {
                  // item.userId === user._id ?
                  item.mainUser._id === user._id ? (
                    <PostDropdown item={item} page={"my-post"} getApi={callPostApi} />
                  ) : (
                    <PostDropdown item={item} page={"all-post"} getApi={callPostApi} />
                  )
                }
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
                      <div className="video-thumbnail-wrapper">
                        <video className="img-fluid rounded media-video" muted loop>
                          <source src={item.videoUrl} type="video/mp4" />
                        </video>
                        <div className="play-button-overlay">
                          <AiFillPlayCircle size={36} />
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
                        <img src={img || "/placeholder.svg"} alt="post" className="img-fluid rounded media-grid-img" />
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
                <audio className="col-4 img-fluid post-inner-audio" controls>
                  <source src={item.audioUrl} type="audio/mpeg" />
                </audio>
              )}

              <div className="mb-1 d-flex justify-content-between align-items-center">
                <span className="comment-likes">
                  {item.comments.filter((c) => c.isAccepted).length} Comments · {item.shares} Shares ·{" "}
                  {item.likes?.length} Likes
                </span>
                <span className="comment-likes">{formatDate(item.eventDate)}</span>
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
                  {/* <div className="d-flex gap-2 align-items-center">
                  <img className="emojis img-fluid" src={commonImage || "/placeholder.svg"} alt="common-img" />
                </div> */}
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
        })}

      {filteredPosts.length === 0 ? (
        <div className="feed-container flex justify-center items-center h-screen border mt-5 p-5">
          <div className="bg-gray-100 p-6 rounded-2xl shadow-md text-center max-w-md">
            <p className="text-lg font-semibold">My Story is empty.</p>
            <p className="text-gray-600 mt-2">You can start writing your story using the text box above.</p>
            <p className="text-gray-600 mt-2">
              You will be prompted to enter the ‘event date’, the most approximate date of the event in the story.
            </p>
            <p className="text-gray-600 mt-2">
              Events will be cataloged here by event date and shared with your family and followers unless you have
              restricted distribution.
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
      <CommonModal
        className="calendar-modal"
        title="Event Date"
        show={calendar}
        onHide={() => setCalendar(false)}
        submitBtnTxt="Confirm"
        secondButtonAction={onSubmit}
        hideFirstAction
        hideClose
      >
        <MainCalendar
          minYear={1000}
          maxYear={10}
          className="mt-3"
          defaultView="month"
          onChange={setDate}
          value={date}
        />
      </CommonModal>

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

      <MediaViewer show={isAllMediaOpen} onHide={() => setIsAllMediaOpen(false)} mediaItems={media} />
      {/* 
      <Modal show={isAllMediaOpen} onHide={closeAllMediaModal} centered size="lg">
        <Modal.Body className="p-3">
          <div className="row g-2">
            {selectedItem?.videoUrl && (
              <div className="col-6">
                <div className="media-grid-item">
                  <video controls className="img-fluid rounded media-video">
                    <source src={selectedItem.videoUrl} type="video/mp4" />
                  </video>
                </div>
              </div>
            )}

            {selectedItem?.imagesUrls?.map((img, index) => (
              <div key={index} className="col-6">
                <div className="media-grid-item">
                  <img src={img || "/placeholder.svg"} alt="post" className="img-fluid rounded media-grid-img" />
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal> */}

      {/* Bootstrap Modal for Enlarged Media */}
      <Modal show={isModalOpen} onHide={closeMediaModal} centered>
        <Modal.Body className="p-0 text-center position-relative">
          {activeMedia?.type === "video" ? (
            <video controls autoPlay className="w-100">
              <source src={activeMedia.src} type="video/mp4" />
            </video>
          ) : (
            <img src={activeMedia?.src || "/placeholder.svg"} alt="enlarged" className="img-fluid rounded" />
          )}
          {/* Add this inside Modal.Body, right after the image/video content */}
          {activeMedia?.allMedia?.length > 1 && activeMedia?.allMedia?.length < 4 && (
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
                  onClick={handlePrevMedia}
                >
                  &#8249;
                </button>
              )}

              {/* Next button */}
              {currentMediaIndex < (activeMedia?.allMedia?.length || 0) - 1 && (
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
                  onClick={handleNextMedia}
                >
                  &#8250;
                </button>
              )}

              {/* Media counter */}
              <div
                className="position-absolute bg-dark text-white px-3 py-1 rounded"
                style={{
                  bottom: "15px",
                  right: "15px",
                  fontSize: "14px",
                  zIndex: 1000,
                }}
              >
                {currentMediaIndex + 1} / {activeMedia?.allMedia?.length}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}
