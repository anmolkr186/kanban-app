# Linear-Style Kanban Board

A design-focused ticket management tool with a beautiful Kanban board interface, inspired by Linear's minimal aesthetic and featuring custom pastel column designs.

## Features

### Ticket Management
- ✅ Create tickets with title, description, priority, assignee, and labels
- ✅ Edit tickets with full form validation
- ✅ Delete tickets with confirmation dialog
- ✅ Drag and drop tickets between columns
- ✅ Priority badges (Low, Medium, High, Urgent)
- ✅ Custom labels with color coding

### Kanban Board
- ✅ Custom columns with unique pastel colors
- ✅ Add, rename, reorder, and delete columns
- ✅ Drag to reorder columns
- ✅ Ticket count per column
- ✅ Smooth drag-and-drop interactions
- ✅ Horizontal scrolling for many columns

### Data Persistence
- ✅ Local storage for all data
- ✅ Auto-save on every change
- ✅ Data persists across browser sessions

### Design
- ✅ Linear-inspired minimal aesthetic
- ✅ Figma-inspired pastel column headers
- ✅ White cards with subtle shadows
- ✅ Smooth animations and transitions
- ✅ Custom modal components
- ✅ Responsive design

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component library
- **@dnd-kit** - Drag and drop functionality
- **Zustand** - State management
- **Lucide React** - Icons

## Getting Started

### Installation

```bash
cd kanban-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Usage

### Creating a Ticket
1. Click the "New Ticket" button in the top right
2. Fill in the ticket details (title is required)
3. Select a status/column
4. Choose priority level
5. Add assignee and labels as needed
6. Click "Create Ticket"

### Editing a Ticket
1. Click on any ticket card
2. Edit the fields in the modal
3. Click "Save Changes"

### Deleting a Ticket
1. Click on a ticket to open the edit modal
2. Click the "Delete" button
3. Confirm the deletion

### Managing Columns
1. Click "Manage Columns" in the top navigation
2. Drag columns to reorder them
3. Edit column names and colors inline
4. Add new columns with custom colors
5. Delete columns (with warning if they contain tickets)

### Drag and Drop
- Drag tickets between columns to change their status
- Drag column handles in the Manage Columns modal to reorder

## Project Structure

```
kanban-app/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── kanban/
│   │   ├── Board.tsx     # Main board component
│   │   ├── Column.tsx    # Column component
│   │   └── TicketCard.tsx # Ticket card component
│   ├── modals/
│   │   ├── CreateTicketModal.tsx
│   │   ├── EditTicketModal.tsx
│   │   ├── ManageColumnsModal.tsx
│   │   └── ConfirmDialog.tsx
│   └── ui/               # ShadCN components
├── lib/
│   ├── types.ts          # TypeScript types
│   ├── store.ts          # Zustand store
│   ├── storage.ts        # Local storage utilities
│   └── utils.ts          # Utility functions
└── hooks/
    └── useLocalStorage.ts # Local storage hook
```

## Default Columns

The board comes with 5 default columns:
- **Backlog** - Light blue (#E3E8FF)
- **To Do** - Light pink (#FFE8F5)
- **In Progress** - Light orange (#FFF4E3)
- **In Review** - Light cyan (#E8F5FF)
- **Done** - Light green (#E8FFE8)

You can customize these or add your own!

## Design Philosophy

This project follows a design-focused approach:
- **Minimal UI** - Clean, uncluttered interface inspired by Linear
- **Pastel Colors** - Soft, muted colors for visual hierarchy
- **White Space** - Generous spacing for better readability
- **Smooth Interactions** - Subtle animations and transitions
- **Responsive** - Works on desktop, tablet, and mobile

## Future Enhancements

- User authentication
- Real-time collaboration
- Backend API integration
- Ticket comments and activity log
- Search and filtering
- Keyboard shortcuts
- Dark mode
- Due dates with calendar view

## License

MIT
