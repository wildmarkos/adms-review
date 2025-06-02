# Eduscore Feedback System

A professional Next.js-based admissions feedback system designed to identify and resolve pain points in Eduscore CRM workflows, boosting team productivity and enrollment success.

## 🚀 Features

### Core Functionality
- **Role-Specific Surveys**: Tailored questionnaires for managers (18 strategic questions) and sales representatives (21 tactical questions)
- **Evidence-Based Analysis**: Utilizes proven methodologies including Kirkpatrick Model, NPS, and Root Cause Analysis
- **Real-Time Validation**: Custom form validation with business logic enforcement
- **Progress Tracking**: Auto-save functionality and progress indicators
- **Comprehensive Analytics**: Interactive dashboard with actionable insights and ROI projections

### Technical Highlights
- **Modern Tech Stack**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Professional UI**: Shadcn/ui components for clean, modern design
- **Local Database**: SQLite with better-sqlite3 for data sovereignty
- **State Management**: Zustand for efficient survey progress tracking
- **Data Visualization**: Recharts for comprehensive analytics charts
- **Responsive Design**: Mobile-friendly interface for all screen sizes

## 🛠 Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, Shadcn/ui
- **Database**: SQLite with better-sqlite3 driver
- **Forms**: React Hook Form with custom validation
- **State Management**: Zustand with persistence
- **Charts**: Recharts + D3.js for visualizations
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with professional design system

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd adms-feedback-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize the database:**
   ```bash
   npm run init-db
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### For Survey Participants

1. **Access the Survey**:
   - Visit the application homepage
   - Click "Take Survey" button
   - Select your role (Manager or Sales Representative)

2. **Complete the Survey**:
   - Answer questions in each section
   - Use the progress indicator to track completion
   - Benefit from auto-save functionality
   - Submit when all required questions are answered

3. **Privacy Options**:
   - Choose anonymous mode for sensitive feedback
   - All responses are securely stored locally

### For Administrators

1. **View Analytics**:
   - Access the analytics dashboard at `/analytics`
   - Review key metrics and pain point analysis
   - Explore section-by-section performance scores
   - Generate actionable recommendations

2. **Export Data**:
   - Use the export functionality in the analytics dashboard
   - Download comprehensive reports for further analysis

## 📊 Survey Structure

### Manager Survey (Strategic Level)
- **Section 1**: Strategic Alignment & Goals (5 questions)
- **Section 2**: Team Performance Management (4 questions)
- **Section 3**: Process Efficiency & Workflow (5 questions)
- **Section 4**: Resource Allocation & ROI (4 questions)
- **Estimated Time**: 15 minutes

### Sales Team Survey (Tactical Level)
- **Section 1**: Daily Workflow Efficiency (5 questions)
- **Section 2**: Lead Management & Follow-up (5 questions)
- **Section 3**: Communication & Collaboration (4 questions)
- **Section 4**: Conversion Barriers & Sales Effectiveness (4 questions)
- **Section 5**: Advanced Diagnostic (3 questions)
- **Estimated Time**: 12 minutes

## 🏗 Project Structure

```
adms-feedback-system/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── surveys/       # Survey-related endpoints
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── survey/           # Survey interface and completion
│   │   └── page.tsx          # Homepage
│   ├── components/           # Reusable React components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── SurveyInterface.tsx
│   │   └── QuestionRenderer.tsx
│   └── lib/                 # Utility functions and configurations
│       ├── database.ts      # SQLite database setup
│       ├── questions.ts     # Survey question definitions
│       ├── store.ts         # Zustand state management
│       └── utils.ts         # Helper functions
├── public/                  # Static assets
├── feedback.db             # SQLite database (created on first run)
└── README.md
```

## 🔧 API Endpoints

### Survey Management
- `GET /api/surveys/[id]/questions` - Fetch survey questions
- `POST /api/surveys/submit` - Submit completed survey
- `POST /api/surveys/autosave` - Auto-save progress

### Analytics
- `GET /api/responses` - Fetch survey responses
- `GET /api/analytics` - Fetch computed analytics data

## 📈 Analytics Features

### Key Metrics Dashboard
- Total response count and completion rates
- Average completion time tracking
- Critical issue identification
- System effectiveness scoring

### Pain Point Analysis
- Severity and frequency ranking
- Business impact assessment
- Priority matrix visualization
- Correlation analysis

### Actionable Recommendations
- **Quick Wins** (0-30 days): Immediate improvements
- **Medium Term** (1-3 months): Process optimizations
- **Strategic** (3-12 months): Long-term enhancements

### Data Visualization
- Interactive bar charts and trend analysis
- Time allocation breakdowns
- Performance vs. benchmark comparisons
- Export capabilities for further analysis

## 🔒 Security & Privacy

### Data Protection
- Local SQLite database for data sovereignty
- Anonymous response options available
- No external data transmission required
- Configurable data retention policies

### Validation & Integrity
- Client-side and server-side validation
- Business logic enforcement (percentages sum to 100%, unique rankings)
- Input sanitization and error handling
- Audit trail for all data changes

## 🚀 Deployment Options

### Local Deployment (Recommended)
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Vercel Deployment
1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy with automatic builds

### Docker Deployment
```bash
# Build Docker image
docker build -t adms-feedback-system .

# Run container
docker run -p 3000:3000 adms-feedback-system
```

## 🧪 Testing

### Run the Application Locally
```bash
# Development mode
npm run dev

# Production build test
npm run build && npm start
```

### Sample Data
The application includes seed data for demonstration:
- 6 sample users (2 managers, 4 sales representatives)
- Pre-configured survey questions
- Sample analytics data for dashboard testing

## 📋 Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Ensure write permissions in the project directory
   - Run `npm run init-db` to reinitialize the database

2. **TypeScript Errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check Node.js version (requires 18+)

3. **Port Conflicts**:
   - Change the port in `package.json` if 3000 is occupied
   - Or use `npm run dev -- -p 3001`

### Performance Optimization
- The application includes auto-save every 30 seconds
- Analytics are cached for optimal performance
- Database queries are optimized with proper indexing

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration included
- Prettier for code formatting
- Conventional commit messages preferred

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions, issues, or feature requests:
1. Check the troubleshooting section above
2. Review existing GitHub issues
3. Create a new issue with detailed information
4. Include system information and error messages

## 🎯 Roadmap

### Near-term Enhancements
- [ ] Email notification system for survey completion
- [ ] Advanced filtering in analytics dashboard
- [ ] Bulk data import/export capabilities
- [ ] Multi-language support

### Long-term Goals
- [ ] Integration with external CRM systems
- [ ] Machine learning insights
- [ ] Mobile application development
- [ ] Real-time collaboration features

---

**Built with ❤️ for admissions teams everywhere**

*Last updated: May 30, 2025*