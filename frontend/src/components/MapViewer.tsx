import React, { useState, useRef } from 'react';
import type { VillagerProfession } from '../types/village';
import mapImage from '../assets/map.png';
import { 
  Crosshair, Users, MessageSquare, MapPin, Anchor, Flame, Cake, 
  Wheat, Wine, Cloud, Shield, Wind, Hammer, Disc, Beer, Scissors, 
  Footprints, Wrench, Box, Circle, Archive, Feather, Utensils
} from 'lucide-react';

interface MapViewerProps {
  villagers: VillagerProfession[];
  onSelectLocation: (villager: VillagerProfession) => void;
  inspectorMode: boolean;
  onToggleInspectorMode: () => void;
}

// Icon helper function for professions
const renderProfessionIcon = (iconName: string, size = 18) => {
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
  onSelectLocation,
  inspectorMode,
  onToggleInspectorMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  // Locked at 200% scale (2.0) as requested
  const FIXED_SCALE = 2;

  // Drag position state
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover state for tooltip pin preview
  const [hoveredVillager, setHoveredVillager] = useState<VillagerProfession | null>(null);

  // Inspector coordinate toast state
  const [lastClickedCoords, setLastClickedCoords] = useState<{ x: number; y: number } | null>(null);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary click
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Map Click handler for Inspector Mode (Coordinates Picker)
  const handleMapClick = (e: React.MouseEvent) => {
    if (!inspectorMode || !mapImageRef.current) return;
    const rect = mapImageRef.current.getBoundingClientRect();
    
    // Calculate click position as percentage of map image width and height
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const xPct = Math.round((clickX / rect.width) * 100);
    const yPct = Math.round((clickY / rect.height) * 100);

    setLastClickedCoords({ x: xPct, y: yPct });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`x: ${xPct}, y: ${yPct}`);
    }
  };

  return (
    <div className="map-viewer-container" ref={containerRef}>
      {/* Floating Toolbar for Inspector */}
      <div className="map-controls-toolbar">
        <button 
          className={`map-btn inspector-btn ${inspectorMode ? 'active' : ''}`}
          onClick={onToggleInspectorMode}
          title="Activer l’inspecteur pour obtenir les coordonnées x et y"
        >
          <Crosshair size={18} />
          <span>{inspectorMode ? 'Inspecteur activé' : 'Inspecter les coordonnées'}</span>
        </button>
      </div>

      {/* Coordinate Toast when Inspector Clicked */}
      {inspectorMode && lastClickedCoords && (
        <div className="inspector-coord-toast">
          <Crosshair size={16} />
          <span>Coordonnées : <strong>x : {lastClickedCoords.x} %, y : {lastClickedCoords.y} %</strong></span>
          <small>(Copiées dans le presse-papiers)</small>
        </div>
      )}

      {/* Interactive Draggable Viewport - Always 200% scale */}
      <div 
        className={`map-viewport ${isDragging ? 'is-dragging' : ''} ${inspectorMode ? 'is-inspecting' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="map-transform-wrapper"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${FIXED_SCALE})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Main Village Map Image */}
          <img 
            ref={mapImageRef}
            src={mapImage} 
            alt="Carte du village français ancien de VillonWood"
            className="village-map-image"
            onClick={handleMapClick}
            draggable={false}
          />

          {/* Render 20 Interactive Villager Structure Pins */}
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
