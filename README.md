# Property Management Dashboard

A comprehensive property management system for tracking leases, units, maintenance, and financial metrics.

## Features

- 📊 Cash Flow Analysis
- 🏢 Unit Management
- 👥 Occupancy Tracking
- 🔧 Maintenance Management
- 📈 Data Import/Export
- 🔔 Notification System

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v8 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/concobar-ai/cash-flow-app.git
cd cash-flow-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

To create a production build:
```bash
npm run build
```

### Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch.
You can view the live application at: https://concobar-ai.github.io/cash-flow-app

## Development

### Project Structure

```
cash-flow-app/
├── src/
│   ├── components/
│   │   ├── CashFlowAnalysis.jsx
│   │   ├── UnitManagement.jsx
│   │   ├── OccupancyTracking.jsx
│   │   ├── MaintenanceTracker.jsx
│   │   ├── DataTransfer.jsx
│   │   └── NotificationSystem.jsx
│   ├── App.jsx
│   └── index.jsx
├── public/
├── package.json
└── README.md
```

### Technology Stack

- React 18
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons
- Papa Parse for CSV handling
- Lodash for utilities

## License

MIT
