# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mitmi is a dating and friendship app focused on long-term relationships and genuine connections. The app prioritizes getting to know people through shared interests and values before physical appearance.

**Tech Stack:**
- Backend: Node.js + Express
- View Engine: EJS
- Database: MongoDB (Mongoose)
- Authentication: Auth0
- Real-time Chat: Socket.IO
- File Upload: Multer

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Initialize questions in database (run once)
node utils/seedQuestions.js

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

### Environment Configuration
Create a `.env` file with:
- `MONGO_URI`: MongoDB connection string (already configured)
- `SESSION_SECRET`: Secret for session encryption
- `AUTH0_SECRET`: Auth0 secret key
- `AUTH0_BASE_URL`: Base URL (http://localhost:3000 for local)
- `AUTH0_CLIENT_ID`: Auth0 application client ID
- `AUTH0_ISSUER_BASE_URL`: Auth0 tenant URL
- `PORT`: Server port (default 3000)

## Architecture

### Core Flow
1. **Landing Page** → User sees 3-step explanation
2. **Login** → Auth0 authentication
3. **Profile Setup** → User answers 15 questions + sets preferences
4. **Matching** → Algorithm finds compatible users (30%+ compatibility)
5. **Chat** → Users talk without seeing photos
6. **Photo Reveal** → Both must accept to reveal photos (chat pauses)
7. **Photo Match** → Both decide if they like each other's photos
8. **Final Match** → If both like, chat resumes; otherwise, match ends

### Database Models

**User** (`models/User.js`)
- Auth0 integration (auth0Id, email)
- Profile data (age, height, gender, bio)
- Answers to questions (array of {questionId, answer})
- Preferences (gender, age range, height range)
- profileCompleted flag

**Question** (`models/Question.js`)
- 15 pre-defined questions across categories: interests, lifestyle, values, hobbies, preferences
- Multiple choice options
- Weight for matching algorithm

**Match** (`models/Match.js`)
- Links two users
- Compatibility score (0-100)
- Status: chatting → photo_reveal_pending → photo_matching → matched/rejected
- Photo reveal tracking (user1Accepted, user2Accepted, bothAccepted)
- Photo match tracking (user1Liked, user2Liked, bothLiked)

**Message** (`models/Message.js`)
- Chat messages between matched users
- Linked to Match via matchId
- Timestamps and read status

### Routes Structure

**`/` (routes/index.js)**
- Landing page
- Dashboard redirect logic

**`/profile` (routes/profile.js)**
- `/setup`: Display and save profile form
- `/upload-photo`: Handle photo uploads (max 5MB, images only)

**`/matches` (routes/matches.js)**
- `/`: Show potential matches
- `/my-matches`: List active conversations
- `/create`: Create new match
- `/:matchId/request-photo-reveal`: Request photo reveal
- `/:matchId/photo-response`: Respond to photo match

**`/chat` (routes/chat.js)**
- `/:matchId`: Chat interface
- `/:matchId/messages`: Get messages (API)

### Controllers

**profileController.js**: Profile setup, photo upload
**matchController.js**: Matching algorithm, photo reveal logic, photo match responses
**chatController.js**: Message handling, chat display

### Utilities

**utils/matching.js**
- `calculateCompatibility()`: Compares user answers, returns 0-100 score
- `meetsPreferences()`: Checks if user meets another's preferences (age, height, gender)
- `findPotentialMatches()`: Returns compatible users not already matched, sorted by compatibility

**utils/seedQuestions.js**
- Initializes 15 questions in database
- Run once during setup

### Real-time Chat (Socket.IO)

Events handled in `server.js`:
- `join-chat`: User joins match room
- `send-message`: Send message to match
- `typing` / `stop-typing`: Typing indicators
- `new-message`: Broadcast message to room
- `user-typing` / `user-stop-typing`: Show/hide typing indicator

### Frontend JavaScript

**public/js/matches.js**
- Handle "Hacer Match" button clicks
- Create match via API
- Redirect to chat on success

**public/js/chat.js**
- Socket.IO client connection
- Send/receive messages in real-time
- Typing indicators
- Request photo reveal
- Photo match responses (like/dislike)

### Views Structure

**partials/**
- `header.ejs`: Navbar with login/logout
- `footer.ejs`: Simple footer

**pages/**
- `landing.ejs`: Landing page with 3-step explanation
- `profile-setup.ejs`: Form with personal info, preferences, 15 questions
- `matches.ejs`: Grid of potential matches with compatibility scores
- `my-matches.ejs`: List of active conversations
- `chat.ejs`: Chat interface with message history, photo reveal, photo match

### Key Business Logic

**Matching Algorithm** (`utils/matching.js:8-24`)
- Compares answers to same questions
- Calculates percentage of matching answers
- Minimum 30% compatibility required

**Photo Reveal Logic** (`controllers/matchController.js:66-98`)
- Both users must accept to reveal photos
- Chat pauses when status becomes 'photo_matching'
- Photos are shown in chat interface

**Photo Match Logic** (`controllers/matchController.js:100-139`)
- Both users decide independently (like/dislike)
- If both like: match status → 'matched', chat resumes
- If either dislikes: match status → 'rejected', chat ends

**Chat Pause** (`controllers/chatController.js:51-56`)
- Messages blocked when match status is 'photo_matching'
- Prevents chatting during photo decision phase

### Security & Auth

- Auth0 handles authentication
- `middleware/syncUser.js`: Syncs Auth0 user with MongoDB
- `middleware/requireAuth.js`: Protects routes requiring login
- All profile, match, and chat routes require authentication

### File Uploads

- Photos stored in `public/images/uploads/`
- Max 5MB per image
- Formats: jpeg, jpg, png, gif
- Multer handles upload in `routes/profile.js:9-28`

## Important Notes

1. **Auth0 Configuration Required**: Update `.env` with your Auth0 credentials before running
2. **Seed Questions**: Run `node utils/seedQuestions.js` once to populate questions
3. **Photo Directory**: `public/images/uploads/` must exist (already created with .gitkeep)
4. **Minimum Questions**: Users must answer all 15 questions to complete profile
5. **Chat Logic**: Chat automatically pauses during photo matching phase
6. **Match Flow**: chatting → photo_reveal_pending → photo_matching → matched/rejected
7. **Spanish Language**: All UI text is in Spanish

## Future Enhancements

- **Wingman AI**: Not yet implemented - would suggest conversation starters based on shared interests
- **Group Friendships**: Not yet implemented - ability to match with 3 people simultaneously
- **Donation Button**: Not yet implemented - optional support mechanism
- **Enhanced Matching**: Could add machine learning for better compatibility predictions
- **Notifications**: Email/push notifications for new matches and messages
