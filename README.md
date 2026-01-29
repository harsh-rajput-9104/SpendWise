# SpendWise - Personal Finance & Analytics Dashboard

A production-ready, professional expense tracking application built with modern React best practices. Features a premium fintech-grade UI with comprehensive analytics and real-time insights.

![SpendWise Dashboard](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### Core Functionality
- **Complete CRUD Operations**: Create, Read, Update, and Delete transactions with validation
- **Smart Categorization**: 11 predefined categories (Food, Rent, Travel, Shopping, Salary, Investment, Healthcare, Entertainment, Education, Utilities, Others)
- **Dual Transaction Types**: Track both Income and Expense with visual differentiation
- **Persistent Storage**: LocalStorage integration for data persistence across sessions

### Analytics & Insights
- **📊 Pie Chart**: Category-wise expense breakdown with percentages
- **📈 Bar Chart**: Monthly income vs expense comparison (last 6 months)
- **📉 Line Chart**: Daily spending trend for selected month
- **Real-time Stats**: Total Income, Total Expense, and Balance cards with gradient accents

### Advanced Filtering
- **Monthly Filter**: Dropdown with last 12 months
- **Type Filter**: All / Income / Expense
- **Search**: Real-time search by transaction title
- **Smart Reset**: One-click filter reset

### User Experience
- **Glassmorphism UI**: Premium frosted glass effects with backdrop blur
- **Micro-interactions**: Smooth hover effects, scale animations, and transitions
- **Framer Motion**: Layout animations, page transitions, and gesture-based interactions
- **Responsive Design**: Mobile-first approach, works seamlessly on all devices
- **Professional Typography**: Inter for body text, Outfit for headings
- **Custom Color Palette**: Carefully curated fintech-grade colors (no default Tailwind blue)

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with latest features (Concurrent Rendering, Automatic Batching) |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS with custom theme |
| **React Router v6** | Client-side routing with nested routes |
| **Chart.js** | Professional chart library |
| **react-chartjs-2** | React wrapper for Chart.js |
| **Framer Motion** | Production-ready animation library |
| **Context API** | Global state management with useReducer |
| **UUID** | Unique ID generation for transactions |

## 📁 Project Structure

```
SpendWise/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation with animated route indicator
│   │   ├── StatCard.jsx            # Reusable stat display component
│   │   ├── TransactionCard.jsx     # Transaction item with edit/delete
│   │   ├── TransactionModal.jsx    # Add/Edit transaction modal
│   │   └── Filters.jsx             # Filter controls component
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main dashboard with stats & transactions
│   │   ├── AddTransaction.jsx      # Dedicated add transaction page
│   │   └── Analytics.jsx           # Charts and visualizations
│   ├── context/
│   │   └── TransactionContext.jsx  # Global state with reducer pattern
│   ├── utils/
│   │   └── helpers.js              # Utility functions & constants
│   ├── App.jsx                     # Root component with routing
│   ├── main.jsx                    # React 18 entry point
│   └── index.css                   # Global styles & Tailwind config
├── tailwind.config.js              # Custom Tailwind theme
├── postcss.config.js               # PostCSS configuration
├── vite.config.js                  # Vite configuration
└── package.json                    # Dependencies & scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd SpendWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## 📸 Screenshots

### Dashboard
- Real-time financial overview with Income, Expense, and Balance cards
- Category breakdown with animated progress bars
- Recent transactions with inline edit/delete
- Advanced filtering and search

### Add Transaction
- Clean, focused form interface
- Visual type selector (Income/Expense)
- Category dropdown with validation
- Date picker with default to today

### Analytics
- Interactive Pie Chart for expense categories
- Bar Chart comparing monthly income vs expense
- Line Chart showing daily spending patterns
- Responsive chart containers with tooltips

## 🎨 Design Philosophy

- **No Tutorial Look**: Professional SaaS-grade UI, not a basic demo
- **Fintech Aesthetic**: Inspired by Splitwise, CRED, and Groww
- **Glassmorphism**: Soft, translucent cards with backdrop blur
- **Gradient Accents**: Subtle gradients for depth and premium feel
- **Micro-animations**: Hover effects, transitions, and layout animations
- **Consistent Spacing**: 4px/8px grid system for visual harmony
- **Typography Hierarchy**: Clear distinction between headings and body text

## 🔧 Code Quality

- **Clean Architecture**: Separation of concerns (components, pages, context, utils)
- **Reusable Components**: DRY principle with prop-based customization
- **Memoized Calculations**: Optimized performance with useMemo patterns
- **Error Handling**: Comprehensive validation with user-friendly error messages
- **Type Safety**: PropTypes or TypeScript ready structure
- **No Dead Code**: Production-ready, no commented-out blocks
- **Meaningful Names**: Self-documenting variable and function names

## 📊 Data Model

### Transaction Object
```javascript
{
  id: "uuid-v4",
  title: "Grocery Shopping",
  amount: 2500,
  type: "expense", // or "income"
  category: "Food",
  date: "2026-01-28"
}
```

### Categories
Food, Rent, Travel, Shopping, Salary, Investment, Healthcare, Entertainment, Education, Utilities, Others

## 🎯 Resume Bullet Points

Use these for your resume or portfolio:

- **Built a production-grade expense tracker** with React 18, Vite, and Tailwind CSS, featuring complete CRUD operations, advanced filtering, and real-time analytics
- **Implemented Context API with useReducer** for global state management, achieving 100% data persistence with localStorage and optimized re-renders
- **Integrated Chart.js visualizations** including Pie, Bar, and Line charts with custom tooltips, responsive design, and smooth animations using Framer Motion
- **Designed a premium fintech UI** with glassmorphism, custom color palette, micro-interactions, and mobile-first responsive layout following modern SaaS design patterns
- **Architected a scalable React application** with clean separation of concerns, reusable components, utility functions, and comprehensive form validation

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

## 📝 License

MIT License - Feel free to use this project for your portfolio or learning.

## 👨‍💻 Author

Built with ❤️ as a production-ready React showcase project.

---

**Note**: This is a frontend-only application using localStorage. For production use with multiple users, integrate a backend API (Node.js/Express, Firebase, Supabase, etc.).
