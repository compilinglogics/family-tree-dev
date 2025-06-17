import React, { useRef, useState } from 'react'
import Mic from '../../assets/icons/post/create/Mic.svg'
import { Button } from 'react-bootstrap';

export default function AudioRecord({setFormData}) {
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
 
     // record audio end

    return (
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

    )
}
