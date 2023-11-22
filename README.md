# Student Dashboard - Academic Progress Tracker

Welcome to the ultimate academic dashboard for SSN College students, offering a dynamic and feature-rich experience for academic progress tracking. 📚

![Student Dashboard](https://drive.google.com/uc?id=1scWxZLVfdE0h_r60t9NndzJYUKKrX09-)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Introduction

The Student Dashboard is designed to provide SSN College students with a comprehensive tool for tracking their academic progress. Whether you need to compute semester-wise GPAs, calculate your cumulative CGPA, or simply enjoy an engaging academic journey with dynamic backgrounds and animations, this dashboard has you covered.

## Features

- **Semester-Wise GPAs:** Easily compute your GPAs for each semester.
- **Cumulative CGPA:** Calculate your cumulative CGPA for a comprehensive academic overview.
- **Dynamic Backgrounds:** Enjoy backgrounds that change with your academic journey.
- **Engaging Animations:** Make academic progress tracking enjoyable with engaging animations.
- **Sleek Card Interfaces:** Visualize your data effortlessly with sleek card interfaces.


## Getting Started

To begin using the Student Dashboard project, follow these steps:

### Prerequisites

Before getting started with the Student Dashboard project, make sure you have the following prerequisites:

- **Node.js:** If you don't have Node.js installed, you can download and install it from [the official Node.js website](https://nodejs.org/).
- An integrated development environment (IDE) of your choice.
- A modern web browser to view the application.


### Installation

1. **Get Source Code Files:**

    #### Option 1: Clone Repository

    - If you have Git installed, you can clone the repository using the following command:

        ```bash
        git clone https://github.com/VineetKumar02/Student-Dashboard.git
        ```

    - After cloning, navigate to the project directory:

        ```bash
        cd Student-Dashboard
        ```

    #### Option 2: Download ZIP

    - If you prefer not to use Git, you can download the ZIP archive of the project:

    1. Click the "Code" button on the repository page.
    2. Choose "Download ZIP."
    3. Extract the downloaded ZIP file to a location of your choice.

2. **Configure Environment Variables:**

   - Create a `.env` file inside the "Back_End" directory with the following content:

        ```
        MONGO_URI=YOUR_MONGODB_URI_FROM_MONGODB_ATLAS
        PORT=YOUR_PREFERRED_PORT_NUMBER
        ```

   - Replace `YOUR_MONGODB_URI_FROM_MONGODB_ATLAS` with your actual MongoDB URI obtained from MongoDB Atlas by [Follow this Guide](https://www.mongodb.com/docs/guides/atlas/connection-string/), and replace `YOUR_PREFERRED_PORT_NUMBER` with your preferred port number.

3. **Server Setup:**

   - Navigate to the "Back_End" directory and install required dependencies by using the following commands:
   
        ```bash
        npm install
        npm start
        ```

   - The server should start, and you will see a link in the console. Open the provided link in your web browser.

4. **Development Setup:**

   - If you want to use nodemon for development purposes, you can run:

      ```bash
      npm run dev
      ```

Now, you've successfully configured the environment variables and set up the server for the Student Dashboard project. Enjoy exploring and developing this academic dashboard!

## Usage

Using the Student Dashboard is straightforward:

1. **Login or Register:**

   - When you open the provided link, you will land on the login page.
   - You can either log in with your existing account or register as a new user.

2. **Dashboard:**

   - Access your academic dashboard for a quick overview.

3. **GPA/CGPA Calculator:**

   - Compute semester-wise GPAs and calculate your cumulative CGPA.

4. **Settings:**

   - Customize your dashboard settings as needed.

Now you're ready to enhance your academic experience with the Student Dashboard, designed to simplify academic progress tracking.

## Technologies Used

- MongoDB
- Express
- AngularJS
- Node.js
- JavaScript
- HTML
- CSS

## Contributing

Contributions to this project are welcome. If you have any suggestions, enhancements, or bug fixes, please open an issue or submit a pull request.

**Note:** This project is designed to provide students with an enhanced academic experience. Enjoy tracking your academic progress with the Student Dashboard!
