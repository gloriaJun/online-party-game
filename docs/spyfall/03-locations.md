# Spyfall - Locations & Roles Data

## Data Structure

Each location has a set of roles that players can be assigned.
Non-spy players can see the full role list and max headcount for their location.

### Schema

```typescript
interface Location {
  id: string; // Unique identifier
  name: string; // Display name
  imageUrl: string; // Card image path
  roles: Role[]; // Available roles at this location
}

interface Role {
  name: string; // Role display name
  imageUrl: string; // Role card image path
  maxCount: number; // Maximum players with this role
}
```

---

## Location List

### 1. Hospital

| Role         | Max Count |
| ------------ | --------- |
| Doctor       | 2         |
| Nurse        | 2         |
| Patient      | 3         |
| Surgeon      | 1         |
| Pharmacist   | 1         |
| Receptionist | 1         |
| Paramedic    | 1         |
| Visitor      | 1         |

### 2. School

| Role            | Max Count |
| --------------- | --------- |
| Teacher         | 2         |
| Student         | 3         |
| Principal       | 1         |
| Janitor         | 1         |
| Librarian       | 1         |
| Cafeteria Staff | 1         |
| School Nurse    | 1         |
| Security Guard  | 1         |

### 3. Restaurant

| Role       | Max Count |
| ---------- | --------- |
| Chef       | 2         |
| Waiter     | 3         |
| Customer   | 3         |
| Manager    | 1         |
| Sommelier  | 1         |
| Dishwasher | 1         |
| Bartender  | 1         |

### 4. Airport

| Role                   | Max Count |
| ---------------------- | --------- |
| Pilot                  | 1         |
| Flight Attendant       | 2         |
| Passenger              | 3         |
| Security Officer       | 2         |
| Customs Agent          | 1         |
| Ground Crew            | 1         |
| Ticket Agent           | 1         |
| Air Traffic Controller | 1         |

### 5. Police Station

| Role             | Max Count |
| ---------------- | --------- |
| Detective        | 2         |
| Officer          | 3         |
| Suspect          | 2         |
| Lawyer           | 1         |
| Chief            | 1         |
| Forensic Analyst | 1         |
| Clerk            | 1         |
| Witness          | 1         |

### 6. Movie Theater

| Role             | Max Count |
| ---------------- | --------- |
| Moviegoer        | 4         |
| Ticket Seller    | 1         |
| Projectionist    | 1         |
| Snack Bar Worker | 2         |
| Manager          | 1         |
| Usher            | 1         |
| Film Critic      | 1         |
| Cleaner          | 1         |

### 7. Submarine

| Role                   | Max Count |
| ---------------------- | --------- |
| Captain                | 1         |
| Navigator              | 1         |
| Engineer               | 2         |
| Sonar Operator         | 1         |
| Cook                   | 1         |
| Sailor                 | 3         |
| Medic                  | 1         |
| Communications Officer | 1         |

### 8. Space Station

| Role                    | Max Count |
| ----------------------- | --------- |
| Commander               | 1         |
| Astronaut               | 3         |
| Scientist               | 2         |
| Engineer                | 2         |
| Mission Control Liaison | 1         |
| Medical Officer         | 1         |
| Pilot                   | 1         |

### 9. Supermarket

| Role           | Max Count |
| -------------- | --------- |
| Cashier        | 2         |
| Shopper        | 4         |
| Store Manager  | 1         |
| Stock Clerk    | 2         |
| Security Guard | 1         |
| Butcher        | 1         |
| Baker          | 1         |

### 10. Cruise Ship

| Role        | Max Count |
| ----------- | --------- |
| Captain     | 1         |
| Passenger   | 4         |
| Crew Member | 2         |
| Entertainer | 1         |
| Chef        | 1         |
| Lifeguard   | 1         |
| Tour Guide  | 1         |
| Bartender   | 1         |

### 11. Casino

| Role        | Max Count |
| ----------- | --------- |
| Dealer      | 2         |
| Gambler     | 4         |
| Pit Boss    | 1         |
| Security    | 2         |
| Bartender   | 1         |
| Entertainer | 1         |
| Cashier     | 1         |

### 12. Museum

| Role             | Max Count |
| ---------------- | --------- |
| Curator          | 1         |
| Visitor          | 4         |
| Tour Guide       | 2         |
| Security Guard   | 2         |
| Restorer         | 1         |
| Gift Shop Worker | 1         |
| Photographer     | 1         |

### 13. Amusement Park

| Role               | Max Count |
| ------------------ | --------- |
| Visitor            | 4         |
| Ride Operator      | 2         |
| Mascot             | 1         |
| Food Vendor        | 2         |
| Manager            | 1         |
| Photographer       | 1         |
| Maintenance Worker | 1         |

### 14. Hotel

| Role         | Max Count |
| ------------ | --------- |
| Guest        | 4         |
| Receptionist | 1         |
| Bellboy      | 1         |
| Housekeeper  | 2         |
| Chef         | 1         |
| Concierge    | 1         |
| Manager      | 1         |
| Security     | 1         |

### 15. Beach

| Role             | Max Count |
| ---------------- | --------- |
| Swimmer          | 4         |
| Lifeguard        | 2         |
| Surfer           | 2         |
| Ice Cream Vendor | 1         |
| Photographer     | 1         |
| Beach Patrol     | 1         |
| Sunbather        | 1         |

---

## Card Image Specifications

| Property           | Value                            |
| ------------------ | -------------------------------- |
| Format             | PNG or WebP                      |
| Location Card Size | 400 x 300 px                     |
| Role Card Size     | 200 x 200 px                     |
| Background         | Transparent or solid color       |
| Style              | Illustrative / Flat Design (TBD) |

---

## Notes

- Each location supports up to 12 role slots (matching max player count)
- When player count < total role slots, roles are assigned randomly from the pool
- Role images can be placeholder icons initially, replaced with custom illustrations later
- Location list can be expanded; minimum 15 locations recommended for game variety
- Consider adding themed location packs (e.g., "Fantasy", "Sci-Fi", "Historical") as future expansion
