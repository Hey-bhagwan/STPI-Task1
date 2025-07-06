# 🛣️ Medicine Delivery Route Optimizer

A full-stack web application to manage **medicine deliveries** across multiple destinations using the **Travelling Salesman Problem (TSP)** algorithm to compute the most efficient delivery route.

🌐 **Live Demo**: [https://stpi-task1.vercel.app/](https://stpi-task1.vercel.app/)

---

## 📦 Features

- 📥 Add multiple medicines with destination and quantity
- 🔁 Calculate optimal delivery route using TSP
- 🧪 Auto-fill random test data
- 📍 View route with total cost and per-location deliveries
- 🧹 Delete/reset all data with a single click
- 📱 Fully responsive layout using Tailwind CSS
- 🎬 Collapsible form and result animation (Framer Motion)

---

## 🧠 Tech Stack

| Layer       | Tech                                    |
|-------------|-----------------------------------------|
| Frontend    | React, TypeScript, Tailwind CSS, Vite   |
| Animations  | Framer Motion                           |
| Backend     | Node.js, Express                        |
| Database    | Prisma ORM + SQLite                     |
| Deployment  | Vercel (Frontend), Render/Local (Backend) |

---

## 📁 Project Structure

```
medicine-tsp/
├── backend/
│   ├── index.js               # Express server with TSP logic
│   ├── db/
│   │   └── client.js          # Prisma DB client
│   └── prisma/
│       └── schema.prisma      # Database schema
├── frontend/
│   ├── src/
│   │   ├── components/        # React UI components
│   │   └── App.tsx, main.tsx
│   ├── public/
│   │   └── favicon.png
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### ⚙️ Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Run the server:

```bash
node index.js
```

Runs at: `http://localhost:3000`

---

### 🌐 Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Runs at: `http://localhost:5173`

---

## 📡 API Endpoints

### `PUT /api/v1/submit`
Submit medicine data:
```json
[
  { "name": "Paracetamol", "destination": 1, "quantity": 3 }
]
```

### `GET /api/v1/tsp`
Returns:
```json
{
  "cost": 120,
  "route": [0, 2, 4, 1, 3, 0],
  "deliveryDetails": [
    {
      "location": 2,
      "deliveries": [{ "name": "Dolo", "quantity": 2 }]
    }
  ]
}
```

### `DELETE /api/v1/delete-all`
Deletes all medicine entries.

---

## 🧪 Test Data

- Click on the **"🧪 Fill Test Data"** button to auto-generate 5–6 random medicines.
- Click **"✅ Submit & Calculate Route"** to compute the optimal delivery path.
- 🚫 If test data already exists, a message will guide the user to delete/reset.

---

## 🎨 UI Screenshots _(optional)_

> You can upload screenshots and reference them like:
> `![Home Page](./frontend/public/screenshot-home.png)`

---

## 👨‍🔬 Author

Made with 💊 and 💻 by **AYUSH UPADHYAY**

---

## 🌐 Connect with Me

- 🔗 [LinkedIn](https://www.linkedin.com/in/ayush-upadyay/)
- 📧 Email: ayushupa29@gmail.com
