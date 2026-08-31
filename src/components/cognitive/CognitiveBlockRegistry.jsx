"use client";
import React from 'react';
import { SequenceEngine } from './SequenceEngine';
import { CausalSystemGraph } from './CausalSystemGraph';
import { VariableSandbox } from './VariableSandbox';
import { SpatialCanvas } from './SpatialCanvas';
import { ComparativeMatrix } from './ComparativeMatrix';
import { DialecticalBuilder } from './DialecticalBuilder';
import { TaxonomySorter } from './TaxonomySorter';

export function CognitiveBlockRegistry({ block, onEvidence, isPreview = false }) {
  if (!block) return null;

  const archetype = block.archetype || block.type;
  const data = block.data || block.data_json || {};

  switch (archetype) {
    case 'sequence_engine':
    case 'code_stepper':
      return <SequenceEngine data={data} onEvidence={onEvidence} isPreview={isPreview} />;
    
    case 'causal_graph':
    case 'network_flow':
      return <CausalSystemGraph data={data} onEvidence={onEvidence} />;
    
    case 'variable_sandbox':
    case 'terminal':
      return <VariableSandbox data={data} onEvidence={onEvidence} />;
    
    case 'spatial_canvas':
      return <SpatialCanvas data={data} onEvidence={onEvidence} />;
    
    case 'comparative_matrix':
      return <ComparativeMatrix data={data} onEvidence={onEvidence} />;
    
    case 'dialectical_builder':
      return <DialecticalBuilder data={data} onEvidence={onEvidence} />;
    
    case 'taxonomy_sorter':
    case 'quiz':
      return <TaxonomySorter data={data} onEvidence={onEvidence} />;
    
    default:
      return <SequenceEngine data={data} onEvidence={onEvidence} isPreview={isPreview} />;
  }
}
