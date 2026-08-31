"use client";
import React, { useState } from 'react';
import { Target, Info } from 'lucide-react';

export function SpatialCanvas({ data = {}, onEvidence }) {
  const pins = data.pins || [
    { id: 'p1', x: 25, y: 35, title: 'Anterior Focus / Inflow Port', desc: 'Primary intake or cranial assessment zone.' },
    { id: 'p2', x: 70, y: 55, title: 'Central Core Node', desc: 'Critical processing or metabolic heart.' },
    { id: 'p3', x: 45, y: 80, title: 'Posterior Exhaust / Outflow', desc: 'Filter boundary or venous return.' }
  ];

  const [selectedPin, setSelectedPin] = useState(pins[0]);
  const [inspectedPins, setInspectedPins] = useState(new Set(['p1']));

  const handleSelect = (pin) => {
    setSelectedPin(pin);
    const updated = new Set(inspectedPins);
    updated.add(pin.id);
    setInspectedPins(updated);

    if (onEvidence && updated.size === pins.length) {
      onEvidence({
        evidenceType: 'RECALL',
        score: 1.0,
        telemetry: { total_pins: pins.length, inspected_all: true }
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#090d16] border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl font-sans text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
          <Target className="w-4 h-4 text-blue-400" />
          <span>Spatial & Anatomical Canvas</span>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {inspectedPins.size} / {pins.length} Hotspots Inspected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative h-64 md:h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {pins.map((pin) => {
            const isSelected = selectedPin.id === pin.id;
            const isInspected = inspectedPins.has(pin.id);
            return (
              <button
                key={pin.id}
                onClick={() => handleSelect(pin)}
                style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-blue-500 text-white border-blue-300 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10'
                    : isInspected
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-current" />
              </button>
            );
          })}
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase mb-2">
              <Info className="w-3.5 h-3.5" />
              <span>Inspection Telemetry</span>
            </div>
            <h4 className="text-base font-bold text-white leading-snug">{selectedPin.title}</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedPin.desc}</p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-500 font-mono">
            Click all target hotspots to complete diagnostic inspection.
          </div>
        </div>
      </div>
    </div>
  );
}
