'use client';

import React from 'react';
import { Zone, ZoneStatus } from '@/types/zone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/**
 * Props for the ZoneList component
 */
export interface ZoneListProps {
  /** Array of zones to display */
  zones: Zone[];
  /** Currently selected zone */
  selectedZone: Zone | null;
  /** Callback when a zone is selected from the list */
  onZoneSelect: (zone: Zone) => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * Zone list component that displays zones in a scrollable list using shadcn/ui Card components
 * Shows zone status badges and company names with zone selection functionality
 */
export function ZoneList({
  zones,
  selectedZone,
  onZoneSelect,
  className
}: ZoneListProps) {
  /**
   * Get badge variant based on zone status
   */
  const getStatusBadgeVariant = (status: ZoneStatus) => {
    switch (status) {
      case 'free':
        return 'secondary';
      case 'occupied':
        return 'default';
      default:
        return 'outline';
    }
  };

  /**
   * Get status display text
   */
  const getStatusText = (status: ZoneStatus) => {
    switch (status) {
      case 'free':
        return 'Свободна';
      case 'occupied':
        return 'Занята';
      default:
        return 'Неизвестно';
    }
  };

  /**
   * Format zone creation date
   */
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Generate zone display name
   */
  const getZoneDisplayName = (zone: Zone, index: number) => {
    return `Зона ${index + 1}`;
  };

  if (zones.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)} role="status">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Зоны еще не созданы</p>
          <p className="text-muted-foreground text-xs mt-1">
            Нажмите на план этажа, чтобы начать создание зон
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <ScrollArea className="h-full">
        <div 
          className="space-y-3 p-4" 
          role="list" 
          aria-label="Zone list"
        >
          {zones.map((zone, index) => {
            const isSelected = selectedZone?.id === zone.id;
            const zoneName = getZoneDisplayName(zone, index);
            
            return (
              <Card
                key={zone.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isSelected && "ring-2 ring-primary ring-offset-2 bg-accent/50"
                )}
                onClick={() => onZoneSelect(zone)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onZoneSelect(zone);
                  }
                }}
                tabIndex={0}
                role="listitem button"
                aria-label={`${zoneName}, ${getStatusText(zone.status)}${zone.companyName ? `, ${zone.companyName}` : ''}`}
                aria-pressed={isSelected}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {getZoneDisplayName(zone, index)}
                    </CardTitle>
                    <Badge 
                      variant={getStatusBadgeVariant(zone.status)}
                      aria-label={`Status: ${getStatusText(zone.status)}`}
                    >
                      {getStatusText(zone.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Company name for occupied zones */}
                  {zone.status === 'occupied' && zone.companyName && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Компания</p>
                      <p className="text-sm font-medium text-foreground">
                        {zone.companyName}
                      </p>
                    </div>
                  )}
                  
                  {/* Zone details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Вершины</span>
                      <span>{zone.vertices.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Создана</span>
                      <span>{formatDate(zone.createdAt)}</span>
                    </div>
                    
                    {zone.updatedAt !== zone.createdAt && (
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Обновлена</span>
                        <span>{formatDate(zone.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}