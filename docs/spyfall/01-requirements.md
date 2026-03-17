# Spyfall - Requirements Document

## Overview

4~12명의 지인이 실시간으로 함께 즐기는 스파이폴 웹 게임.
스파이는 장소를 모른 채 다른 사람들 사이에 숨어야 하고, 시민은 질문을 통해 스파이를 찾아내야 한다.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 15 (App Router) + React 19 |
| Realtime | Supabase Realtime (Broadcast + Presence) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Anonymous / Guest) |
| Monorepo | Turborepo + pnpm workspaces |
| Deploy | Vercel (Multi-Zone) |
| Language | TypeScript |
| State | TBD (Jotai or Zustand) |

## Architecture

Multi-Zone architecture with independent game apps:

| App | Base Path | Port (dev) | Description |
|-----|-----------|-----------|-------------|
| dashboard | `/` | 3000 | Game list, lobby, profiles |
| spyfall | `/games/spyfall` | 3001 | Spyfall game (independent app) |

Dashboard routes to each game via Next.js `rewrites`. Each game app has its own `basePath` and can be deployed/developed independently.

---

## 1. Player Rules

### 1.1 Player Count
- Minimum: **4 players**
- Maximum: **12 players**

### 1.2 Spy Count

| Player Count | Max Spies | Recommended |
|-------------|----------|-------------|
| 4~6 | 1 | 1 |
| 7~9 | 2 | 1 (2 optional) |
| 10~12 | 2 | 2 |

- The host selects spy count within the allowed range
- UI shows recommended spy count based on player count (auto-recommendation badge)

---

## 2. Settings

### 2.1 Moderator Option
- **With Moderator**: A designated player controls turn progression, starts voting, and manages the game flow
- **Without Moderator (Default)**: The system automatically manages:
  - Turn order (random or sequential)
  - Timer countdown
  - Auto-trigger voting when timer expires

### 2.2 Tie-Break Rule
When voting results in a tie, one of the following options applies (configurable by host):

| Option | Description |
|--------|------------|
| **Revote (Tied Only)** | Only the tied candidates are re-voted |
| **Revote (All)** | All players revote from the full candidate list |
| **Spy Wins** | Tie is treated as a failed vote; spy wins |

### 2.3 Timer Settings
- System recommends timer duration based on player count:

| Player Count | Recommended Time |
|-------------|-----------------|
| 4~6 | 6 minutes |
| 7~9 | 7 minutes |
| 10~12 | 8 minutes |

- Host can adjust timer manually (range: 3~15 minutes, 1-minute increments)
- Timer is synchronized across all clients via Supabase Realtime Broadcast

---

## 3. Core Features

### 3.1 Game Flow

```
Room Creation → Join Room → Role Assignment → Discussion Round → Voting → Result
```

#### Detailed Flow:
1. **Room Creation**: Host creates a room, gets a room code
2. **Join Room**: Players join via room code
3. **Game Settings**: Host configures spy count, timer, moderator, tie-break rule
4. **Start Game**: Host starts the game
5. **Role Reveal**: Each player sees their role card privately
   - Spy: Sees "You are the Spy" (no location info)
   - Citizen: Sees location, their assigned role, and the full role list for the location
6. **Discussion Round**: Players take turns asking questions
7. **Voting Phase**: All players simultaneously vote to identify the spy
8. **Spy Guess (Conditional)**: If spy is caught, the spy gets one chance to guess the location
9. **Result**: Display winner and game summary

### 3.2 Voting System
- All players vote simultaneously (secret ballot)
- Each player selects one suspect
- Vote results are revealed after all votes are in (or after vote timer expires)
- **If spy is caught**:
  - Spy gets an opportunity to guess the location
  - If spy guesses correctly → **Spy wins**
  - If spy guesses wrong → **Citizens win**
- **If spy is NOT caught** (wrong person voted out or tie):
  - Depends on tie-break rule setting
  - Wrong vote → **Spy wins**

### 3.3 Card System
- **Location Cards**: Each location has a unique image
- **Role Cards**: Each role within a location has a unique image
- **Non-spy players can see**:
  - The location name and image
  - Full list of roles available at the location
  - Maximum number of players for each role
- **Spy players see**:
  - "You are the Spy" card
  - No location or role information

### 3.4 Timer
- Countdown timer visible to all players
- Synced across all clients via server
- When timer expires:
  - With moderator: Moderator decides next action
  - Without moderator: System auto-transitions to voting phase

### 3.5 Game Records
- Each round result is stored:
  - Room code
  - Round number
  - Location name
  - Spy player(s)
  - Winner (spy or citizen)
  - Timestamp
- Records persist in Supabase database
- Accessible across sessions via authenticated user

---

## 4. Auto-Recommendation System

The UI provides smart recommendations based on player count:

| Feature | Logic |
|---------|-------|
| Spy Count | Badge showing "Recommended: X spies" based on player count |
| Timer Duration | Pre-filled with recommended time, adjustable by host |
| Tie-Break Rule | Default: "Revote (Tied Only)" |

---

## 5. Room Management

### 5.1 Room Code
- 6-character alphanumeric code (uppercase)
- Used for joining rooms
- Displayed prominently for sharing

### 5.2 Host Controls
- Start game
- Configure settings
- Kick players (before game starts)
- End game / Return to lobby

### 5.3 Reconnection
- Players can reconnect using room code + player name
- Game state is preserved in Supabase database
- Supabase Presence detects disconnect/reconnect automatically
- Disconnected players have a grace period before being removed

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Real-time sync latency < 200ms
- Support up to 12 concurrent players per room
- Multiple rooms supported simultaneously

### 6.2 Mobile First
- Responsive design for mobile devices
- Touch-friendly UI for card interactions
- Landscape and portrait support

### 6.3 Accessibility
- Sufficient color contrast
- Screen reader support for game state changes
- Keyboard navigation for voting
