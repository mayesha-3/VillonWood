import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, Check, Download, RefreshCw, Sparkles, X } from 'lucide-react';
import { playSound } from '../utils/soundFX';
import { useLanguage } from '../contexts/LanguageContext';

interface CameraOverlayProps {
  onClose: () => void;
}

type CameraFilter = 'vintage' | 'warm' | 'noir' | 'normal';
type CameraFrame = 'none' | 'chef';

export const CameraOverlay: React.FC<CameraOverlayProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [filter, setFilter] = useState<CameraFilter>('vintage');
  const [frame, setFrame] = useState<CameraFrame>('none');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isSavedNotification, setIsSavedNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [onClose, stopCamera]);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support webcam access.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsCameraReady(true);
        setError(null);
      } catch (cameraError: unknown) {
        console.error('Unable to access the camera:', cameraError);
        setError('Camera access was blocked or unavailable. Please allow webcam access and try again.');
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [stopCamera]);

  // Capture frame with filters, frame overlay, and watermark
  const captureFrame = (): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setError('Camera is not ready yet.');
      return null;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      setError('The browser could not create the image.');
      return null;
    }

    // Apply canvas filter matching selected UI filter
    let canvasFilterString = 'none';
    if (filter === 'vintage') canvasFilterString = 'sepia(0.5) contrast(1.1) saturate(1.2)';
    else if (filter === 'warm') canvasFilterString = 'sepia(0.2) saturate(1.4) hue-rotate(-10deg)';
    else if (filter === 'noir') canvasFilterString = 'grayscale(1) contrast(1.3)';

    context.filter = canvasFilterString;
    context.drawImage(video, 0, 0, width, height);

    // Reset filter for frame and watermark drawing
    context.filter = 'none';

    // Draw Chef Frame on Canvas
    if (frame === 'chef') {
      context.save();
      context.font = '36px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const topEmojis = ['🥖', '🍞', '🧀', '🍷', '🍇', '🍎', '🥐', '🍖', '🍕', '🥘'];
      const bottomEmojis = ['🥐', '🍖', '🍷', '🍇', '🧀', '🍞', '🥖', '🍏', '🍐', '🧀'];
      const leftEmojis = ['🧀', '🍷', '🍇', '🥖', '🥐', '🍕'];
      const rightEmojis = ['🥖', '🥐', '🍎', '🍖', '🍷', '🧀'];

      // Top border
      for (let i = 0; i < topEmojis.length; i++) {
        const x = (width / (topEmojis.length + 1)) * (i + 1);
        context.fillText(topEmojis[i], x, 40);
      }

      // Bottom border
      for (let i = 0; i < bottomEmojis.length; i++) {
        const x = (width / (bottomEmojis.length + 1)) * (i + 1);
        context.fillText(bottomEmojis[i], x, height - 40);
      }

      // Left border
      for (let i = 0; i < leftEmojis.length; i++) {
        const y = (height / (leftEmojis.length + 1)) * (i + 1);
        context.fillText(leftEmojis[i], 40, y);
      }

      // Right border
      for (let i = 0; i < rightEmojis.length; i++) {
        const y = (height / (rightEmojis.length + 1)) * (i + 1);
        context.fillText(rightEmojis[i], width - 40, y);
      }

      // Chef Title Banner at bottom center
      context.font = 'bold 24px "Cinzel", "Times New Roman", serif';
      context.fillStyle = '#fde047';
      context.shadowColor = 'rgba(0, 0, 0, 0.95)';
      context.shadowBlur = 10;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.textAlign = 'center';
      context.fillText('👨‍🍳 MAÎTRE CHEF DE VILLONWOOD 🥖', width / 2, height - 80);

      context.restore();
    }

    // Draw Watermark Text
    context.save();
    context.font = 'bold 24px "Cinzel", "Times New Roman", serif';
    context.fillStyle = '#ffffff';
    context.shadowColor = 'rgba(0, 0, 0, 0.85)';
    context.shadowBlur = 6;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.textAlign = 'right';
    context.fillText('VILLONWOOD • 1789', width - 28, height - 28);
    context.restore();

    return canvas.toDataURL('image/png');
  };

  // Round Shutter Button Click: Captures image & shows preview
  const handleShutterClick = () => {
    playSound('shutter');
    const dataUrl = captureFrame();
    if (dataUrl) {
      setCapturedImage(dataUrl);
    }
  };

  // Retake / Reset Preview back to live stream
  const handleRetake = () => {
    playSound('click');
    setCapturedImage(null);
  };

  // Enregistrer (Download) Button Click: Downloads captured preview image (or captures & downloads if none yet)
  const handleDownload = async () => {
    playSound('click');
    let imageToDownload = capturedImage;

    if (!imageToDownload) {
      imageToDownload = captureFrame();
      if (imageToDownload) {
        setCapturedImage(imageToDownload);
      }
    }

    if (!imageToDownload) return;

    try {
      const response = await fetch(imageToDownload);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = `villonwood-photo-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setIsSavedNotification(true);
      window.setTimeout(() => setIsSavedNotification(false), 2000);
    } catch (captureError: unknown) {
      console.error('Failed to save camera image:', captureError);
      setError('The photo could not be saved. Please try again.');
    }
  };

  return (
    <div className="overlay-backdrop" onClick={handleClose}>
      <div className="camera-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="camera-header">
          <div className="camera-title">
            <Camera size={20} className="camera-icon" />
            <span>{t('cameraTitle')}</span>
          </div>
          <button className="close-modal-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <div className={`camera-viewfinder filter-${filter}`}>
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="camera-video"
            style={{ display: capturedImage ? 'none' : 'block' }}
          />

          {/* Captured Preview Image */}
          {capturedImage && (
            <img 
              src={capturedImage} 
              alt={t('cameraPreview')} 
              className="camera-preview-img" 
            />
          )}

          {/* Role Frame Overlay (Chef Frame) */}
          {!capturedImage && frame === 'chef' && (
            <div className="role-frame-chef-overlay">
              <div className="frame-border-top">
                <span>🥖</span><span>🍞</span><span>🧀</span><span>🍷</span><span>🍇</span><span>🍎</span><span>🥐</span><span>🍖</span><span>🍕</span>
              </div>
              <div className="frame-border-bottom">
                <span>🥐</span><span>🍖</span><span>🍷</span><span>🍇</span><span>🧀</span><span>🍞</span><span>🥖</span><span>🍏</span><span>🍐</span>
              </div>
              <div className="frame-border-left">
                <span>🧀</span><span>🍷</span><span>🍇</span><span>🥖</span><span>🥐</span>
              </div>
              <div className="frame-border-right">
                <span>🥖</span><span>🥐</span><span>🍎</span><span>🍖</span><span>🍷</span>
              </div>
              <div className="frame-chef-banner">
                👨‍🍳 MAÎTRE CHEF DE VILLONWOOD 🥖
              </div>
            </div>
          )}

          {!isCameraReady && !error && (
            <div className="camera-status-overlay">
              <div className="camera-status-spinner" />
              <span>{t('cameraStarting')}</span>
            </div>
          )}

          {error && (
            <div className="camera-status-overlay error">
              <AlertCircle size={22} />
              <span>{error}</span>
            </div>
          )}

          <div className="viewfinder-frame">
            <div className="viewfinder-corner top-left" />
            <div className="viewfinder-corner top-right" />
            <div className="viewfinder-corner bottom-left" />
            <div className="viewfinder-corner bottom-right" />
            {!capturedImage && <div className="viewfinder-watermark">VILLONWOOD • 1789</div>}
          </div>

          {capturedImage && (
            <div className="preview-badge">
              <span>{t('cameraPreview')}</span>
              <button type="button" className="retake-badge-btn" onClick={handleRetake}>
                <RefreshCw size={12} /> {t('cameraRetake')}
              </button>
            </div>
          )}

          {isSavedNotification && (
            <div className="capture-flash">
              <Check size={36} />
              <span>{t('cameraSaved')}</span>
            </div>
          )}
        </div>

        {/* Options Panel: Filters & Role Frames */}
        <div className="camera-controls-wrapper">
          <div className="camera-options-panel">
            <div className="option-row">
              <span className="option-label">{t('cameraFilters')}:</span>
              <div className="filter-options">
                <button className={`filter-btn ${filter === 'vintage' ? 'active' : ''}`} onClick={() => { playSound('click'); setFilter('vintage'); }}>{t('cameraFilterParchment')}</button>
                <button className={`filter-btn ${filter === 'warm' ? 'active' : ''}`} onClick={() => { playSound('click'); setFilter('warm'); }}>{t('cameraFilterAutumn')}</button>
                <button className={`filter-btn ${filter === 'noir' ? 'active' : ''}`} onClick={() => { playSound('click'); setFilter('noir'); }}>{t('cameraFilterInk')}</button>
                <button className={`filter-btn ${filter === 'normal' ? 'active' : ''}`} onClick={() => { playSound('click'); setFilter('normal'); }}>{t('cameraFilterNormal')}</button>
              </div>
            </div>

            <div className="option-row">
              <span className="option-label">{t('cameraFrames')}:</span>
              <div className="filter-options">
                <button className={`filter-btn ${frame === 'none' ? 'active' : ''}`} onClick={() => { playSound('click'); setFrame('none'); }}>{t('cameraFrameNone')}</button>
                <button className={`filter-btn ${frame === 'chef' ? 'active' : ''}`} onClick={() => { playSound('click'); setFrame('chef'); }}>{t('cameraFrameChef')}</button>
              </div>
            </div>
          </div>

          <div className="camera-actions">
            {/* Round Button: Captures photo & shows preview */}
            <button 
              type="button"
              className={`shutter-btn ${capturedImage ? 'has-preview' : ''}`} 
              onClick={handleShutterClick}
              title={capturedImage ? t('cameraRetakePhoto') : t('cameraTakePhoto')}
            >
              <div className="shutter-inner">
                <Sparkles size={20} />
              </div>
            </button>

            {/* Enregistrer Button: Downloads the photo */}
            <button 
              type="button"
              className="download-btn" 
              onClick={handleDownload}
              title={t('cameraDownloadTooltip')}
            >
              <Download size={16} />
              <span>{t('cameraDownload')}</span>
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default CameraOverlay;
