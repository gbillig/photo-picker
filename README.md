# Photo Picker

A local desktop application to efficiently sort through photo collections and manage similar images.

## Overview

Photo Picker helps you quickly compare similar photos and decide which ones to keep and which to archive. It's designed for photographers and anyone who takes multiple shots of the same scene and needs to efficiently pick the best ones.

## Features

### Current (MVP)
- [x] Browse photos from local directories
- [x] Gallery view with thumbnails
- [x] Full-size photo preview
- [ ] Side-by-side photo comparison
- [ ] Keep/Archive decision tracking

### Planned
- Similar photo detection
- Batch operations
- EXIF data display
- Keyboard shortcuts for quick decisions
- Archive management with undo capability

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: HTML5 + CSS + Vanilla JavaScript
- **Image Processing**: Sharp
- **Build Tools**: Vite, ESBuild
- **Testing**: Vitest

## Development

### Prerequisites

- Node.js 22+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone git@github.com:gbillig/photo-picker.git
cd photo-picker

# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

### Available Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run test         # Run tests
pnpm run lint         # Lint code
pnpm run format       # Format code with Prettier
pnpm run type-check   # Type check with TypeScript
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design and technical documentation.

## Project Structure

```
photo-picker/
├── src/
│   ├── server/       # Express backend
│   ├── client/       # Frontend files
│   └── shared/       # Shared types
├── cache/            # Thumbnail cache
├── data/             # Application data
└── tests/            # Test files
```

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

## Author

gbillig