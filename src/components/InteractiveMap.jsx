import React from 'react';
import './InteractiveMap.css';
import { MapPin } from 'lucide-react';

const InteractiveMap = () => {
  return (
    <section className="map-section">
      <div className="section-header">
        <h2 className="section-title">Global <span className="gradient-text">Campus</span></h2>
        <p className="section-subtitle">Connect with learners and mentors worldwide.</p>
      </div>
      
      <div className="map-container glass-card">
        {/* Placeholder for an actual interactive map like Mapbox or Leaflet */}
        <div className="map-placeholder">
           <div className="map-glow"></div>
           
           <div className="map-pin p1">
             <MapPin size={24} className="pin-icon" />
             <div className="pin-pulse"></div>
             <div className="pin-tooltip glass-card">Bali, Indonesia <br/> <small>120 Active Nomads</small></div>
           </div>
           
           <div className="map-pin p2">
             <MapPin size={24} className="pin-icon" />
             <div className="pin-pulse"></div>
             <div className="pin-tooltip glass-card">Lisbon, Portugal <br/> <small>85 Active Nomads</small></div>
           </div>
           
           <div className="map-pin p3">
             <MapPin size={24} className="pin-icon" />
             <div className="pin-pulse"></div>
             <div className="pin-tooltip glass-card">Medellin, Colombia <br/> <small>200 Active Nomads</small></div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
