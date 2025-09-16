# Sillage - Perfume Social Ranking App

A Beli-style social ranking app for perfumes built with Next.js 14, TypeScript, and modern web technologies.

## 🌟 Features

### Core Functionality
- **Social Feed**: See what your friends are discovering and ranking
- **Perfume Lists**: Organize perfumes into Tried, Wishlist, and Collection with drag-and-drop ranking
- **Ranking System**: Rate perfumes on enjoyment and performance (0-100 scale)
- **Search & Discovery**: Find perfumes by name, brand, notes with advanced filtering
- **User Profiles**: View stats, rankings, and activity with leaderboards

### Technical Features
- **Authentication**: NextAuth.js with GitHub and Google providers
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui with Tailwind CSS
- **Drag & Drop**: @dnd-kit for list reordering
- **State Management**: Zustand and React Query
- **Type Safety**: Full TypeScript support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sillage
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   pnpm prisma generate
   pnpm db:push
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 App Structure

### Pages
- **Feed** (`/feed`) - Social feed with friend activities
- **Discover** (`/discover`) - Trending perfumes and editorial lists
- **Lists** (`/lists`) - Personal perfume lists with drag-and-drop ranking
- **Search** (`/search`) - Search and filter perfumes
- **Profile** (`/u/[handle]`) - User profiles and stats (uses actual usernames)

### Key Components
- `PerfumeCard` - Display perfume information
- `RankingCard` - Show perfume rankings with scores
- `RankingForm` - Create/edit perfume rankings
- `ListRankDnD` - Drag-and-drop list reordering
- `MainNav` - Navigation with authentication

## 🗄️ Database Schema

The app uses a comprehensive Prisma schema with the following main models:

- **User** - User profiles and authentication
- **Perfume** - Perfume information and metadata
- **Brand** - Perfume brands
- **Note** - Fragrance notes (top, heart, base)
- **List** - User-created perfume lists
- **Ranking** - User ratings and reviews
- **Follow** - User relationships
- **Comment** - Social interactions

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Theme switching support
- **Loading States** - Skeleton loaders and loading indicators
- **Empty States** - Helpful messages when no data is available
- **Error Handling** - Graceful error boundaries and user feedback
- **Accessibility** - WCAG compliant components

## 🔧 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm prisma:generate  # Generate Prisma client
pnpm db:push      # Push schema changes to database
pnpm db:seed      # Seed database with sample data
```

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: PostgreSQL + Prisma
- **Authentication**: NextAuth.js
- **State Management**: Zustand + React Query
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📈 Future Enhancements

- **Real-time Features**: Live updates and notifications
- **Mobile App**: React Native or Expo wrapper
- **Advanced Recommendations**: ML-based perfume suggestions
- **Social Features**: Comments, reactions, and sharing
- **Analytics**: User behavior and perfume trends
- **Import/Export**: CSV data import and list sharing
- **API**: Public API for third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Beli's social ranking approach
- Built with modern web technologies and best practices
- UI components from shadcn/ui and Radix UI
- Icons from Lucide React

---

**Sillage** - Discover, rank, and share your favorite perfumes with friends! 🌸