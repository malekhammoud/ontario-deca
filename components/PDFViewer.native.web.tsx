// This is a stub file for web - it exports empty components to prevent native imports
import React from 'react';
import { View } from 'react-native';

interface NativePDFViewerProps {
  resource: {
    title: string;
    url: string;
  };
  onShare: () => void;
  showControls: boolean;
  onToggleControls: () => void;
}

export const NativePDFViewer: React.FC<NativePDFViewerProps> = () => {
  // Web stub - returns empty view since web uses WebPDFViewer instead
  return <View />;
};
