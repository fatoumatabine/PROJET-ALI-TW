# Chat App

## Overview
The Chat App is a simple web application that allows users to connect and communicate through a chat interface. It features a login form where users can enter their name and phone number to gain access to the chat functionality.

## Project Structure
```
chat-app
├── src
│   ├── js
│   │   ├── validation.js       # Contains validation functions for user input
│   │   ├── toast.js            # Handles toast notifications
│   │   └── main.js             # Entry point of the application
│   ├── css
│   │   └── styles.css          # Styles for the application
│   └── pages
│       ├── index.html          # Main HTML file for the application
│       └── mess.html           # Chat functionality page
├── public
│   └── assets                  # Directory for public assets
├── .gitignore                  # Specifies files to ignore in Git
└── README.md                   # Documentation for the project
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd chat-app
   ```
3. Open `src/pages/index.html` in your browser to view the application.

## Features
- User input validation for the login form.
- Toast notifications for user feedback.
- Responsive design using CSS.

## Technologies Used
- HTML
- CSS
- JavaScript
- Toastify for notifications

## License
This project is licensed under the MIT License.