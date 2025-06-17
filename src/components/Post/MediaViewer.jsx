import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MediaViewer = ({ show, onHide, mediaItems = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!show) setCurrentIndex(0);
  }, [show]);

  const currentItem = mediaItems[currentIndex];

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (currentIndex < mediaItems.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleThumbnailClick = (index) => setCurrentIndex(index);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      className="media-viewer-modal"
      backdrop={true}
      keyboard={true}
    >
      <Modal.Body className="bg-black text-white position-relative p-0">

      <div
  onClick={onHide}
  className="d-flex align-items-center justify-content-center"
  style={{
    position: 'absolute',
    top: 10,
    right: 15,
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // faded gray
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 5
  }}
>
  &times;
</div>

        {/* Main media area */}
        <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
          {currentIndex > 0 && (
            <div
            className="position-absolute start-0 ms-3 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)", // faded gray background
              borderRadius: "50%",                  // circular shape
              width: "40px",
              height: "40px",
              cursor: "pointer",
              zIndex: 2,
            }}
            onClick={goPrev}
          >
            <FaChevronLeft className="text-white" size={20} />
          </div>
          )}

          {currentItem?.type === 'video' ? (
            <video controls className="img-fluid rounded" style={{ maxHeight: '100%', maxWidth: '100%' }}>
              <source src={currentItem.url} type="video/mp4" />
            </video>
          ) : (
            <img
              src={currentItem?.url}
              alt="media"
              className="img-fluid rounded"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          )}

          {currentIndex < mediaItems.length - 1 && (
           <div
           className="position-absolute end-0 me-3 d-flex align-items-center justify-content-center"
           style={{
             backgroundColor: "rgba(0, 0, 0, 0.3)", // faded gray
             borderRadius: "50%",                  // make it circular
             width: "40px",                        // equal width & height
             height: "40px",
             cursor: "pointer",
             zIndex: 2,
           }}
           onClick={goNext}
         >
           <FaChevronRight className="text-white" size={20} />
         </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="d-flex justify-content-center gap-2 p-2 bg-dark flex-wrap">
          {mediaItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`rounded border ${index === currentIndex ? 'border-primary' : 'border-secondary'}`}
              style={{ cursor: 'pointer', width: 80, height: 60, overflow: 'hidden' }}
            >
              {item.type === 'video' ? (
                <video muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src={item.url} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={item.url}
                  alt={`thumb-${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MediaViewer;
