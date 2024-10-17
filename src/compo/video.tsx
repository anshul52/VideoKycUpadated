// import React, { useEffect, useRef, useState } from "react";

// const VideoRecorder: React.FC = () => {
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [randomAlphabet, setRandomAlphabet] = useState<string>("");
//   const [timer, setTimer] = useState<number>(10); // Timer state
//   const [showRestart, setShowRestart] = useState<boolean>(false); // To show "Restart Recording" button
//   const [chunks, setChunks] = useState<Blob[]>([]); // To store the video data chunks
//   const [videoBlob, setVideoBlob] = useState<Blob | null>(null); // To store the final video blob
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const streamRef = useRef<MediaStream | null>(null); // To store the media stream

//   // Function to generate a random string of 5 alphabets
//   const getRandomAlphabet = (): string => {
//     const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     let result = "";
//     for (let i = 0; i < 5; i++) {
//       result += alphabet[Math.floor(Math.random() * alphabet.length)];
//     }
//     return result;
//   };

//   useEffect(() => {
//     let countdown: NodeJS.Timeout;
//     if (isRecording && timer > 0) {
//       countdown = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       stopRecording();
//       setShowRestart(true); // Show the restart button after recording stops
//     }

//     return () => clearInterval(countdown);
//   }, [isRecording, timer]);

//   const startRecording = async () => {
//     try {
//       // Request access to video and audio
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//       streamRef.current = stream; // Store the stream

//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         setChunks((prevChunks) => [...prevChunks, event.data]); // Collect chunks
//       };

//       mediaRecorder.start(); // Start recording
//       setIsRecording(true);
//       setChunks([]); // Clear chunks on new recording
//       setTimer(10); // Reset the timer to 10 seconds
//       setShowRestart(false); // Hide the restart button while recording
//       setRandomAlphabet(getRandomAlphabet()); // Generate and set a random 5-letter alphabet string
//     } catch (err) {
//       console.error("Error accessing camera or microphone:", err);
//     }
//   };

//   const stopCamera = () => {
//     const stream = streamRef.current;
//     if (stream) {
//       // Stop all tracks (video and audio)
//       stream.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//     setIsRecording(false);
//     stopCamera(); // Stop the camera and microphone when manually stopping the recording

//     // Combine chunks into a single video blob
//     const videoBlob = new Blob(chunks, { type: "video/webm" });
//     setVideoBlob(videoBlob); // Set the final video blob
//   };

//   const handleUpload = async () => {
//     if (!videoBlob) return;

//     const formData = new FormData();
//     formData.append("video", videoBlob, "recording.webm");

//     try {
//       // Replace with your actual upload logic
//       const response = await fetch("/upload", {
//         method: "POST",
//         body: formData,
//       });
//       if (response.ok) {
//         alert("Video uploaded successfully!");
//       } else {
//         alert("Failed to upload video.");
//       }
//     } catch (error) {
//       console.error("Error uploading video:", error);
//     }
//   };

//   return (
//     <div className="video-recorder p-5 bg-gray-900 text-gray-200 min-h-screen">
//       {isRecording ? (
//         <h2 className="text-2xl mb-4">
//           Read this Sentence: <br /> I am registering on coinspe.com on
//           14-10-2024 and my code is
//           <span className="font-bold text-yellow-400"> {randomAlphabet}</span>
//         </h2>
//       ) : (
//         <h2 className="text-2xl mb-4">
//           When the recording starts you have to read a sentence
//         </h2>
//       )}

//       <div className="video-frame mb-4 border border-gray-700 rounded w-full h-100 flex items-center justify-center bg-black">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {isRecording && (
//         <div className="text-red-400 mb-4">
//           Recording... Time left: {timer}s
//         </div>
//       )}

//       <div className="buttons">
//         {!isRecording && !showRestart && (
//           <button
//             onClick={startRecording}
//             className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition"
//           >
//             Start Recording
//           </button>
//         )}
//         {isRecording && (
//           <button
//             onClick={stopRecording}
//             className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
//           >
//             Stop Recording
//           </button>
//         )}
//         {showRestart && (
//           <button
//             onClick={startRecording}
//             className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded transition"
//           >
//             Restart Recording
//           </button>
//         )}
//         {!isRecording && videoBlob && (
//           <button
//             onClick={handleUpload}
//             className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
//           >
//             Upload Video
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoRecorder;

// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";

// const VideoRecorder: React.FC = () => {
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [randomAlphabet, setRandomAlphabet] = useState<string>("");
//   const [timer, setTimer] = useState<number>(10); // Timer state
//   const [showRestart, setShowRestart] = useState<boolean>(false); // To show "Restart Recording" button
//   const [chunks, setChunks] = useState<Blob[]>([]); // To store the video data chunks
//   const [videoBlob, setVideoBlob] = useState<Blob | null>(null); // To store the final video blob
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const streamRef = useRef<MediaStream | null>(null); // To store the media stream

//   // Function to generate a random string of 5 alphabets
//   const getRandomAlphabet = (): string => {
//     const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     let result = "";
//     for (let i = 0; i < 5; i++) {
//       result += alphabet[Math.floor(Math.random() * alphabet.length)];
//     }
//     return result;
//   };

//   useEffect(() => {
//     let countdown: NodeJS.Timeout;
//     if (isRecording && timer > 0) {
//       countdown = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       stopRecording();
//       setShowRestart(true); // Show the restart button after recording stops
//     }

//     return () => clearInterval(countdown);
//   }, [isRecording, timer]);

//   const startRecording = async () => {
//     try {
//       // Request access to video and audio (video: true, audio: true)
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true, // Audio enabled for voice recording
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream; // Set the stream to the video element
//       }

//       streamRef.current = stream; // Store the stream

//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         setChunks((prevChunks) => [...prevChunks, event.data]); // Collect chunks
//       };

//       mediaRecorder.start(); // Start recording
//       setIsRecording(true);
//       setChunks([]); // Clear chunks on new recording
//       setTimer(10); // Reset the timer to 10 seconds
//       setShowRestart(false); // Hide the restart button while recording
//       setRandomAlphabet(getRandomAlphabet()); // Generate and set a random 5-letter alphabet string
//     } catch (err) {
//       console.error("Error accessing camera or microphone:", err);
//     }
//   };

//   const stopCamera = () => {
//     const stream = streamRef.current;
//     if (stream) {
//       // Stop all tracks (video and audio)
//       stream.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//     setIsRecording(false);
//     stopCamera();

//     const videoBlob = new Blob(chunks, { type: "video/webm" });
//     setVideoBlob(videoBlob);
//   };

//   const handleUpload = async () => {
//     if (!videoBlob) return;

//     const formData = new FormData();
//     formData.append("video_file", videoBlob, "recording.webm");

//     try {
//       const response = await axios.post(
//         "http://172.31.100.156:8001/api/v2/basic-kyc/videokyc-verification",
//         formData,
//         {
//           headers: {
//             Authorization:
//               "Bearer sPD9xfN6SH9QV8gN/v4ae4nPmgfyjWl/7O64aFYKGljoBRDhrLUmxBAip22KHNpTejI8HfaGHWJA8rPoFZAQZvQOPcYDXkGMHckT3Yjveetgorfqyd/AWagVzm0jH3T/UxyaPS+OC10o3ML6erny1S2zsZBeGNrJ3vcD3Pm4gPF3d7cVpTju+j9vrit1An+o9KQRvBGS+P/Z0puabWi/sIUo8Gynz9PQrdFGjMfWVUCqAToA30BTK1f1sjI/ZSMLRzSLzVusiZqXMLA8bLv24CdulahixIWbN9d1P9QHFzLDAVix2eAPL8mTjKIQvlXdENBaHrr064vlWL1tWzx/wwG0jhDPBz8yDlYA207XOWSQxzF+LyuvMMzVj/YGAeUEZBG99mp0SvqzYyAfncBw+/KMlCZo2vxwXm+NFE4hrhFvMLoo4wEO9aBAZ2JB8o3VjwMG1Hjl6FhK8T46wLS9LDfFI+zzS8tBc9NjGAAPoenx", // Authorization token
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         alert("Video uploaded successfully!");
//       } else {
//         alert("Failed to upload video.");
//       }
//     } catch (error) {
//       console.error("Error uploading video:", error);
//       alert("An error occurred during upload.");
//     }
//   };

//   return (
//     <div className="video-recorder p-5 bg-gray-900 text-gray-200 min-h-screen">
//       {isRecording ? (
//         <h2 className="text-2xl mb-4">
//           Read this Sentence: <br /> I am registering on coinspe.com on
//           14-10-2024 and my code is
//           <span className="font-bold text-yellow-400"> {randomAlphabet}</span>
//         </h2>
//       ) : (
//         <h2 className="text-2xl mb-4">
//           When the recording starts you have to read the sentence below.
//         </h2>
//       )}

//       <video
//         ref={videoRef}
//         autoPlay
//         className="w-[300px] h-[700px] border-2 mb-4"
//       />

//       {videoBlob && (
//         <div className="mt-6">
//           {/* <h3 className="text-lg mb-4">Preview of your recorded video:</h3>
//           <video
//             src={URL.createObjectURL(videoBlob)}
//             controls
//             className="border-2 border-gray-500"
//           ></video> */}
//           <button
//             onClick={handleUpload}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Upload Video
//           </button>
//         </div>
//       )}

//       {!isRecording && !videoBlob && (
//         <button
//           onClick={startRecording}
//           className="px-4 py-2 bg-green-500 text-white rounded"
//         >
//           Start Recording
//         </button>
//       )}

//       {isRecording && (
//         <>
//           <p className="mt-4 text-lg">Recording ends in: {timer} seconds</p>
//           <button
//             onClick={stopRecording}
//             className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
//           >
//             Stop Recording
//           </button>
//         </>
//       )}

//       {showRestart && (
//         <button
//           onClick={startRecording}
//           className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
//         >
//           Restart Recording
//         </button>
//       )}
//     </div>
//   );
// };

// export default VideoRecorder;

// import React, { useEffect, useRef, useState } from "react";
// // import { uploadChunks } from "../utils/uploadChunks";

// const VideoRecorder = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [randomAlphabet, setRandomAlphabet] = useState("");
//   const [chunks, setChunks] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const [showRestart, setShowRestart] = useState(false); // To show "Restart Recording" button
//   const videoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const streamRef = useRef(null); // To store the media stream

//   const getRandomAlphabet = () => {
//     const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     let result = "";
//     for (let i = 0; i < 5; i++) {
//       result += alphabet[Math.floor(Math.random() * alphabet.length)];
//     }
//     return result;
//   };

//   useEffect(() => {
//     let countdown;
//     if (isRecording && timer > 0) {
//       countdown = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       stopRecording();
//       setShowRestart(true);
//     }

//     return () => clearInterval(countdown);
//   }, [isRecording, timer]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       videoRef.current.srcObject = stream;
//       streamRef.current = stream;

//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (e) => {
//         setChunks((prev) => [...prev, e.data]);
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//       setTimer(10);
//       setShowRestart(false);
//       setRandomAlphabet(getRandomAlphabet());
//     } catch (err) {
//       console.error("Error accessing camera or microphone:", err);
//     }
//   };

//   const stopCamera = () => {
//     const stream = streamRef.current;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setIsRecording(false);
//     stopCamera();
//   };

//   const handleUpload = async () => {
//     const fullVideoBlob = new Blob(chunks, { type: "video/webm" });
//     await uploadChunks(fullVideoBlob);
//   };

//   const uploadVideo = async (videoBlob: Blob) => {
//     const token = localStorage.getItem('token'); // Get token from localStorage

//     if (!token) {
//       setError("Token is missing!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('video_file', videoBlob, 'recorded-video.webm');

//     try {
//       const response = await axios.post(
//         'http://158.7.7.1:8000/api22/vv2/videokyc-verification',
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       setSuccess("Video KYC verification successful!");
//     } catch (error: any) {
//       setError(error.response?.data?.message || "Something went wrong during the upload.");
//     }
//   };
//   return (
//     <div className="video-recorder p-5 bg-dialogBackground text-gray-200 rounded-[5px]">
//       {isRecording ? (
//         <h2 className="text-2xl mb-4 font-poppinsSemibold600">
//           Read this Sentence: <br /> I am registering on coinspe.com on
//           14-10-2024 and my code is
//           <span className=" text-customYellow"> {randomAlphabet}</span>
//         </h2>
//       ) : (
//         <>
//           <h2 className="text-2xl mb-4 font-poppinsSemibold600">
//             When the recording start you have to read a sentence
//           </h2>
//         </>
//       )}

//       <div className="video-frame mb-4 border border-gray-700 rounded w-full h-100 flex items-center justify-center bg-black">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {isRecording && (
//         <div className="text-red-400 mb-4">
//           Recording... Time left: {timer}s
//         </div>
//       )}

//       <div className="buttons">
//         {!isRecording && !showRestart && (
//           <button
//             onClick={startRecording}
//             className="bg-boxBackground hover:bg-boxBackground text-white px-4 py-2 rounded transition"
//           >
//             Start Recording
//           </button>
//         )}
//         {isRecording && (
//           <button
//             onClick={stopRecording}
//             className="bg-customRed hover:bg-customRed text-white px-4 py-2 rounded transition"
//           >
//             Stop Recording
//           </button>
//         )}
//         {showRestart && (
//           <button
//             onClick={startRecording}
//             className="bg-customYellow hover:bg-customYellow text-white px-4 py-2 rounded transition"
//           >
//             Restart Recording
//           </button>
//         )}
//         {!isRecording && chunks.length > 0 && (
//           <button
//             onClick={handleUpload}
//             className="bg-customGreen hover:bg-customGreen text-white px-4 py-2 rounded transition"
//           >
//             Upload Video
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoRecorder;
