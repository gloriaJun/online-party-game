# Spyfall - Game Rules

## Game Overview

Spyfall is a social deduction party game where most players are assigned a shared location and a role at that location, while one or two players are spies who don't know the location. Through rounds of questions, citizens try to identify the spy, while the spy tries to figure out the location.

---

## Roles

### Citizen
- Knows the **location** and their assigned **role**
- Can see the full list of roles at the location and maximum headcount per role
- Goal: Identify the spy through strategic questioning

### Spy
- Does **NOT** know the location
- Sees only "You are the Spy" card
- Goal: Avoid detection AND figure out the location
- Gets one chance to guess the location if caught

### Moderator (Optional)
- A designated player who controls the game flow
- Manages turn order, starts voting, resolves disputes
- If no moderator: system handles these automatically

---

## Game Flow

```
┌─────────────────┐
│  Room Creation   │ ← Host creates room, gets code
└────────┬────────┘
         ▼
┌─────────────────┐
│   Join Room      │ ← Players join via room code
└────────┬────────┘
         ▼
┌─────────────────┐
│  Game Settings   │ ← Host configures spy count, timer, rules
└────────┬────────┘
         ▼
┌─────────────────┐
│   Start Game     │ ← Host starts, roles assigned
└────────┬────────┘
         ▼
┌─────────────────┐
│  Role Reveal     │ ← Each player sees their private card
└────────┬────────┘
         ▼
┌─────────────────┐
│  Discussion      │ ← Players ask questions, timer running
│  Round           │
└────────┬────────┘
         ▼
┌─────────────────┐
│   Voting         │ ← All players vote simultaneously
└────────┬────────┘
         ▼
    ┌────┴────┐
    │  Tied?  │
    └────┬────┘
     Yes │    No
     ▼   │    ▼
┌────────┐│ ┌──────────────┐
│Tie Rule││ │ Spy Caught?  │
│Applied ││ └──────┬───────┘
└────────┘│   Yes  │  No
          │    ▼   │   ▼
          │ ┌──────┴──┐ ┌──────────┐
          │ │Spy Guess │ │ Spy Wins │
          │ │Location  │ └──────────┘
          │ └────┬─────┘
          │  ┌───┴───┐
          │  │Correct?│
          │  └───┬───┘
          │ Yes  │  No
          │  ▼   │   ▼
          │┌─────┴──┐┌──────────────┐
          ││Spy Wins││Citizens Win  │
          │└────────┘└──────────────┘
          ▼
┌─────────────────┐
│    Result        │ ← Show winner, game summary
└────────┬────────┘
         ▼
┌─────────────────┐
│  Play Again?     │ ← Return to lobby or start new round
└─────────────────┘
```

---

## Win Conditions

### Citizens Win
- Successfully vote out the spy **AND** the spy fails to guess the location

### Spy Wins
- Citizens vote out the wrong person
- Vote results in a tie (when tie-break rule = "Spy Wins")
- Spy is caught but correctly guesses the location
- Timer expires without a successful vote (spy survives)

---

## Discussion Rules

### Turn Structure
1. A random starting player is selected
2. The current player asks any other player a question about the location
3. The questioned player must answer
4. The questioned player then becomes the next questioner
5. Continue until timer expires or moderator calls for vote

### Question Guidelines
- Questions should be vague enough to not reveal the location to the spy
- But specific enough to confirm the other player knows the location
- Examples:
  - "How would you dress for this place?" (Good - vague)
  - "Is this place in a hospital?" (Bad - too specific)

---

## Voting Rules

1. Any player can call for a vote (or moderator, or timer expiry triggers it)
2. All votes are submitted simultaneously (secret ballot)
3. Each player votes for one suspect
4. Results are revealed after all votes are collected
5. The player with the most votes is accused

### Tie-Break Options
| Rule | Effect |
|------|--------|
| Revote (Tied Only) | Only tied candidates are re-voted |
| Revote (All) | Full revote with all candidates |
| Spy Wins | Tie counts as failed vote, spy wins |

---

## Spy's Location Guess

When the spy is successfully voted out:
1. The spy is revealed
2. The spy gets **one chance** to guess the location
3. The spy sees a list of all possible locations
4. If the spy guesses correctly → **Spy wins**
5. If the spy guesses incorrectly → **Citizens win**

---

## Special Rules for 2 Spies

When playing with 2 spies:
- Both spies know each other's identity
- Citizens must catch **both** spies to win
- If one spy is caught, the second spy remains and the game continues
- Each caught spy gets an independent location guess
- If **either** spy guesses the location correctly → **Spies win**

---

## Moderator vs Auto Mode

| Feature | With Moderator | Without Moderator |
|---------|---------------|-------------------|
| Turn order | Moderator decides | System auto-rotates |
| Voting trigger | Moderator calls vote | Timer expiry or majority request |
| Dispute resolution | Moderator decides | System rules apply |
| Timer control | Moderator can pause/adjust | Auto-countdown only |
| Game pace | Flexible | Fixed by timer |
