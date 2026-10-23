import React, { useState, useRef } from 'react';
import type { VillagerProfession } from '../types/village';
import mapImage2 from '../assets/map2.png';
import {
  Users, MessageSquare, MapPin, Laptop, Disc, Coffee,
  BookOpen, Film, Compass, ShoppingBag, Camera, Cake,
  Palette, Smartphone, Headphones, Feather, Sparkles,
  Shield, Utensils, Wine, Wrench
} from 'lucide-react';

interface MapViewer2Props {
  villagers: VillagerProfession[];
  onSelectLocation: (villager: VillagerProfession) => void;
}

// Icon helper function for 2000s urban French professions
const renderCityIcon = (iconName: string, size = 16) => {
  switch (iconName) {
    case 'Laptop': return <Laptop size={size} />;
    case 'Disc': return <Disc size={size} />;
    case 'Coffee': return <Coffee size={size} />;
    case 'BookOpen': return <BookOpen size={size} />;
    case 'Film': return <Film size={size} />;
    case 'Compass': return <Compass size={size} />;
    case 'ShoppingBag': return <ShoppingBag size={size} />;
    case 'Camera': return <Camera size={size} />;
    case 'Cake': return <Cake size={size} />;
    case 'Palette': return <Palette size={size} />;
    case 'Smartphone': return <Smartphone size={size} />;
    case 'Headphones': return <Headphones size={size} />;
    case 'Feather': return <Feather size={size} />;
    case 'Sparkles': return <Sparkles size={size} />;
    case 'Shield': return <Shield size={size} />;
    case 'Utensils': return <Utensils size={size} />;
    case 'Wine': return <Wine size={size} />;
    case 'Wrench': return <Wrench size={size} />;
    default: return <MapPin size={size} />;
  }
};

export const MapViewer2: React.FC<MapViewer2Props> = ({
  villagers,
  onSelectLocation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  // Full-map viewport: starts at 1.0 scale
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover state for tooltip preview
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
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

  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="map-viewer-container map-viewer-city2" ref={containerRef}>
      {/* City Zone Indicator Pill */}
      <div 
        style={{
          position: 'absolute',
          top: 18,
          right: 90,
          zIndex: 40,
          background: 'linear-gradient(135deg, rgba(20, 36, 48, 0.9), rgba(12, 22, 30, 0.95))',
          border: '1px solid rgba(56, 189, 248, 0.45)',
          borderRadius: 9999,
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          color: '#e0f2fe',
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: 0.5,
          backdropFilter: 'blur(10px)',
          pointerEvents: 'none'
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
        <span>ZONE AVANCÉE • CITÉ FRANÇAISE DES ANNÉES 2000</span>
      </div>

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
          {/* Main City Map Image */}
          <img 
            ref={mapImageRef}
            src={mapImage2} 
            alt="Carte de la métropole française des années 2000"
            className="village-map-image city-map-image"
            draggable={false}
          />

          {/* Render 20 Interactive City Hotspots */}
          {villagers.map((v) => (
            <div
              key={v.id}
              className="map-hotspot-pin pin-city-hotspot"
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
              <div className="pin-pulse-ring" style={{ borderColor: 'rgba(56, 189, 248, 0.6)' }} />
              <div 
                className="pin-icon-badge"
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  borderColor: '#7dd3fc',
                  color: '#ffffff'
                }}
              >
                {renderCityIcon(v.iconName, 14)}
              </div>

              {/* Hotspot Label & Live People Badge */}
              <div className="pin-title-label" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
                <span className="pin-name">{v.name}</span>
                <span className="pin-occupants" style={{ color: '#38bdf8' }}>
                  <Users size={10} /> {v.activeOccupantsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hovered Location Quick Tooltip Card */}
      {hoveredVillager && (
        <div className="hover-tooltip-card hover-tooltip-city">
          {hoveredVillager.bgImage && (
            <div className="tooltip-img-wrapper">
              <img 
                src={hoveredVillager.bgImage} 
                alt={hoveredVillager.name} 
                className="tooltip-bg-preview"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="tooltip-header">
            <img src={hoveredVillager.avatar} alt={hoveredVillager.characterName} className="tooltip-avatar" />
            <div>
              <div className="tooltip-french" style={{ color: '#38bdf8' }}>{hoveredVillager.frenchTitle}</div>
              <div className="tooltip-title">{hoveredVillager.name}</div>
            </div>
          </div>
          <div className="tooltip-structure">
            <strong>Lieu :</strong> {hoveredVillager.structureName}
          </div>
          <div className="tooltip-occupants">
            <Users size={14} /> <span>{hoveredVillager.activeOccupantsCount} citadins discutent actuellement</span>
          </div>
          <div className="tooltip-action" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}>
            <MessageSquare size={14} /> Entrer dans le lieu et converser
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewer2;
