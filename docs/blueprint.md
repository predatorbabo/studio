# **App Name**: T-Tow Simplified

## Core Features:

- Authentication: Enable users to sign up and log in using email and password with Firebase Authentication.
- Role Selection: Prompt users to select either 'driver' or 'owner' role upon initial signup. The role is permanently stored in Firestore.
- Firestore User Document: Create and manage user documents in Firestore, including user ID, email, role, and creation timestamp. Restrict role modification after initial setup using Firestore security rules.
- Driver Profile Creation: Enable drivers to create profiles including full name, phone number, and vehicle type, stored in Firestore.
- Tow Owner Profile Creation: Enable tow owners to create profiles including full name, phone number, and company name, stored in Firestore.
- Role-Based Navigation: Implement navigation logic that redirects users to either the Driver Home Page or Owner Dashboard Page upon login, based on their assigned role in Firestore.
- Firestore Security Rules: Secure Firestore data by implementing rules that restrict users to reading and writing only their own documents, and prevent unauthorized access between drivers and owners.

## Style Guidelines:

- Primary color: Deep blue (#2962FF) for trustworthiness and reliability. Use CSS variables to define this color.
- Background color: Very light gray (#F5F7FA), close to white, for a clean and modern look. Use CSS variables to define this color.
- Accent color: A slightly darker shade of blue (#3D5AF1) will draw the user's attention without overwhelming the UI. Use CSS variables to define this color.
- Body and headline font: 'Inter', a grotesque-style sans-serif known for its modern, machined, objective, neutral look. Suitable for both headlines and body text. Use CSS variables for font families and sizes.
- Use simple, line-based icons for a clean and modern appearance.
- Mobile-first, single-column layout with clear, prominent buttons for easy navigation. Use CSS Grid or Flexbox for layout, managed with CSS variables for spacing and sizing.
- No complex animations. Focus on subtle transitions for loading states. Use CSS transitions and animations.