# Restaurant Order Management System (WaiterApp)

**Live Demo:** [https://waiterapp2.netlify.app/](https://waiterapp2.netlify.app/)

A responsive web application built to manage restaurant orders and table service. This project demonstrates modern frontend architecture, emphasizing strong typing, global state management, and real-time data synchronization.

## Tech Stack

* **Core:** React, TypeScript, SCSS (CSS Modules)
* **State Management:** Redux Toolkit, Redux Thunk (Async actions), Reselect
* **Backend / DB:** Firebase (Firestore, `react-redux-firebase`)
* **Routing:** React Router v6
* **UI & Styling:** Bootstrap 5, `react-bootstrap`, `clsx`
* **Advanced Components:** `react-beautiful-dnd` (Drag & Drop), `react-big-calendar`
* **Testing:** Jest, React Testing Library
* **Deployment:** Netlify
* **Package Manager:** Yarn

## Core Features

* **Global State Architecture:** Predictable state management using Redux Toolkit, integrated tightly with Firebase for real-time updates.
* **Complex UI Interactions:** Implements advanced frontend interactions, including drag-and-drop mechanics (`react-beautiful-dnd`) and calendar views (`react-big-calendar`).
* **Real-time Synchronization:** Order management with instant updates across clients.
* **Table Management:** Table assignment, status tracking, and current order overview.
* **Type Safety:** Extensive use of TypeScript across components, state slices, and Firebase integrations.

## How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Emwook/waiter-app-2.git
cd waiter-app-2
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Environment Setup
To connect to the database, you will need to set up a Firebase project and provide the configuration. Create a `.env` file in the root directory and add your Firebase credentials.

### 4. Start the Development Server
```bash
yarn start
```
The application will be available at `http://localhost:3000`.

### 5. Running Tests
```bash
yarn test
```
