# listing_easy

# 🏠 Listing Freshness System MVP

A modern Property Listing Verification System built as an MVP to demonstrate how stale property listings can be automatically detected and verified using simulated automation.

This project focuses on solving one common real-estate problem:

> **How do we know whether a property listing is still available after several days?**

Instead of manually contacting every owner, the system automatically flags listings that require verification based on configurable freshness rules.

---

# ✨ Features

## 📋 Property Dashboard

- View all property listings
- Professional card-based UI
- Property images
- Price
- Description
- View count
- Posted date
- Status badge

---

## ➕ Add New Listing

Create new listings with:

- Title
- Description
- Monthly Rent
- Owner Phone
- Posted Date
- View Count
- Image URL

---

## 📊 Stats Dashboard

Displays live statistics including:

- Total Listings
- Available Listings
- Pending Verification
- Archived / Sold Listings

The statistics update instantly whenever listing statuses change.

---

## 🔄 Listing Freshness Scan

A simulated Cron Job is provided through the UI.

Click:

> **Run Freshness Scan**

The system automatically checks every listing.

A listing becomes **Pending Verification** if:

- Posted more than **7 days ago**
- OR
- View count is greater than **10**

---

## 📱 Owner Reply Simulation

Instead of integrating Twilio or WhatsApp APIs, this MVP simulates owner responses.

For any listing marked **Pending Verification**, users can choose:

✅ Yes, Still Available

or

❌ No, It's Sold

The status updates instantly.

---

## 💾 Persistent Database

All listing data is stored in a cloud database.

Refreshing the page does **not** lose data.

---

# 🚀 Demo Workflow

1. Open dashboard

2. View seeded property listings

3. Click

```
Run Freshness Scan
```

4. Listings older than 7 days or having more than 10 views become

```
Pending Verification
```

5. Click

```
Simulate Owner Reply
```

6. Choose

```
Yes
```

or

```
No
```

7. Watch the status badge update instantly.

---

# 🏗️ Tech Stack

## Frontend

- React (Vite)
- Tailwind CSS
- TypeScript

## Backend / Storage

- Bolt Database (Cloud)

*(Can easily be replaced with Supabase or Firebase.)*

---

# 📂 Project Structure

```
src/
│
├── components/
│   ├── AddListingForm.tsx
│   ├── ListingCard.tsx
│   ├── StatsDashboard.tsx
│   └── StatusBadge.tsx
│
├── lib/
│   ├── freshness.ts
│   └── database.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

# 🧠 Freshness Logic

The verification rule is intentionally simple for MVP demonstration.

```text
IF

posted_at > 7 days old

OR

view_count > 10

THEN

status = pending_verification
```

This logic is executed when the user clicks the **Run Freshness Scan** button.

In production, this would be executed automatically using a scheduled Cron Job.

---

# 🌱 Seed Data

The project includes realistic fake property listings such as:

- 2BHK in Shamshabad
- Fully Furnished 1BHK in Gachibowli
- Studio Apartment near Hi-Tech City
- Luxury 3BHK in Kondapur
- 1RK in Madhapur
- Family Flat in Kukatpally
- Premium Apartment in Financial District
- 2BHK near Airport
- Budget Room in Mehdipatnam
- Studio near IKEA Hyderabad

Some listings are intentionally seeded to trigger the freshness rules.

Example:

- Posted 8 days ago
- 12+ views

---

# 🎨 UI Highlights

- Responsive Dashboard
- Modern Card Layout
- High Contrast Status Badges
- Live Statistics
- Smooth Status Updates
- Professional Tailwind Styling

---

# 🔮 Future Improvements

- WhatsApp Integration
- Twilio SMS
- Email Notifications
- Real Cron Jobs
- Authentication
- Owner Dashboard
- Admin Dashboard
- Search & Filters
- Image Upload
- Pagination
- Analytics
- Property Categories
- Google Maps Integration

---

# 📸 Screenshots

Add screenshots here after deployment.

Example:

```
screenshots/

dashboard.png

freshness-scan.png

owner-reply.png
```

---

# 🎯 Learning Objectives

This project demonstrates:

- CRUD Operations
- Cloud Database Integration
- State Management
- Component-Based React Architecture
- UI Design with Tailwind CSS
- Business Rule Automation
- Simulated Backend Workflows
- Persistent Storage
- Dashboard Development

---

# 🚀 Deployment

This project can be deployed easily using:

- Vercel
- Netlify
- Bolt.new
- Replit
- GitHub Pages (frontend)

No local database installation is required.

---

# 🤝 Contributing

Contributions are welcome.

Feel free to fork this repository, create a new branch, and submit a pull request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Amathul Lubna**

GitHub:
https://github.com/AmathulLubna

LinkedIn:
https://www.linkedin.com/in/amathul-lubna-298360381/
---

⭐ If you found this project useful, consider giving it a Star on GitHub!
