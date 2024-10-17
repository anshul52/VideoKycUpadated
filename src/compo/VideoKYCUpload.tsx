import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CircularTimer from "./CircularTimer";

const VideoRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [randomAlphabet, setRandomAlphabet] = useState<string>("");
  const [timer, setTimer] = useState<number>(10);
  const [showRestart, setShowRestart] = useState<boolean>(false);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [updateRender, setUpdateRender] = useState(false);
  const getRandomAlphabet = (): string => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
  };

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isRecording && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      stopRecording();
      setShowRestart(true); // Show the restart button after recording stops
    }

    return () => clearInterval(countdown);
  }, [isRecording, timer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: 9 / 16,
          width: { ideal: 720 },
          height: { ideal: 1280 },
          facingMode: "user",
        },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        setChunks((prevChunks) => [...prevChunks, event.data]);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setChunks([]);
      setTimer(10);
      setShowRestart(false);
      setRandomAlphabet(getRandomAlphabet());
    } catch (err) {
      console.error("Error accessing camera or microphone:", err);
    }
  };
  const restartRecording = () => {
    setChunks([]);
    setVideoBlob(null);
    startRecording();
  };
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    stopCamera();

    if (chunks.length) {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(videoBlob);
      setTimeout(() => setUpdateRender((prev) => !prev), 0);
    }
  };

  const handleUpload = async () => {
    if (!videoBlob) return;

    const formData = new FormData();
    formData.append("video_file", videoBlob, "recording.webm");

    try {
      const response = await axios.post(
        "http://172.31.100.156:8001/api/v2/basic-kyc/videokyc-verification",
        formData,
        {
          headers: {
            Authorization:
              "Bearer sPD9xfN6SH9QV8gN/v4ae4nPmgfyjWl/7O64aFYKGljoBRDhrLUmxBAip22KHNpTejI8HfaGHWJA8rPoFZAQZvQOPcYDXkGMHckT3Yjveetgorfqyd/AWagVzm0jH3T/UxyaPS+OC10o3ML6erny1S2zsZBeGNrJ3vcD3Pm4gPF3d7cVpTju+j9vrit1An+o9KQRvBGS+P/Z0puabWi/sIUo8Gynz9PQrdFGjMfWVUCqAToA30BTK1f1sjI/ZSMLRzSLzVusiZqXMLA8bLv24CdulahixIWbN9d1P9QHFzLDAVix2eAPL8mTjKIQvlXdENBaHrr064vlWL1tWzx/wwG0jhDPBz8yDlYA207XOWSQxzF+LyuvMMzVj/YGAeUEZBG99mp0SvqzYyAfncBw+/KMlCZo2vxwXm+NFE4hrhFvMLoo4wEO9aBAZ2JB8o3VjwMG1Hjl6FhK8T46wLS9LDfFI+zzS8tBc9NjGAAPoenx", // Authorization token
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Video uploaded successfully!");
      } else {
        alert("Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred during upload.");
    }
  };
  useEffect(() => {
    if (isRecording && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isRecording, videoRef, streamRef]);
  return (
    <div className="video-recorder flex items-center justify-center w-[950px] gap-10 p-5 bg-[#001820] text-gray-200 rounded-[20px]">
      <div
        className="h-[600px] overflow-hidden rounded-[5px] w-[400px] flex"
        style={{ aspectRatio: "9/16" }}
      >
        {isRecording ? (
          <video
            ref={videoRef}
            autoPlay
            className="w-[100%] h-[100%]  object-cover"
          />
        ) : videoBlob ? (
          <video
            src={URL.createObjectURL(videoBlob)}
            controls
            className="w-[100%] h-[100%]  object-cover"
            onLoadedMetadata={(e) => e.currentTarget.play()}
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1720048171419-b515a96a73b8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dummy Video Frame"
            className="w-[100%] h-[100%] object-cover"
          />
        )}
      </div>

      <div className="w-[460px] h-[550px]  flex flex-col justify-between items-start">
        <div className="bg-[#032E3E] h-[170px] flex items-end justify-center rounded-[10px]">
          <div className="bg-[#05222C] h-[164px] rounded-[10px] flex items-start px-[30px] justify-center flex-col">
            <h2 className="text-[18px] font-poppinsSemibold600 text-customYellow">
              Please read while recording:
            </h2>
            <h2 className="text-customGray/50 font-poppinsMedium500 text-[16px]">
              My name is John Cruise. I am registering on CoinsPe.com on 12
              December, 2024, <br /> and my code is {"  "}
              {isRecording ? randomAlphabet : "------"}.
            </h2>
          </div>
        </div>

        {/* {isRecording &&
         } */}
        <div className="w-full flex items-center justify-center ">
          <CircularTimer value={timer} />
        </div>
        <div className="w-full ">
          <button
            onClick={() => {
              if (!isRecording && !videoBlob) {
                startRecording();
              } else if (isRecording) {
                stopRecording();
              } else if (showRestart) {
                restartRecording();
              }
            }}
            className={`mt-4 px-4 py-2 ${
              !isRecording && !videoBlob
                ? "bg-[#FEC66D]"
                : isRecording
                ? "bg-customRed"
                : "bg-[#FEC66D]"
            } rounded-[5px] flex cursor-pointer items-center justify-center text-[14px] font-poppinsSemibold600 text-[#001015] h-[50px] w-full`}
          >
            {!isRecording && !videoBlob
              ? "Start Video Recording"
              : isRecording
              ? "Stop Recording"
              : "Restart Recording"}
          </button>
          <div className="w-full flex items-center gap-5 justify-center mt-5">
            <div className="cursor-pointer rounded-[5px] flex items-center justify-center h-[50px] w-[40%] border-[2px] border-[#05222C] text-[16px] text-[#fff]">
              Back
            </div>
            <button
              disabled={videoBlob ? true : false}
              onClick={handleUpload}
              className={`rounded-[5px] h-[50px] flex items-center justify-center w-[60%]  text-[#001015] ${
                videoBlob ? "bg-[#FEC66D]" : "bg-[#FEC66D]/50"
              } text-[18px] font-poppinsSemibold600 cursor-pointer`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;
