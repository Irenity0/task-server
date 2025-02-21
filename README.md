# Task No Jujutsu

## Short Description
This is a Task Management Application where users can manage their tasks with a clean, minimalistic UI. Users can add, edit, delete, reorder, and move tasks between three categories: To-Do, In Progress, and Done. The app ensures real-time synchronization, providing instant updates with drag-and-drop functionality and automatic saving of changes to the database. It’s designed to be responsive and accessible on both desktop and mobile devices.

## Live Links
- [Live Demo](https://task-no-jujutsu.web.app/)  

## Dependencies
- **Frontend Dependencies**:
  - `@tailwindcss/vite` - Vite plugin for Tailwind CSS.
  - `@tanstack/react-query` - For managing server state and handling data fetching.
  - `axios` - To make HTTP requests to the backend.
  - `firebase` - For Firebase Authentication (Google sign-in).
  - `localforage` - To handle client-side data storage.
  - `match-sorter` - For sorting tasks by specific fields.
  - `react-beautiful-dnd` - Library for drag-and-drop functionality.
  - `react-router-dom` - For routing and navigation.
  - `sort-by` - For sorting tasks.
  - `tailwindcss` - For utility-first CSS styling.

- **Dev Dependencies**:
  - `@eslint/js`, `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` - For linting and code quality enforcement.
  - `@vitejs/plugin-react` - Vite plugin for React.
  - `daisyui` - UI component library built with Tailwind CSS.
  - `vite` - A fast build tool for modern web development.

## Installation Steps
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <project-directory>
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase for Authentication:
   - Go to Firebase Console, create a project, and set up Google Sign-in Authentication.
   - Add your Firebase credentials to the `.env` file in the root of the project (refer to Firebase documentation for more details).

4. Set up MongoDB:
   - Use MongoDB Atlas or a local instance to create a database and set up a collection for storing tasks.
   - Add your MongoDB credentials to the `.env` file.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Navigate to `http://localhost:3000` in your browser to see the app in action.

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, DaisyUI, Firebase Authentication, React Beautiful DnD, Axios.
- **Backend**: Express.js, MongoDB.
- **Database**: MongoDB (via Express.js API).
