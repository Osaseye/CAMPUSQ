# CampusQ – Smart Campus Queue Management

<p align="center">
  <img alt="CampusQ Logo" src="src/assets/Professional &apos;CampusQ&apos; Logo with Fresh Aesthetic.png" width="160" />
</p>

CampusQ is a modern React + TypeScript application that helps universities manage student queues across multiple departments. It features a clean UI, smooth animations, and simulated real-time queue updates for demos.

## Features

- Student
  - Book queue slot by department and time
  - View live queue position and estimated wait time
  - Turn notifications when you are close (simulated)
  - Cancel/leave queue
- Staff/Admin
  - View departmental queues
  - Mark students as served and remove entries
  - Basic metrics: total in queue, departments, avg wait (simulated)
- System
  - Multi-department support (Bursary, Registry, Clinic, Student Affairs)
  - Animated UI with Framer Motion
  - Tailwind CSS styling

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion, React Icons
- Context API / custom store (`useStore`, `useUser`)

## Getting Started

1. Install dependencies
   - npm install
2. Run the dev server
   - npm run dev
3. Open the app at the printed local URL.

## Key Pages

- Landing: `src/pages/landing/LandingPage.tsx`
- Login/Signup: `src/pages/auth/`
- Booking: `src/pages/booking/BookingPage.tsx`
- Status: `src/pages/status/StatusPage.tsx`
- Dashboard (User): `src/pages/welcome/WelcomePage.tsx`
- Admin: `src/pages/admin/AdminDashboard.tsx`

## Screenshots

> Note: Images are stored in `src/assets/images`.

<p>
  <img alt="Screenshot 188" src="src/assets/images/Screenshot (188).png" width="45%" />
  <img alt="Screenshot 189" src="src/assets/images/Screenshot (189).png" width="45%" />
</p>
<p>
  <img alt="Screenshot 190" src="src/assets/images/Screenshot (190).png" width="45%" />
  <img alt="Screenshot 191" src="src/assets/images/Screenshot (191).png" width="45%" />
</p>
<p>
  <img alt="Screenshot 192" src="src/assets/images/Screenshot (192).png" width="45%" />
  <img alt="Screenshot 193" src="src/assets/images/Screenshot (193).png" width="45%" />
</p>
<p>
  <img alt="Screenshot 192" src="src/assets/images/Screenshot (194).png" width="45%" />
  <img alt="Screenshot 193" src="src/assets/images/Screenshot (195).png" width="45%" />
</p>
<p>
  <img alt="Screenshot 192" src="src/assets/images/Screenshot (196).png" width="45%" />
  <img alt="Screenshot 193" src="src/assets/images/Screenshot (197).png" width="45%" />
</p>

## Project Structure (partial)

```
CAMPUSQ/
  src/
    pages/
      landing/
      auth/
      booking/
      status/
      welcome/
      admin/
    components/
    context/
    data/
    assets/
      images/
```

## Notes

- Authentication and notifications are simulated for demo purposes.
- Average wait time is a mock value for display.

## License

This project is for educational/demo purposes.
