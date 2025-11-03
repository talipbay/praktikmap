'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ZoneCanvas, ZoneCanvasRef } from '@/components/ZoneCanvas';
import { ZoneManagementPanel } from '@/components/ZoneManagementPanel';
import { ZoneContextMenu } from '@/components/ZoneContextMenu';
import { CompanyNameDialog } from '@/components/CompanyNameDialog';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner, CanvasLoading } from '@/components/LoadingSpinner';
import { BrowserCompatibility } from '@/components/BrowserCompatibility';
import { useZoneState } from '@/hooks/useZoneState';
import { Point, Zone } from '@/types/zone';
import { config } from '@/lib/config';
import { getFloorPlanUrl } from '@/lib/assets';

/**
 * Map page component - Main admin interface for zone management
 * Accessible at /map route as per requirements 6.1
 */
export default function MapPage() {
  const {
    zones,
    selectedZone,
    setSelectedZone,
    createZone,
    updateZone,
    deleteZone,
    toggleZoneStatus,
    clearAllZones,
    isLoading,
    error
  } = useZoneState();

  // Canvas ref for controlling edit mode
  const canvasRef = useRef<ZoneCanvasRef>(null);

  // Edit mode state
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    zone: Zone;
    position: Point;
  } | null>(null);

  // Company name dialog state (shared between sidebar and context menu)
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [companyDialogZone, setCompanyDialogZone] = useState<Zone | null>(null);

  // Loading states
  const [isInitializing, setIsInitializing] = useState(true);
  const [floorPlanError, setFloorPlanError] = useState<string | null>(null);

  // Floor plan configuration
  const floorPlanUrl = getFloorPlanUrl();
  
  // Responsive canvas dimensions (default for 1920x1080 aspect ratio)
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 1200,
    height: 675 // 1200 * (1080/1920) = 675
  });
  
  // Mobile/tablet detection
  const [isMobile, setIsMobile] = useState(false);
  
  // Performance monitoring (development only)
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  
  // Calculate responsive canvas size for 1920x1080 image
  useEffect(() => {
    const updateCanvasSize = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      
      // Original image aspect ratio: 1920/1080 = 16:9
      const aspectRatio = 1920 / 1080;
      
      if (isMobileDevice) {
        // Mobile: fit to screen width with proper aspect ratio
        const maxWidth = Math.min(window.innerWidth - 32, 800); // 16px padding on each side
        setCanvasDimensions({
          width: maxWidth,
          height: maxWidth / aspectRatio
        });
      } else if (window.innerWidth < 1400) {
        // Tablet/small desktop: scale down proportionally
        const maxWidth = Math.min(window.innerWidth - 400, 1200); // Leave space for management panel
        setCanvasDimensions({
          width: maxWidth,
          height: maxWidth / aspectRatio
        });
      } else {
        // Large desktop: fit to available container space with proper padding
        const sidebarWidth = 384; // w-96 = 384px
        const headerHeight = 80; // Header height
        const canvasHeaderHeight = 80; // Canvas overlay header
        const padding = 48; // Total padding (24px on each side)
        
        const availableWidth = window.innerWidth - sidebarWidth - padding;
        const availableHeight = window.innerHeight - headerHeight - canvasHeaderHeight - padding;
        
        // Always scale to fit container while maintaining aspect ratio
        const scaleX = availableWidth / 1920;
        const scaleY = availableHeight / 1080;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond original size
        
        setCanvasDimensions({
          width: Math.floor(1920 * scale),
          height: Math.floor(1080 * scale)
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Initialize the page
  useEffect(() => {
    const initializePage = async () => {
      try {
        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if floor plan image exists
        const img = new Image();
        img.onload = () => {
          setFloorPlanError(null);
          setIsInitializing(false);
        };
        img.onerror = () => {
          setFloorPlanError('Floor plan image not found. Please ensure the image is available.');
          setIsInitializing(false);
        };
        img.src = floorPlanUrl;
      } catch (err) {
        console.error('Error initializing page:', err);
        setIsInitializing(false);
      }
    };

    initializePage();
  }, [floorPlanUrl]);

  /**
   * Handle zone creation from canvas
   */
  const handleZoneCreate = useCallback((vertices: Point[]) => {
    createZone(vertices);
  }, [createZone]);

  /**
   * Handle zone click - select zone and toggle status
   */
  const handleZoneClick = useCallback((zone: Zone) => {
    setSelectedZone(zone);
  }, [setSelectedZone]);

  /**
   * Handle zone right-click - show context menu
   */
  const handleZoneRightClick = useCallback((zone: Zone, point: Point) => {
    setSelectedZone(zone);
    setContextMenu({ zone, position: point });
  }, [setSelectedZone]);

  /**
   * Handle canvas click (not on zone)
   */
  const handleCanvasClick = useCallback((point: Point) => {
    // Hide context menu if clicking elsewhere
    if (contextMenu) {
      setContextMenu(null);
    }
  }, [contextMenu]);

  /**
   * Handle zone selection from management panel
   */
  const handleZoneSelect = useCallback((zone: Zone) => {
    setSelectedZone(zone);
  }, [setSelectedZone]);

  /**
   * Handle company name update
   */
  const handleCompanyNameUpdate = useCallback((zoneId: string, companyName: string) => {
    updateZone(zoneId, { 
      companyName,
      status: 'occupied' as const
    });
  }, [updateZone]);

  /**
   * Handle zone update during editing
   */
  const handleZoneUpdate = useCallback((zoneId: string, updates: { vertices: Point[] }) => {
    updateZone(zoneId, updates);
  }, [updateZone]);

  /**
   * Handle zone edit request - toggle edit mode
   */
  const handleZoneEdit = useCallback((zone: Zone) => {
    setSelectedZone(zone);
    // Toggle edit mode
    setIsEditModeEnabled(!isEditModeEnabled);
    
    // If enabling edit mode, start editing the zone
    if (!isEditModeEnabled && canvasRef.current) {
      canvasRef.current.startEditingZone(zone.id);
    } else if (isEditModeEnabled && canvasRef.current) {
      // If disabling edit mode, cancel editing
      canvasRef.current.cancelZoneEditing();
    }
  }, [setSelectedZone, isEditModeEnabled]);

  /**
   * Handle zone deletion
   */
  const handleZoneDelete = useCallback((zone: Zone) => {
    deleteZone(zone.id);
    setSelectedZone(null);
    setContextMenu(null);
  }, [deleteZone, setSelectedZone]);

  /**
   * Handle zone status toggle
   */
  const handleZoneStatusToggle = useCallback((zoneId: string, companyName?: string) => {
    toggleZoneStatus(zoneId, companyName);
  }, [toggleZoneStatus]);

  /**
   * Handle context menu close
   */
  const handleContextMenuClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  /**
   * Handle company name dialog submission
   */
  const handleCompanyNameSubmit = useCallback(async (companyName: string) => {
    if (!companyDialogZone) return;

    try {
      await handleCompanyNameUpdate(companyDialogZone.id, companyName);
      setShowCompanyDialog(false);
      setCompanyDialogZone(null);
    } catch (error) {
      console.error('Error updating company name:', error);
    }
  }, [companyDialogZone, handleCompanyNameUpdate]);

  /**
   * Handle company name dialog close
   */
  const handleCompanyDialogClose = useCallback(() => {
    setShowCompanyDialog(false);
    setCompanyDialogZone(null);
  }, []);

  /**
   * Shared handler for zone status toggle (used by both sidebar and context menu)
   */
  const handleSharedStatusToggle = useCallback((zone: Zone) => {
    // Always select the zone first
    setSelectedZone(zone);
    
    if (zone.status === 'free') {
      // For free zones, show company name dialog
      setCompanyDialogZone(zone);
      setShowCompanyDialog(true);
    } else {
      // For occupied zones, just toggle to free
      handleZoneStatusToggle(zone.id);
    }
  }, [handleZoneStatusToggle, setSelectedZone]);

  /**
   * Handle zones import
   */
  const handleZonesImport = useCallback((importedZones: Zone[]) => {
    // Clear existing zones and import new ones
    clearAllZones().then(() => {
      importedZones.forEach(zone => {
        createZone(zone.vertices, zone.companyName || undefined);
      });
    });
  }, [clearAllZones, createZone]);

  /**
   * Handle zones clear
   */
  const handleZonesClear = useCallback(() => {
    clearAllZones();
    setSelectedZone(null);
  }, [clearAllZones, setSelectedZone]);

  /**
   * Handle zones restore
   */
  const handleZonesRestore = useCallback((restoredZones: Zone[]) => {
    // Clear existing zones and restore from backup
    clearAllZones().then(() => {
      restoredZones.forEach(zone => {
        createZone(zone.vertices, zone.companyName || undefined);
      });
    });
  }, [clearAllZones, createZone]);

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <BrowserCompatibility>
        <LoadingSpinner 
          fullscreen 
          message="Инициализация управления зонами..." 
          size="lg" 
        />
      </BrowserCompatibility>
    );
  }

  // Show error state if there's a critical error
  if (error) {
    return (
      <BrowserCompatibility>
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
          <div className="text-center max-w-md">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      </BrowserCompatibility>
    );
  }

  return (
    <BrowserCompatibility>
      <ErrorBoundary>
        <div className="min-h-screen bg-white">
          {/* Modern Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm" role="banner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Praktik Coworking</h1>
                  <p className="text-sm text-gray-600">Управление зонами</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Status indicator */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Система активна</span>
                  </div>
                </div>

                {/* Performance Monitor Toggle (Development Only) */}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {showPerformanceMonitor ? 'Скрыть' : 'Показать'} производительность
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main content - Modern layout */}
          <main className={`${isMobile ? 'flex flex-col h-auto' : 'flex h-[calc(100vh-80px)]'} bg-white`} role="main">
            {/* Canvas area - Fixed position */}
            <div className={`${isMobile ? 'w-full h-96' : 'flex-1'} relative overflow-hidden canvas-area no-scroll`}>
              {/* Canvas header */}
              <div className={`absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
                  <div>
                    <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>План этажа</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {config.features.zoneCreation 
                        ? (isMobile ? 'Нажмите на желаемое место чтобы создать метку • Долгое нажатие для опций' : 'Нажмите ЛКМ чтобы создать метку • ПКМ чтобы посмотреть опции')
                        : (isMobile ? 'Нажмите на зону для управления • Долгое нажатие для опций' : 'Нажмите ЛКМ на зону для управления • ПКМ для опций')
                      }
                    </p>
                  </div>
                  <div className={`flex items-center ${isMobile ? 'justify-between' : 'gap-4'}`}>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {zones.length} зон • {zones.filter(z => z.status === 'occupied').length} занято
                    </div>
                    {/* Quick actions */}
                    {process.env.NODE_ENV === 'development' && zones.length === 0 && !isEditModeEnabled && config.features.zoneCreation && (
                      <button
                        onClick={() => {
                          // Test vertices in original image coordinates (1920x1080)
                          const testVertices = [
                            { x: 400, y: 300 },
                            { x: 800, y: 300 },
                            { x: 800, y: 600 },
                            { x: 400, y: 600 }
                          ];
                          createZone(testVertices, "Test Company");
                        }}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Создать тестовую зону
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Canvas container */}
              <div className={`absolute inset-0 ${isMobile ? 'pt-16 p-4' : 'pt-20 p-6'} flex items-center justify-center bg-white overflow-hidden`}>
                {floorPlanError ? (
                  <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-yellow-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">План этажа недоступен</h3>
                    <p className="text-gray-600">{floorPlanError}</p>
                  </div>
                ) : isLoading ? (
                  <div className="text-center">
                    <CanvasLoading width={canvasDimensions.width} height={canvasDimensions.height} />
                    <p className="text-gray-500 mt-4">Loading floor plan...</p>
                  </div>
                ) : (
                  <ErrorBoundary fallback={
                    <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-200">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Canvas Error</h3>
                      <p className="text-gray-600">Failed to load interactive canvas</p>
                    </div>
                  }>
                    <div 
                      className="overflow-hidden"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        width: canvasDimensions.width,
                        height: canvasDimensions.height
                      }}
                    >
                      <ZoneCanvas
                        ref={canvasRef}
                        floorPlanUrl={floorPlanUrl}
                        zones={zones}
                        selectedZone={selectedZone}
                        onZoneCreate={handleZoneCreate}
                        onZoneClick={handleZoneClick}
                        onZoneRightClick={handleZoneRightClick}
                        onCanvasClick={handleCanvasClick}
                        onZoneUpdate={handleZoneUpdate}
                        onZoneDelete={handleZoneDelete}
                        width={canvasDimensions.width}
                        height={canvasDimensions.height}
                        isEditModeEnabled={isEditModeEnabled}
                      />
                    </div>
                  </ErrorBoundary>
                )}
              </div>
            </div>

            {/* Management sidebar - Fixed height, internal scrolling */}
            <div className={`${isMobile ? 'w-full border-t' : 'w-96 border-l'} bg-white border-gray-200 flex flex-col shadow-xl ${isMobile ? 'h-96' : 'h-full'}`}>

              {/* Content area - No scrolling, managed internally */}
              <div className="flex-1 min-h-0">
                <ErrorBoundary fallback={
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Panel Error</h4>
                    <p className="text-xs text-gray-600">Failed to load management panel</p>
                    <details className="mt-3 text-left">
                      <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">Debug Info</summary>
                      <pre className="text-xs mt-2 bg-gray-100 p-2 rounded text-left overflow-auto">
                        Zones: {zones.length}{'\n'}
                        Selected: {selectedZone?.id || 'none'}{'\n'}
                        Loading: {isLoading ? 'true' : 'false'}{'\n'}
                        Error: {error || 'none'}
                      </pre>
                    </details>
                  </div>
                }>
                  <ZoneManagementPanel
                    zones={zones}
                    selectedZone={selectedZone}
                    onZoneSelect={handleZoneSelect}
                    onCompanyNameUpdate={handleCompanyNameUpdate}
                    onZoneEdit={handleZoneEdit}
                    onZoneDelete={handleZoneDelete}
                    onZoneStatusToggle={handleSharedStatusToggle}
                    onZonesImport={handleZonesImport}
                    onZonesClear={handleZonesClear}
                    onZonesRestore={handleZonesRestore}
                    isEditModeEnabled={isEditModeEnabled}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </main>

          {/* Performance Monitor (Development Only) */}
          {showPerformanceMonitor && process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 z-50 max-w-sm">
              <PerformanceMonitor zones={zones} />
            </div>
          )}

          {/* Zone Context Menu */}
          {contextMenu && (
            <ZoneContextMenu
              zone={contextMenu.zone}
              position={contextMenu.position}
              isVisible={!!contextMenu}
              onClose={handleContextMenuClose}
              onEdit={handleZoneEdit}
              onDelete={handleZoneDelete}
              onToggleStatus={handleSharedStatusToggle}
            />
          )}

          {/* Company Name Dialog - Shared between sidebar and context menu */}
          <CompanyNameDialog
            open={showCompanyDialog}
            onClose={handleCompanyDialogClose}
            zone={companyDialogZone}
            onSubmit={handleCompanyNameSubmit}
            isSubmitting={false}
          />
        </div>
      </ErrorBoundary>
    </BrowserCompatibility>
  );
}