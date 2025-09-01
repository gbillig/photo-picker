# Architecture Documentation

## Overview

Photo Picker is a local desktop application designed to help users efficiently sort through their photo collections, particularly when dealing with multiple similar photos. The application focuses on simplicity, performance, and direct file system access.

## Tech Stack Decision

### Chosen Approach: Local Desktop Web Application

We've selected a **local Node.js server with web-based UI** for the MVP implementation.

**Technology Stack:**
- **Backend**: Node.js + Express.js
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Photo Processing**: Sharp (thumbnails, image optimization)
- **Metadata Extraction**: Exifr (EXIF data reading)
- **Storage**: JSON files (MVP), upgrade to SQLite later
- **File Operations**: Node.js fs module

**Rationale:**
- Minimal complexity for MVP development
- Direct file system access for reading and moving photos
- No build process required for frontend
- Can be easily upgraded to Electron or full web app later
- Leverages existing TypeScript/Node.js setup

## Architecture Principles

1. **Simplicity First**: Focus on core functionality before adding complexity
2. **Progressive Enhancement**: Structure code to allow easy migration to more sophisticated solutions
3. **Separation of Concerns**: Clear boundaries between photo processing, UI, and file management
4. **Performance**: Generate and cache thumbnails, lazy load images
5. **Data Safety**: Never delete files, only move to archive folder

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   Web Browser   │────▶│  Express Server │
│   (localhost)   │◀────│   (Node.js)     │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │                     │
                    │   File System       │
                    │   - Photos          │
                    │   - Thumbnails      │
                    │   - Archive         │
                    │                     │
                    └─────────────────────┘
```

## Directory Structure

```
photo-picker/
├── src/
│   ├── server/
│   │   ├── index.ts                 # Express server entry point
│   │   ├── config/
│   │   │   └── settings.ts          # Configuration management
│   │   ├── routes/
│   │   │   ├── api.ts              # API route definitions
│   │   │   ├── photos.ts           # Photo-specific endpoints
│   │   │   └── static.ts           # Static file serving
│   │   ├── services/
│   │   │   ├── photo-service.ts    # Photo discovery and metadata
│   │   │   ├── thumbnail-service.ts # Thumbnail generation/caching
│   │   │   ├── similarity-service.ts # Photo similarity detection
│   │   │   └── archive-service.ts   # File movement operations
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript type definitions
│   │   └── utils/
│   │       ├── logger.ts           # Logging utility
│   │       └── file-helpers.ts     # File system helpers
│   ├── client/
│   │   ├── index.html              # Main HTML page
│   │   ├── css/
│   │   │   └── styles.css          # Application styles
│   │   ├── js/
│   │   │   ├── app.js              # Main application logic
│   │   │   ├── api.js              # API communication
│   │   │   ├── gallery.js          # Gallery view logic
│   │   │   └── comparison.js       # Comparison view logic
│   │   └── assets/
│   │       └── icons/              # UI icons
│   └── shared/
│       └── types.ts                # Shared TypeScript types
├── data/
│   ├── config.json                 # User configuration
│   └── sessions/                   # Session data (decisions)
├── cache/
│   └── thumbnails/                 # Generated thumbnails
└── tests/
    └── ...                         # Test files
```

## Core Components

### 1. Photo Service
**Responsibility**: Discover and read photos from file system
- Scan directories recursively
- Filter by supported formats (JPEG, PNG, HEIC, RAW)
- Extract basic metadata (size, date, dimensions)
- Generate unique IDs for photos

### 2. Thumbnail Service
**Responsibility**: Generate and manage image thumbnails
- Create multiple sizes (small: 150px, medium: 400px)
- Cache thumbnails for performance
- Serve optimized images to frontend
- Clean up orphaned thumbnails

### 3. Similarity Service
**Responsibility**: Detect and group similar photos
- **Phase 1 (MVP)**: Group by:
  - Capture time (within 5 seconds)
  - Filename patterns (sequential numbers)
  - File size similarity (within 10%)
- **Phase 2**: Add perceptual hashing
- **Phase 3**: Consider ML-based similarity

### 4. Archive Service
**Responsibility**: Manage file operations safely
- Move files to archive directory
- Maintain original directory structure
- Create undo logs
- Verify operations completed successfully

## API Design

### RESTful Endpoints

```typescript
// Photo Management
GET    /api/photos                 // List all photos with pagination
GET    /api/photos/:id             // Get single photo details
GET    /api/photos/:id/thumbnail   // Get photo thumbnail
GET    /api/photos/:id/original    // Get original photo

// Similarity Groups
GET    /api/groups                 // Get similarity groups
GET    /api/groups/:id             // Get specific group

// Decision Management
POST   /api/decisions              // Record keep/archive decision
GET    /api/decisions/pending      // Get pending decisions
DELETE /api/decisions/:id          // Undo a decision

// Actions
POST   /api/archive/execute        // Execute archive operation
POST   /api/archive/undo           // Undo last archive operation

// System
GET    /api/stats                  // Get system statistics
GET    /api/config                 // Get configuration
PUT    /api/config                 // Update configuration
```

### Data Models

```typescript
interface Photo {
  id: string;
  path: string;
  filename: string;
  size: number;
  dimensions: { width: number; height: number };
  dateTaken: Date | null;
  exif: ExifData | null;
  thumbnails: {
    small: string;
    medium: string;
  };
  hash?: string;  // For similarity detection
}

interface SimilarityGroup {
  id: string;
  photos: Photo[];
  reason: 'timestamp' | 'filename' | 'content';
  confidence: number;
}

interface Decision {
  id: string;
  photoId: string;
  action: 'keep' | 'archive';
  timestamp: Date;
  executed: boolean;
  groupId?: string;  // If part of similarity group
}
```

## Frontend Architecture

### Views

1. **Gallery View**: Grid display of all photos
   - Infinite scroll or pagination
   - Quick preview on hover
   - Batch selection
   - Filter and sort options

2. **Comparison View**: Side-by-side photo comparison
   - 2-4 photos simultaneously
   - Synchronized zoom/pan
   - EXIF data comparison table
   - Quick decision buttons

3. **Review View**: Review pending decisions
   - List of decisions before execution
   - Ability to modify decisions
   - Undo recent operations

### User Interactions

```
Keyboard Shortcuts:
- Arrow Keys: Navigate photos
- Enter: Open comparison view
- 1-4: Mark photo to keep (in comparison)
- D: Mark for archive
- Space: Toggle selection
- Ctrl+Z: Undo last action
- Ctrl+Enter: Execute pending archives
```

## Implementation Phases

### Phase 1: MVP (Week 1-2)
- [x] Project setup with TypeScript
- [ ] Basic Express server
- [ ] Photo discovery service
- [ ] Thumbnail generation
- [ ] Simple web UI with gallery view
- [ ] Basic comparison view (2 photos)
- [ ] Keep/archive decision recording

### Phase 2: Core Features (Week 3-4)
- [ ] Similar photo detection (basic)
- [ ] Archive execution with undo
- [ ] Improved comparison view (4 photos)
- [ ] EXIF data display
- [ ] Session management
- [ ] Configuration UI

### Phase 3: Enhancements (Week 5-6)
- [ ] Advanced similarity detection
- [ ] Batch operations
- [ ] Statistics dashboard
- [ ] Export decisions log
- [ ] Keyboard navigation
- [ ] Performance optimizations

### Phase 4: Future Considerations
- [ ] Electron wrapper for native app
- [ ] Cloud backup integration
- [ ] Machine learning similarity
- [ ] Face detection/grouping
- [ ] RAW file support
- [ ] Video support

## Performance Considerations

1. **Thumbnail Caching**: Generate once, reuse multiple times
2. **Lazy Loading**: Load images as needed in the viewport
3. **Pagination**: Handle large photo collections efficiently
4. **Worker Threads**: Use for CPU-intensive operations (hashing, similarity)
5. **Database Indexing**: When migrating from JSON to SQLite

## Security Considerations

1. **Local Only**: No network access by default
2. **Read-Only by Default**: Explicit user action required for file modifications
3. **Backup First**: Option to backup before archive operations
4. **Audit Log**: Track all file operations
5. **Sandboxing**: Restrict file access to configured directories

## Testing Strategy

1. **Unit Tests**: Services and utilities
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Critical user workflows
4. **Manual Testing**: UI interactions and file operations

## Migration Path

The architecture is designed to support future migrations:

1. **To Electron**: Wrap existing code, add native menus
2. **To Web App**: Add authentication, cloud storage
3. **To Mobile**: Progressive Web App with responsive design
4. **Database**: JSON → SQLite → PostgreSQL

## Configuration

```typescript
interface Config {
  server: {
    port: number;
    host: string;
  };
  photos: {
    directories: string[];
    extensions: string[];
    excludePatterns: string[];
  };
  thumbnails: {
    sizes: { small: number; medium: number };
    quality: number;
    cacheDir: string;
  };
  archive: {
    directory: string;
    maintainStructure: boolean;
    createBackup: boolean;
  };
  similarity: {
    timeThreshold: number;  // seconds
    sizeThreshold: number;  // percentage
  };
}
```

## Development Workflow

1. **Development Mode**: `pnpm run dev` - Hot reload for both server and client
2. **Testing**: `pnpm test` - Run test suite
3. **Build**: `pnpm run build` - Compile TypeScript
4. **Start**: `pnpm start` - Run production server

## Monitoring and Logging

- Console logging for development
- File-based logging for production
- Performance metrics for optimization
- Error tracking for debugging

## Success Metrics

1. **Performance**: Process 1000 photos in < 10 seconds
2. **Accuracy**: 95% similarity detection accuracy
3. **Usability**: Complete photo review 50% faster than manual
4. **Reliability**: Zero data loss, always recoverable

---

*This document is a living guide and will be updated as the project evolves.*