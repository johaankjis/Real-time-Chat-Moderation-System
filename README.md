# Real-time Chat Moderation System

A modern, AI-powered real-time chat moderation system built with Next.js that automatically detects and flags toxic content using advanced NLP models. The system provides comprehensive analytics, live monitoring, and automated content moderation capabilities.

## ✨ Features

### 🛡️ Real-Time Toxicity Detection
- **AI-Powered Analysis**: Leverages GPT-4o-mini for accurate toxicity detection
- **Instant Moderation**: Analyzes every message in real-time as it's sent
- **Multi-Category Detection**: Identifies harassment, hate speech, profanity, sexual content, violence, and spam
- **Severity Levels**: Classifies content from low to critical severity
- **Confidence Scoring**: Provides toxicity scores from 0 (safe) to 1 (highly toxic)

### 📊 Analytics Dashboard
- **Comprehensive Metrics**: Track total messages, flagged content, and moderation rates
- **Toxicity Distribution**: Visual breakdown of safe, moderate, toxic, and severe content
- **User Analytics**: Monitor top flagged users and average toxicity scores
- **Hourly Activity**: Track message volume and toxicity patterns by hour
- **Response Time Metrics**: Measure time from flag to moderation action
- **Trend Analysis**: View message volume and moderation trends over time

### 💬 Live Chat Interface
- **Real-Time Messaging**: Instant message delivery and updates
- **Visual Flags**: Clearly marked flagged messages
- **User-Friendly**: Clean, modern interface with dark theme
- **Auto-Refresh**: Live message feed with automatic updates
- **Username Management**: Simple username-based chat system

### 📈 Monitoring & Reporting
- **Live Message Feed**: Real-time view of all incoming messages
- **Flagged Content Dashboard**: Quick access to all flagged messages
- **Moderation Actions Log**: Track all moderation decisions
- **Performance Metrics**: Monitor system performance and response times
- **Data Visualization**: Interactive charts powered by Recharts

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Font**: [Geist](https://vercel.com/font)

### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **AI/ML**: [Vercel AI SDK](https://sdk.vercel.ai/) with OpenAI GPT-4o-mini
- **Real-Time**: Custom WebSocket client implementation
- **Validation**: [Zod](https://zod.dev/)

### Development
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Linting**: ESLint with Next.js config
- **Code Quality**: TypeScript strict mode

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **pnpm** 8.x or higher (or npm/yarn)
- **PostgreSQL** database (or Neon account)
- **OpenAI API Key** (for toxicity detection)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/johaankjis/Real-time-Chat-Moderation-System.git
cd Real-time-Chat-Moderation-System
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host/database"

# OpenAI API Key for AI-powered toxicity detection
OPENAI_API_KEY="your-openai-api-key-here"

# Optional: Custom model configuration
# AI_MODEL="openai/gpt-4o-mini"
```

#### Getting Your API Keys:

- **Neon Database**: Sign up at [neon.tech](https://neon.tech/) and create a new project
- **OpenAI API Key**: Get your key from [platform.openai.com](https://platform.openai.com/api-keys)

### 4. Database Setup

Run the database migration scripts to create the required tables:

```bash
# Connect to your database and run the scripts
psql $DATABASE_URL -f scripts/01-create-tables.sql
psql $DATABASE_URL -f scripts/02-seed-data.sql
```

Alternatively, use your database management tool to execute the SQL files in the `scripts/` directory.

#### Database Schema

The system uses four main tables:

- **users**: Store chat participants and their reputation scores
- **messages**: Store all chat messages with toxicity scores
- **moderation_flags**: Track flagged content with details
- **moderation_actions**: Log all moderation decisions

### 5. Run the Development Server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage

### Accessing the Application

- **Home Page**: `/` - Overview of features and navigation
- **Dashboard**: `/dashboard` - Real-time moderation dashboard
- **Analytics**: `/analytics` - Comprehensive analytics and metrics
- **Chat**: `/chat` - Interactive chat room with moderation

### Using the Chat Interface

1. Navigate to `/chat`
2. Enter a username (stored in local storage)
3. Start sending messages
4. Messages are automatically analyzed for toxicity
5. Flagged messages appear with a "Flagged" badge

### Monitoring Content

1. Visit the **Dashboard** (`/dashboard`) to see:
   - Real-time statistics (total messages, flagged content, moderation rate)
   - Live message feed with auto-refresh
   - Flagged messages requiring review

2. Check **Analytics** (`/analytics`) for:
   - Detailed metrics and trends
   - Toxicity distribution charts
   - User behavior analysis
   - Performance metrics

## 🏗️ Project Structure

```
Real-time-Chat-Moderation-System/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── analytics/           # Analytics endpoints
│   │   │   ├── metrics/         # System metrics
│   │   │   └── overview/        # Overview statistics
│   │   ├── messages/            # Message CRUD operations
│   │   │   ├── flagged/         # Flagged messages
│   │   │   └── route.ts         # Main messages endpoint
│   │   └── moderation/          # Moderation actions
│   ├── analytics/               # Analytics page
│   ├── chat/                    # Chat interface page
│   ├── dashboard/               # Main dashboard page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── analytics-charts.tsx     # Analytics visualizations
│   ├── analytics-metrics.tsx    # Metrics display
│   ├── dashboard-stats.tsx      # Dashboard statistics
│   ├── flagged-messages.tsx     # Flagged content view
│   ├── live-message-feed.tsx    # Real-time message feed
│   └── theme-provider.tsx       # Theme management
├── lib/                         # Utility libraries
│   ├── db.ts                    # Database queries
│   ├── toxicity-detector.ts     # AI toxicity detection
│   ├── utils.ts                 # Utility functions
│   └── websocket-client.ts      # WebSocket client
├── scripts/                     # Database scripts
│   ├── 01-create-tables.sql     # Schema creation
│   └── 02-seed-data.sql         # Sample data
├── public/                      # Static assets
├── styles/                      # Additional styles
└── package.json                 # Dependencies
```

## 🔌 API Endpoints

### Messages

#### `GET /api/messages`
Fetch messages from a channel

**Query Parameters:**
- `channel` (string, optional): Channel name (default: "general")
- `limit` (number, optional): Number of messages to return (default: 50)

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "username": "user123",
      "content": "Hello world",
      "toxicity_score": 0.05,
      "is_flagged": false,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

#### `POST /api/messages`
Send a new message

**Body:**
```json
{
  "username": "user123",
  "content": "Message content",
  "channel": "general"
}
```

### Analytics

#### `GET /api/analytics/metrics`
Get overall system metrics

**Response:**
```json
{
  "total": {
    "messages": 1000,
    "flagged": 50,
    "deleted": 10,
    "users": 100,
    "avgToxicity": 0.15
  },
  "today": {
    "messages": 50,
    "flagged": 5
  },
  "performance": {
    "avgResponseTimeSeconds": 45
  }
}
```

#### `GET /api/analytics/overview`
Get detailed analytics overview

**Query Parameters:**
- `days` (number, optional): Number of days to analyze (default: 7)

**Response:**
- Message volume over time
- Toxicity distribution by category
- Top flagged users
- Moderation actions timeline
- Hourly activity patterns

### Moderation

#### `GET /api/messages/flagged`
Get all flagged messages

**Query Parameters:**
- `status` (string, optional): Filter by status (default: "pending")

#### `DELETE /api/moderation/delete`
Delete a flagged message

**Body:**
```json
{
  "messageId": 123,
  "moderatorId": 1,
  "reason": "Toxic content"
}
```

## 🧪 Toxicity Detection

The system uses a structured AI approach for toxicity detection:

### Scoring System

- **0.0 - 0.3**: Safe content (no action)
- **0.3 - 0.6**: Mildly concerning (monitor)
- **0.6 - 0.8**: Toxic (flagged for review)
- **0.8 - 1.0**: Highly toxic (immediate action)

### Detection Categories

1. **Harassment**: Personal attacks, bullying
2. **Hate Speech**: Discriminatory language
3. **Profanity**: Offensive language
4. **Sexual Content**: Inappropriate sexual content
5. **Violence**: Threats or violent content
6. **Spam**: Repetitive or promotional content

### AI Model

The system uses OpenAI's GPT-4o-mini with structured output generation via the Vercel AI SDK. Each message is analyzed with:

- Toxicity score (0-1)
- Category classification
- Severity assessment (low/medium/high/critical)
- Explanation of flagging reason
- Automatic flagging decision

## 🎨 Customization

### Toxicity Thresholds

Modify thresholds in `lib/toxicity-detector.ts`:

```typescript
// Current guidelines
- Score 0.0-0.3: Safe content
- Score 0.3-0.6: Mildly concerning, monitor
- Score 0.6-0.8: Toxic, should be flagged
- Score 0.8-1.0: Highly toxic, immediate action required
```

### UI Theme

The application uses a dark theme by default. Modify colors in `app/globals.css` and Tailwind configuration.

### Moderation Rules

Customize moderation logic in `app/api/messages/route.ts` to implement custom rules for flagging or auto-moderation.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Build command**: `pnpm build`
- **Start command**: `pnpm start`
- **Node version**: 18.x or higher

## 📊 Performance Considerations

- **Database Indexing**: Optimized indexes for common queries
- **Real-Time Updates**: Auto-refresh intervals configured for balance
- **Async Processing**: Toxicity analysis runs asynchronously
- **Caching**: Consider implementing caching for analytics queries
- **Rate Limiting**: Implement rate limiting for API endpoints in production

## 🔐 Security

- Never commit `.env` files with real credentials
- Use environment variables for all sensitive data
- Implement authentication and authorization for production
- Add rate limiting to prevent abuse
- Validate all user inputs
- Use prepared statements for database queries (protected by Neon client)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and format code consistently
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [OpenAI](https://openai.com/) - AI models

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## 🗺️ Roadmap

Potential future enhancements:

- [ ] WebSocket-based real-time updates
- [ ] Multi-language support for toxicity detection
- [ ] User authentication and roles (admin, moderator, user)
- [ ] Advanced filtering and search capabilities
- [ ] Export analytics data (CSV, PDF)
- [ ] Email notifications for critical flags
- [ ] Machine learning model fine-tuning
- [ ] Mobile-responsive improvements
- [ ] Dark/light theme toggle
- [ ] Message editing and deletion history
- [ ] User reputation system enhancements
- [ ] Automated ban system for repeat offenders
- [ ] Integration with external moderation tools

---

Built with ❤️ using Next.js, AI, and modern web technologies.
