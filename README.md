# DMS Aarohi - NGO Initiative Platform

This repository contains the React frontend for the NGO Initiative of DMS Aarohi. It acts as the public-facing website for social work, blood donation camps, and volunteer registrations.

## Architecture

This frontend connects to the unified DMS Aarohi backend API to fetch legacy gallery images, team members, blood donors, and upcoming NGO events.

## Running Locally
Navigate into the `client` folder and start the dev server:
```bash
cd client
npm install
npm run dev
```

## Environment Variables
Create a `.env` file in the `client` directory with:
```env
VITE_API_BASE=http://localhost:5051/api
```
