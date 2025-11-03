# Zone Management Configuration

This document explains how to enable or disable zone editing and deletion functionality using environment variables.

## Current Status
- **Vertex editing is currently DISABLED**
- **Zone deletion is currently DISABLED**
- **Zone creation is currently DISABLED**

## Easy Configuration with Environment Variables

Configuration is now controlled by environment variables in `.env.local`:

```bash
# Enable/disable vertex editing functionality
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=false

# Enable/disable zone deletion functionality  
NEXT_PUBLIC_ENABLE_ZONE_DELETION=false

# Enable/disable zone creation functionality
NEXT_PUBLIC_ENABLE_ZONE_CREATION=false
```

### Quick Setup
1. Copy `.env.example` to `.env.local`
2. Set your preferred values (`true` or `false`)
3. Restart the development server
4. Changes take effect immediately

## Configuration Options

### Vertex Editing (`NEXT_PUBLIC_ENABLE_VERTEX_EDITING`)

**When `false` (disabled):**
- Edit buttons are hidden from management panel and context menu
- Vertex handles are not shown on selected zones
- Users cannot drag vertices to reshape zones
- Edit mode functionality is completely disabled
- 'E' key shortcut for editing is disabled

**When `true` (enabled):**
- Users can click "Редактировать" to enter edit mode
- Vertex handles appear on selected zones
- Users can drag vertices to reshape zones
- Keyboard shortcuts work (E key to edit, Escape to cancel)

### Zone Deletion (`NEXT_PUBLIC_ENABLE_ZONE_DELETION`)

**When `false` (disabled):**
- Delete buttons are hidden from management panel and context menu
- Delete/Backspace keyboard shortcuts are disabled
- Users cannot accidentally delete zones

**When `true` (enabled):**
- Delete buttons appear in management panel and context menu
- Delete/Backspace keys work to delete selected zones
- Confirmation dialog appears before deletion

### Zone Creation (`NEXT_PUBLIC_ENABLE_ZONE_CREATION`)

**When `false` (disabled):**
- Users cannot click on canvas to create new zones
- Zone creation instructions are hidden
- Test zone creation button is hidden (development mode)
- Only existing zones can be managed

**When `true` (enabled):**
- Users can click on empty canvas areas to start creating zones
- Zone creation instructions appear during creation process
- Full polygon drawing functionality available
- Test zone creation available in development mode

## Available Feature Combinations

### 1. **Production Safe** (All disabled)
```bash
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=false
NEXT_PUBLIC_ENABLE_ZONE_DELETION=false
NEXT_PUBLIC_ENABLE_ZONE_CREATION=false
```
- Only status management (occupied/free)
- Safest for production use
- No accidental changes, deletions, or new zones

### 2. **Zone Creation Only** (Creation enabled, others disabled)
```bash
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=false
NEXT_PUBLIC_ENABLE_ZONE_DELETION=false
NEXT_PUBLIC_ENABLE_ZONE_CREATION=true
```
- Allow creating new zones
- Prevent editing or deletion of existing zones
- Good for initial room setup

### 3. **Shape Editing Only** (Vertex enabled, others disabled)
```bash
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true
NEXT_PUBLIC_ENABLE_ZONE_DELETION=false
NEXT_PUBLIC_ENABLE_ZONE_CREATION=false
```
- Allow reshaping existing zones
- Prevent creation or deletion
- Good for fine-tuning existing zones

### 4. **Deletion Only** (Deletion enabled, others disabled)
```bash
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=false
NEXT_PUBLIC_ENABLE_ZONE_DELETION=true
NEXT_PUBLIC_ENABLE_ZONE_CREATION=false
```
- Allow removing zones
- Prevent creation or shape changes
- Good for cleanup operations

### 5. **Full Editing** (All enabled)
```bash
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true
NEXT_PUBLIC_ENABLE_ZONE_DELETION=true
NEXT_PUBLIC_ENABLE_ZONE_CREATION=true
```
- Complete editing capabilities
- Use with caution
- Best for initial setup phase

## What Always Works (Regardless of Settings)

Users can always:
- **Select zones** by clicking on them
- **Change zone status** between "Свободна" (Free) and "Занята" (Occupied)
- **Add company names** when marking zones as occupied
- **View zone information** in the management panel
- **Import/Export data** using the data management features
- **Navigate zones** using arrow keys

## Predefined Zones

The application now loads predefined room zones from `public/zones-cleaned.json` when no zones exist in localStorage. These zones have:
- **Rounded coordinates** for cleaner appearance
- **Optimized shapes** with exact 90-degree angles where appropriate
- **All 44 rooms** from your original export

## How to Change Settings

1. **Edit `.env.local`** (create from `.env.example` if it doesn't exist)
2. **Set values** to `true` or `false` as needed
3. **Restart development server** (`npm run dev`)
4. **Changes take effect immediately**

Example `.env.local`:
```bash
NEXT_PUBLIC_ENABLE_VERTEX_EDITING=true
NEXT_PUBLIC_ENABLE_ZONE_DELETION=false
NEXT_PUBLIC_ENABLE_ZONE_CREATION=false
```

## Notes

- Environment variables are loaded at build time
- Changes require restarting the development server
- Use `.env.local` for local development (ignored by git)
- Use `.env.production` for production deployment
- All functionality is cleanly enabled/disabled with these simple toggles