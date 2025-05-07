# Playground Rental System

A full-stack application for renting and managing sports playgrounds.

## Features

- User authentication and authorization (Player, Owner, Admin roles)
- Playground listing and management
- Booking system with real-time availability
- Reviews and ratings
- Payment processing
- Notifications system
- Responsive design with dark/light theme

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT in HTTP-Only cookies
- **Email**: Nodemailer with Mailtrap
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL database

### Environment Variables

Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

\`\`\`env
# Database
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/playground_rental"

# JWT
JWT_SECRET="a-very-long-random-secret-key"
JWT_EXPIRES_IN="7d"

# Mailtrap (Email verification simulation)
EMAIL_HOST="smtp.mailtrap.io"
EMAIL_PORT="2525"
EMAIL_USER="YOUR_MAILTRAP_USER"
EMAIL_PASS="YOUR_MAILTRAP_PASS"
EMAIL_FROM="noreply@playground.dev"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin emails
ADMIN_EMAIL="admin@playground.dev"
SUPER_ADMIN_EMAIL="ay123578@gmail.com"
\`\`\`

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/playground-rental.git
   cd playground-rental
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Generate Prisma client:
   \`\`\`bash
   npx prisma generate
   \`\`\`

4. Set up the database:
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

5. Seed the database (creates a super admin and sample data):
   \`\`\`bash
   npx prisma db seed
   \`\`\`

6. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Roles

- **PLAYER**: Can browse playgrounds, make bookings, and leave reviews
- **OWNER**: Can manage their own playgrounds and view bookings
- **SUPER_ADMIN**: Has full access to manage all users, playgrounds, bookings, and reviews

## Default Super Admin Account

Email: ay123578@gmail.com
Password: ABCD@1234

## API Routes

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/logout` - Log out a user
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/verify-email` - Verify email address

### Playgrounds

- `GET /api/playgrounds` - Get all playgrounds
- `POST /api/playgrounds` - Create a new playground (Owner/Admin only)
- `GET /api/playgrounds/:id` - Get a specific playground
- `PUT /api/playgrounds/:id` - Update a playground (Owner/Admin only)
- `DELETE /api/playgrounds/:id` - Delete a playground (Owner/Admin only)

### Bookings

- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get a specific booking
- `PATCH /api/bookings/:id` - Update a booking status

## License

This project is licensed under the MIT License - see the LICENSE file for details.
