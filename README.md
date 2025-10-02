# Tourista🍹⛱️

### A Tour Management Application

**_status: Still in progress..._**

TravelSphere is a comprehensive tour management system designed to simplify the planning, organization, and execution of trips for travel agencies, tour operators, and individual travelers. With TripPlanner, you can effortlessly manage itineraries, bookings, accommodations, transport schedules, and customer information — all from a single, intuitive platform.

## Key Features

- Itinerary Management: Plan and customize daily schedules for each tour.
- Booking & Reservations: Handle hotel, transport, and activity bookings efficiently.
- Customer Management: Store and manage traveler profiles and preferences.
- Payment & Invoice Tracking: Securely process payments and track invoices.
- Analytics & Reporting: Gain insights on tours, customer trends, and revenue.

## Application Security

- Custom Authentication with Passport.js
- Google Authentication using Passport.js
- Added Rate Limiting to prevent DDoS attacks
- Handled Global error handling by modifying the JS built-in **New Error** class by building a New AppError class. It's make sure a structured error like **status code** and **error message** by occuring any of the app errors.
- ZOD input validation to ensure the authentic users' data.
- Implemented mongoose advanced features like pre-hook middleware and sub-schema.
- For better type safty, I used **Typescript** everywhere.
