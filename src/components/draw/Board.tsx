import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MENU_ITEMS } from '@/constants';
import { actionItemClick } from '@/slice/menuSlice';
import { RootState } from '@/store'; // Ensure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Menu.module.css'; // Import your CSS module

const Board: React.FC = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const drawHistory = useRef<ImageData[]>([]);
  const historyPointer = useRef<number>(0);
  const shouldDraw = useRef<boolean>(false);

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

    const handleChangeConfig = (config: { color: string; size: number }) => {
      console.log('config', config);
      changeConfig(config.color, config.size);
    };

    if (color) {
      changeConfig(color, size);
    }
    // socket.on('changeConfig', handleChangeConfig);

    return () => {
      // socket.off('changeConfig', handleChangeConfig);
    };
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
        // socket.emit('beginPath', { x: clientX, y: clientY });
      };

      const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if (!shouldDraw.current) return;
        const clientX = (e as MouseEvent).clientX ?? (e as TouchEvent).touches[0].clientX;
        const clientY = (e as MouseEvent).clientY ?? (e as TouchEvent).touches[0].clientY;
        drawLine(clientX, clientY);
        // socket.emit('drawLine', { x: clientX, y: clientY });
      };

      const handleMouseUp = () => {
        shouldDraw.current = false;
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        drawHistory.current.push(imageData);
        historyPointer.current = drawHistory.current.length - 1;
      };

      const handleBeginPath = (path: { x: number; y: number }) => {
        beginPath(path.x, path.y);
      };

      const handleDrawLine = (path: { x: number; y: number }) => {
        drawLine(path.x, path.y);
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('touchstart', handleMouseDown);
      canvas.addEventListener('touchmove', handleMouseMove);
      canvas.addEventListener('touchend', handleMouseUp);

      // socket.on('beginPath', handleBeginPath);
      // socket.on('drawLine', handleDrawLine);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('touchstart', handleMouseDown);
        canvas.removeEventListener('touchmove', handleMouseMove);
        canvas.removeEventListener('touchend', handleMouseUp);

        // socket.off('beginPath', handleBeginPath);
        // socket.off('drawLine', handleDrawLine);
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
        return null;
    }

    return <FontAwesomeIcon icon={icon} className={styles.customCursorIcon} style={{ color: iconColor }} />;
  };

  useEffect(() => {
    if (!cursorRef.current) return;
    const cursor = cursorRef.current;

    cursor.style.display = activeMenuItem ? 'block' : 'none';
  }, [activeMenuItem]);

  return (
    <div>
      <canvas ref={canvasRef} className=""></canvas>
      <div ref={cursorRef} className={styles.customCursor}>
        {renderCursorIcon()}
      </div>
    </div>
  );
};

export default Board;
