# Feature Spec 09: Universal Home Dashboard & Admin Customizer Engine

## Status: Implemented & Active
**Date:** 2026-09-02  
**Author:** Antigravity  
**Branches:** `dev`, `main`

---

## 1. Overview
The Universal Home Dashboard is the public-facing and institutional landing hub for SchoolHub. It features an interactive, bright, modern UI with inspirational educational quotes, live announcements, quick stats, module highlights, and admissions/contact banners.

To give school administrators full control without touching code, the **Admin Dashboard Customizer Engine** enables real-time customization of:
- Educational quotes and marquee banners
- School welcome message & hero imagery
- Layout widget placement (drag-and-drop / ordering facility)
- Live preview of the customized landing page before publishing

---

## 2. Key Features

### 2.1 Universal Public School Portal (`/`)
- **Hero Banner:** Customizable headline, tagline, and call-to-action buttons.
- **Inspirational Quotes Carousel:** Rotating quotes on education, leadership, and curiosity.
- **Live School Statistics:** Real-time counter cards (Total Students, Faculty, Pass Rate, Campus Facilities).
- **Module Highlights:** Quick access to Academics, Attendance, Examination, Fees, Timetable, and Portals.
- **Latest Announcements & Events Notice Board:** Feed of upcoming school activities.

### 2.2 Admin Layout Customizer & Drag-and-Drop Engine (`/admin/dashboard-customizer`)
- **Widget Reordering:** Visual ordering controls to move widgets up/down or re-position cards.
- **Content Editor:** Live inputs to edit welcome titles, quotes, announcements, and contact information.
- **Live Preview Mode:** Dual-mode tab allowing admins to switch instantly between "Edit Mode" and "Live Preview".
- **Preset Styles & Themes:** Bright modern gradients, glassmorphism card styling, and polished animations.

---

## 3. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────┐
│              Admin Dashboard Customizer                │
│       (/admin/dashboard-customizer)                    │
│   - Edit Headlines, Quotes, Announcements               │
│   - Reorder Widget Layout (Drag-and-Drop / Move)       │
└──────────────────────────┬──────────────────────────────┘
                           │ Saves Config
                           ▼
┌─────────────────────────────────────────────────────────┐
│               localStorage / API Persistence            │
│         `schoolhub_dashboard_config_v1`                │
└──────────────────────────┬──────────────────────────────┘
                           │ Loads Config
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Universal Public School Portal             │
│                         (/)                             │
│   - Renders Customized Order, Quotes & Animations      │
└─────────────────────────────────────────────────────────┘
```

---

## 4. UI Animations & Loading States
- **Fade-in & Slide-up Entrance:** CSS keyframe animations (`animate-fade-in`, `animate-slide-up`).
- **Shimmer Loading Skeletons:** Animated background pulse for data loading states.
- **Interactive Hover Effects:** Scale, glow, and shadow transitions on cards and buttons.
- **Motivational Quotes Loader:** Random inspirational quotes shown during initial data fetching.
