import React, { useState, useRef } from 'react';
import type { VillagerProfession } from '../types/village';
import mapImage from '../assets/map.png';
import { 
  Users, MessageSquare, MapPin, Anchor, Flame, Cake, 
  Wheat, Wine, Cloud, Shield, Wind, Hammer, Disc, Beer, Scissors, 
  Footprints, Wrench, Box, Circle, Archive, Feather, Utensils
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

  const getClampedPosition = (newX: number, newY: number, currentScale: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const { clientWidth, clientHeight } = containerRef.current;
    const maxShiftX = Math.max(0, ((currentScale - 1) * clientWidth) / 2);
    const maxShiftY = Math.max(0, ((currentScale - 1) * clientHeight) / 2);

    return {
      x: Math.min(Math.max(newX, -maxShiftX), maxShiftX),
      y: Math.min(Math.max(newY, -maxShiftY), maxShiftY)
    };
  };

  // Mouse Drag handlers (when scale > 1 or panning)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Primary click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setPosition(getClampedPosition(rawX, rawY, scale));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Optional Smooth Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setScale((prevScale) => {
      const nextScale = Math.min(Math.max(prevScale * zoomFactor, 1), 3);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        setPosition((prevPos) => getClampedPosition(prevPos.x, prevPos.y, nextScale));
      }
      return nextScale;
    });
  };

  // Double click resets zoom to full-map overview
  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="map-viewer-container" ref={containerRef}>
      {/* Interactive Viewport Canvas */}
      <div 
        className={`map-viewport ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
        >
          {/* Main Village Map Image (Full 16:9 view, uncropped) */}
          <img 
            ref={mapImageRef}
            src={mapImage} 
            alt="Carte du village français ancien de VillonWood"
            className="village-map-image"
            draggable={false}
          />

          {/* Render 20 Interactive Villager Structure Pins (Preserving exact x/y positions) */}
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
                <div className="pin-pulse-ring" />
                <div className="pin-icon-badge">
                  {renderProfessionIcon(v.iconName, 14)}
                </div>

                {/* Hotspot Label & Live People Badge */}
                <div className="pin-title-label">
                  <span className="pin-name">{v.name}</span>
                  <span className="pin-occupants">
                    <Users size={10} /> {v.activeOccupantsCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hovered Location Quick Tooltip Card */}
      {hoveredVillager && (
        <div className="hover-tooltip-card">
          {hoveredVillager.bgImage && (
            <div className="tooltip-img-wrapper">
              <img src={hoveredVillager.bgImage} alt={hoveredVillager.name} className="tooltip-bg-preview" />
            </div>
          )}
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
