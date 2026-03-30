OnAim Task

1. Project review

this project is admin panel about 3 feature, leaderboard, raffle and wheel

2. Architecture

The project follows a modular feature-based architecture with clear separation between UI, business logic, and API layer.

3. Tech Stack

Framework           React 18 + TypeScript
Build Tool          Vite
Routing             React Router v6
UI Library          Material UI (MUI) v5
Server State        TanStack React Query v5
Form Management     React Hook Form
Validation          Zod
Styling             MUI sx prop (primary), Emotion styled (limited use)

4. Getting Started

git clone https://github.com/Nikushaana/onaim.git
cd project

npm install

Create a .env file in the root directory and add:  VITE_API_URL=https://onaim.onrender.com

npm run dev

App will be available at:  http://localhost:5173

5. API used

POST /leaderboards
GET /leaderboards
GET /leaderboards/:id
PATCH /leaderboards/:id

POST /raffle
GET /raffle
GET /raffle/:id
PATCH /raffle/:id

POST /wheel
GET /wheel
GET /wheel/:id
PATCH /wheel/:id

6. Design Decisions

პროექტში ავირჩიე feature-based სტრუქტურა რადგან ეს უფრო სკალირებადია და კოდის წაკითხვა ბევრად მარტივია. თითოეული ფუნქციონალი იზოლირებულია და არ ხდება კოდის არევა.
ფორმებისთვის გამოვიყენე React Hook Form და Zod ერთად.
ეს მაძლევს:

მაღალ performance-ს (არ ხდება ზედმეტი rerender)
ცენტრალიზებულ validation-ს

