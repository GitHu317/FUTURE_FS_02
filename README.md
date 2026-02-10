# Future Interns - Full Stack Web Development

**Task 2: Client Lead Management System (Mini CRM)**

### 📋 Project Information
- **Track Code:** FS
- **Task Number:** 02
- **Repository Name:** FUTURE_FS_02
- **Developer Name:** Lincoln Alexyv
- **CIN ID:** FIT/JAN26/FS10159

---

### 🚀 Project Overview
This project is a functional **Mini CRM (Customer Relationship Management)** system designed to capture and manage client leads. It features a dual-interface system: a public-facing contact form for potential clients and a secure, password-protected Admin Dashboard for managing lead statuses and follow-up notes.

### 🛠️ Tech Stack
* **Frontend:** React.js, Lucide-React (Icons), Axios, CSS3 (Custom Dark Theme)
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Security:** Environment-based authentication for admin access

### 📂 Key Features
* **Lead Capture:** A sleek, user-friendly contact form for capturing Name, Email, and Messages.
* **Secure Admin Login:** Access control via a backend-verified password system.
* **Lead Management Dashboard:** * View all leads in a clean, professional table.
    * **Status Updates:** Transition leads between `New`, `Contacted`, and `Converted`.
    * **Notes System:** Inline editing for follow-ups and internal notes per lead.
    * **Lead Deletion:** Remove outdated or test leads from the system.
* **Data Persistence:** Full integration with a MySQL database for reliable data storage.

### ⚙️ Setup & Installation

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[Your-Github-Username]/FUTURE_FS_02.git
    cd FUTURE_FS_02
    ```

2.  **Database Configuration:**
    * Import the provided `database.sql` file into your MySQL server.
    * Create a `.env` file in the root directory and add your credentials:
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_password
        DB_NAME=portfolio_db
        ADMIN_PASSWORD=apptester
        ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Run the Application:**
    * Start the Backend: `node server.js`
    * Start the Frontend: `npm run dev` (or your specific start command)

---

### 📬 Submission Links
* **GitHub Repository:** https://github.com/GitHu317
* App password: apptester
* Livelink: https://future-fs-02-frontend-zyuq.onrender.com/
