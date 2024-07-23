"use client";

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import * as cam from '@mediapipe/camera_utils';
import { useSelector, useDispatch } from 'react-redux';
import { MENU_ITEMS } from '@/constants';
import { actionItemClick } from '@/slice/menuSlice';
import { RootState } from '@/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown, faEye, faEyeSlash, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import styles from './Menu.module.css'; // Import your CSS module

const Cam: React.FC = () => {
  const dispatch = useDispatch();
  const webcamRef = useRef<Webcam | null>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const drawHistory = useRef<ImageData[]>([]);
  const historyPointer = useRef<number>(0);
  const shouldDraw = useRef<boolean>(false);
  const [showVideoCanvas, setShowVideoCanvas] = useState<boolean>(true);

  const { activeMenuItem, actionMenuItem } = useSelector((state: RootState) => state.menu);
  const { color, size } = useSelector((state: RootState) => state.toolbox[activeMenuItem] || { color: '#000', size: 1 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
        const URL = canvas.toDataURL();
        const anchor = document.createElement('a');
        anchor.href = URL;
        anchor.download = 'sketch.jpg';
        anchor.click();
      } else if (actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO) {
        if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1;
        if (historyPointer.current < drawHistory.current.length - 1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1;
        const imageData = drawHistory.current[historyPointer.current];
        context.putImageData(imageData, 0, 0);
      }
      dispatch(actionItemClick(null));
    }
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const changeConfig = (color: string, size: number) => {
      if (context) {
        context.strokeStyle = color;
        context.lineWidth = size;
      }
    };

    if (color) {
      changeConfig(color, size);
    }
  }, [color, size]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (canvas && context) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const beginPath = (x: number, y: number) => {
        context.beginPath();
        context.moveTo(x, y);
      };

      const drawLine = (x: number, y: number) => {
        context.lineTo(x, y);
        context.stroke();
      };

      const handleMouseDown = (e: MouseEvent | TouchEvent) => {
        shouldDraw.current = true;
        const clientX = (e as MouseEvent).clientX ?? (e as TouchEvent).touches[0].clientX;
        const clientY = (e as MouseEvent).clientY ?? (e as TouchEvent).touches[0].clientY;
        beginPath(clientX, clientY);
      };

      const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if (!shouldDraw.current) return;
        const clientX = (e as MouseEvent).clientX ?? (e as TouchEvent).touches[0].clientX;
        const clientY = (e as MouseEvent).clientY ?? (e as TouchEvent).touches[0].clientY;
        drawLine(clientX, clientY);
      };

      const handleMouseUp = () => {
        shouldDraw.current = false;
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        drawHistory.current.push(imageData);
        historyPointer.current = drawHistory.current.length - 1;
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('touchstart', handleMouseDown);
      canvas.addEventListener('touchmove', handleMouseMove);
      canvas.addEventListener('touchend', handleMouseUp);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('touchstart', handleMouseDown);
        canvas.removeEventListener('touchmove', handleMouseMove);
        canvas.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !cursorRef.current) return;
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const renderCursorIcon = () => {
    let icon;
    let iconColor = color; // Default color for all icons except the eraser

    switch (activeMenuItem) {
      case MENU_ITEMS.PENCIL:
        icon = faPencil;
        break;
      case MENU_ITEMS.ERASER:
        icon = faEraser;
        iconColor = '#000'; // Keep the eraser icon black
        break;
      case MENU_ITEMS.UNDO:
        icon = faRotateLeft;
        break;
      case MENU_ITEMS.REDO:
        icon = faRotateRight;
        break;
      case MENU_ITEMS.DOWNLOAD:
        icon = faFileArrowDown;
        break;
      default:
        icon = faHandPointer; // Default cursor icon
        break;
    }

    return <FontAwesomeIcon icon={icon} className={styles.customCursorIcon} style={{ color: iconColor }} />;
  };

  useEffect(() => {
    if (!cursorRef.current) return;
    const cursor = cursorRef.current;

    cursor.style.display = activeMenuItem ? 'block' : 'none';
  }, [activeMenuItem]);

  // Hand detection setup
  useEffect(() => {
    const handpose = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    handpose.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    handpose.onResults((results) => {
      const videoCanvasElement = videoCanvasRef.current;
      const drawCanvasElement = canvasRef.current;
      const videoCanvasCtx = videoCanvasElement?.getContext('2d');

      if (!videoCanvasElement || !videoCanvasCtx || !drawCanvasElement || !webcamRef.current) return;

      const videoWidth = webcamRef.current.video?.videoWidth || window.innerWidth;
      const videoHeight = webcamRef.current.video?.videoHeight || window.innerHeight;
      videoCanvasElement.width = videoWidth;
      videoCanvasElement.height = videoHeight;

      videoCanvasCtx.save();
      videoCanvasCtx.clearRect(0, 0, videoCanvasElement.width, videoCanvasElement.height);
      videoCanvasCtx.drawImage(results.image, 0, 0, videoCanvasElement.width, videoCanvasElement.height);

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(videoCanvasCtx, landmarks, HAND_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 5,
          });
          drawLandmarks(videoCanvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
      }

      const tipIds = [4, 8, 12, 16, 20];
      const fingUp = [0, 0, 0, 0, 0];
      if (results.multiHandLandmarks.length !== 0) {
        const temp = results.multiHandLandmarks[0];
        const x1 = temp[8].x  * videoWidth-(2*videoWidth/3);
        const y1 = temp[8].y * 2 * videoHeight;
        
        const adjustedX1 = videoWidth - x1;
        const adjustedX = adjustedX1 * 1.5 - videoWidth / 3;
        const adjustedY = y1;  // Adjust x coordinate for mirrored video
        console.log(adjustedX1);
        
        if (temp[tipIds[0]].x > temp[tipIds[0] - 1].x) {
          fingUp[0] = 1;
        }

        for (let i = 1; i < 5; i++) {
          if (temp[tipIds[i]].y < temp[tipIds[i] - 2].y) {
            fingUp[i] = 1;
          }
        }

        // Cursor move mode when all five fingers are up
        if (fingUp.every(finger => finger === 1)) {
          cursorRef.current!.style.left = `${adjustedX1}px`;
          cursorRef.current!.style.top = `${y1}px`;
          shouldDraw.current = false;
          dispatch(actionItemClick(MENU_ITEMS.PENCIL)); // Set to cursor move mode
        } else if (fingUp[1] === 1 && fingUp[2] === 1) {
          // Eraser mode when both index and middle fingers are up
          const canvas = canvasRef.current;
          const context = canvas!.getContext('2d');

          context!.globalCompositeOperation = 'destination-out';
          context!.lineWidth = (size ?? 1) * 2; // Make eraser larger
          shouldDraw.current = true;
          dispatch(actionItemClick(MENU_ITEMS.ERASER)); // Set to eraser mode
        } else if (fingUp[1] === 1 && fingUp[2] === 0) {
          // Normal drawing mode
          const canvas = canvasRef.current;
          const context = canvas!.getContext('2d');

          if (shouldDraw.current) {
            context!.lineTo(adjustedX, adjustedY);
            context!.stroke();
            context!.beginPath();
            context!.moveTo(adjustedX, adjustedY);
          } else {
            shouldDraw.current = true;
            context!.beginPath();
            context!.moveTo(adjustedX, adjustedY);
          }
          context!.globalCompositeOperation = 'source-over';
          context!.lineWidth = size ?? 1;
          dispatch(actionItemClick(MENU_ITEMS.PENCIL)); // Set to drawing mode
        } else {
          // Normal drawing mode
          const canvas = canvasRef.current;
          const context = canvas!.getContext('2d');
          context!.globalCompositeOperation = 'source-over';
          context!.lineWidth = size ?? 1;
          dispatch(actionItemClick(MENU_ITEMS.PENCIL)); // Set to drawing mode
        }
      }

      videoCanvasCtx.restore();
    });

    if (webcamRef.current) {
      const camera = new cam.Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await handpose.send({ image: webcamRef.current!.video! });
        },
        width: window.innerWidth,
        height: window.innerHeight,
      });
      camera.start();
    }
  }, [dispatch, size]);

  return (
    <div>
      <Webcam hidden
        ref={webcamRef}
        onLoadedMetadata={() => {
          if (webcamRef.current && videoCanvasRef.current) {
            const videoWidth = webcamRef.current.video?.videoWidth || window.innerWidth;
            const videoHeight = webcamRef.current.video?.videoHeight || window.innerHeight;
            videoCanvasRef.current.width = videoWidth;
            videoCanvasRef.current.height = videoHeight;
          }
        }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1, // Lower z-index to ensure other elements appear on top
          transform: 'scaleX(-1)',
        }}
      />
      <canvas
        ref={videoCanvasRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0, // Lower z-index to ensure other elements appear on top
          transform: 'scaleX(-1)',
          display: showVideoCanvas ? 'block' : 'none',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9, // Ensure drawing canvas is on top of the video canvas
        }}
      />
      <button
        onClick={() => setShowVideoCanvas((prev) => !prev)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 10, // Ensure button is on top of everything
          padding: '10px',
          background: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {showVideoCanvas ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
      </button>
      <div ref={cursorRef} className={styles.customCursor}>
        {renderCursorIcon()}
      </div>
    </div>
  );
};

export default Cam;
