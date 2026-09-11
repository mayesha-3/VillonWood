import React, { useState, useRef } from 'react';
import type { VillagerProfession } from '../types/village';
import mapImage from '../assets/map.png';
import { 
  Users, MessageSquare, MapPin, Anchor, Flame, Cake, 
  Wheat, Wine, Cloud, Shield, Wind, Hammer, Disc, Beer, Scissors, 
  Footprints, Wrench, Box, Circle, Archive, Feather, Utensils, Check
} from 'lucide-react';

interface MapViewerProps {
  villagers: VillagerProfession[];
  onSelectLocation: (villager: VillagerProfession) => void;
}

// Icon helper function for professions
const renderProfessionIcon = (iconName: string, size = 16) => {
  switch (iconName) {
    case 'Wheat': return <Wheat size={size} />;
    case 'Wine': return <Wine size={size} />;
    case 'Cloud': return <Cloud size={size} />;
    case 'Shield': return <Shield size={size} />;
    case 'Wind': return <Wind size={size} />;
    case 'Flame': return <Flame size={size} />;
    case 'Hammer': return <Hammer size={size} />;
    case 'Cake': return <Cake size={size} />;
    case 'Disc': return <Disc size={size} />;
    case 'Beer': return <Beer size={size} />;
    case 'Scissors': return <Scissors size={size} />;
    case 'Footprints': return <Footprints size={size} />;
    case 'Wrench': return <Wrench size={size} />;
    case 'Box': return <Box size={size} />;
    case 'Circle': return <Circle size={size} />;
    case 'Archive': return <Archive size={size} />;
    case 'Anchor': return <Anchor size={size} />;
    case 'Feather': return <Feather size={size} />;
    case 'Utensils': return <Utensils size={size} />;
    default: return <MapPin size={size} />;
  }
};

export const MapViewer: React.FC<MapViewerProps> = ({
  villagers,
  onSelectLocation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  // Full-map viewport: starts at 1.0 scale (entire map visible, uncropped)
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover state for tooltip pin preview
  const [hoveredVillager, setHoveredVillager] = useState<VillagerProfession | null>(null);

  // Live Debug Cursor Coordinates (0-100%)
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);
  const [copiedCoords, setCopiedCoords] = useState<{ x: number; y: number } | null>(null);

  // Mouse Drag & Cursor Coordinate tracking
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Primary click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update live cursor percentage coordinates
    if (mapImageRef.current) {
      const rect = mapImageRef.current.getBoundingClientRect();
      const rawX = ((e.clientX - rect.left) / rect.width) * 100;
      const rawY = ((e.clientY - rect.top) / rect.height) * 100;
      const clampedX = Math.round(Math.max(0, Math.min(100, rawX)));
      const clampedY = Math.round(Math.max(0, Math.min(100, rawY)));
      setCursorCoords({ x: clampedX, y: clampedY });
    }

    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setCursorCoords(null);
  };

  // Optional Smooth Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setScale((prevScale) => {
      const nextScale = Math.min(Math.max(prevScale * zoomFactor, 1), 3);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 }); // reset center when fully zoomed out
      }
      return nextScale;
    });
  };

  // Double click resets zoom to full-map overview
  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Map Click handler to easily copy coordinates for villagers.ts
  const handleMapClick = (e: React.MouseEvent) => {
    if (!mapImageRef.current) return;
    const rect = mapImageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const xPct = Math.round((clickX / rect.width) * 100);
    const yPct = Math.round((clickY / rect.height) * 100);
    if (xPct >= 0 && xPct <= 100 && yPct >= 0 && yPct <= 100) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`x: ${xPct}, y: ${yPct}`);
      }
      setCopiedCoords({ x: xPct, y: yPct });
      setTimeout(() => setCopiedCoords(null), 2500);
    }
  };

  // Grid steps for 0-100% overlay
  const majorSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const minorSteps = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];

  return (
    <div className="map-viewer-container" ref={containerRef}>
      {/* Interactive Viewport Canvas */}
      <div 
        className={`map-viewport ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        {/* Responsive 16:9 Aspect Ratio Map Stage */}
        <div 
          className="map-stage-wrapper"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
          onClick={handleMapClick}
        >
          {/* Main Village Map Image (Full 16:9 view, uncropped) */}
          <img 
            ref={mapImageRef}
            src={mapImage} 
            alt="Carte du village français ancien de VillonWood"
            className="village-map-image"
            draggable={false}
          />

          {/* Temporary Debug Coordinate Grid Overlay (0-100%) */}
          <div className="debug-grid-container">
            {/* SVG Grid Lines */}
            <svg className="debug-grid-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Minor Grid Lines (every 5%) */}
              {minorSteps.map((s) => (
                <React.Fragment key={`minor-${s}`}>
                  <line x1={s} y1={0} x2={s} y2={100} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.12" strokeDasharray="0.6 0.6" />
                  <line x1={0} y1={s} x2={100} y2={s} stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.12" strokeDasharray="0.6 0.6" />
                </React.Fragment>
              ))}

              {/* Major Grid Lines (every 10%) */}
              {majorSteps.map((s) => (
                <React.Fragment key={`major-${s}`}>
                  <line x1={s} y1={0} x2={s} y2={100} stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.2" />
                  <line x1={0} y1={s} x2={100} y2={s} stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.2" />
                </React.Fragment>
              ))}

              {/* 50% Center Axis Lines */}
              <line x1={50} y1={0} x2={50} y2={100} stroke="#f59e0b" strokeWidth="0.35" strokeDasharray="1 1" />
              <line x1={0} y1={50} x2={100} y2={50} stroke="#f59e0b" strokeWidth="0.35" strokeDasharray="1 1" />
            </svg>

            {/* X-Axis Percentage Labels across Top */}
            <div className="debug-axis-labels-x">
              {majorSteps.map((s) => (
                <div key={`lbl-x-${s}`} className="debug-grid-label x-label" style={{ left: `${s}%` }}>
                  {s}%
                </div>
              ))}
            </div>

            {/* Y-Axis Percentage Labels along Left */}
            <div className="debug-axis-labels-y">
              {majorSteps.map((s) => (
                <div key={`lbl-y-${s}`} className="debug-grid-label y-label" style={{ top: `${s}%` }}>
                  {s}%
                </div>
              ))}
            </div>

            {/* Live Cursor Coordinate Chip */}
            {cursorCoords && (
              <div 
                className="debug-cursor-chip"
                style={{
                  left: `${cursorCoords.x}%`,
                  top: `${cursorCoords.y}%`
                }}
              >
                x: {cursorCoords.x} | y: {cursorCoords.y}
              </div>
            )}
          </div>

          {/* Render 20 Interactive Villager Structure Pins with Debug x/y Values */}
          {villagers.map((v) => {
            const isBoat = v.id === 'fisherman';
            return (
              <div
                key={v.id}
                className={`map-hotspot-pin ${isBoat ? 'pin-boat' : ''}`}
                style={{
                  left: `${v.x}%`,
                  top: `${v.y}%`
                }}
                onMouseEnter={() => setHoveredVillager(v)}
                onMouseLeave={() => setHoveredVillager(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLocation(v);
                }}
              >
                {/* Debug Coordinate Badge Above Marker */}
                <div className="pin-debug-coord-badge">
                  x: {v.x} | y: {v.y}
                </div>

                <div className="pin-pulse-ring" />
                <div className="pin-icon-badge">
                  {renderProfessionIcon(v.iconName, 14)}
                </div>

                {/* Hotspot Label & Live People Badge */}
                <div className="pin-title-label">
                  <span className="pin-name">{v.name.split(' ')[0]}</span>
                  <span className="pin-occupants">
                    <Users size={10} /> {v.activeOccupantsCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coordinate Copied Toast */}
      {copiedCoords && (
        <div className="debug-copied-toast">
          <Check size={14} className="toast-icon" />
          <span>Coordonnées copiées : <strong>x: {copiedCoords.x}, y: {copiedCoords.y}</strong></span>
        </div>
      )}

      {/* Hovered Location Quick Tooltip Card */}
      {hoveredVillager && (
        <div className="hover-tooltip-card">
          <div className="tooltip-header">
            <img src={hoveredVillager.avatar} alt={hoveredVillager.characterName} className="tooltip-avatar" />
            <div>
              <div className="tooltip-french">{hoveredVillager.frenchTitle}</div>
              <div className="tooltip-title">{hoveredVillager.name}</div>
            </div>
          </div>
          <div className="tooltip-structure">
            <strong>Lieu :</strong> {hoveredVillager.structureName}
          </div>
          <div className="tooltip-occupants">
            <Users size={14} /> <span>{hoveredVillager.activeOccupantsCount} personnes discutent actuellement sur place</span>
          </div>
          <div className="tooltip-action">
            <MessageSquare size={14} /> Cliquer pour entrer et discuter
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
