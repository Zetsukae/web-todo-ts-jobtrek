# Documents

*Please take a look at these documentations before continuing!*

[RestAPI documentation from RedHat](https://www.redhat.com/fr/topics/api/what-is-a-rest-api)

[LocalStorage documentation from MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

# Overview

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)

**This web app helps you organize your life!** Stop trying to keep everything you have to do in your head; give your brain a rest and write it down. Here's what my web app can do:

- **Create to-dos** with specific dates and categories.
- **Delete to-dos** whenever you want.
- **Create and edit custom categories** using different colors.
- **Create folders** to organize what you need to do.

---

# How can I make my own?

You can build it from scratch using **HTML/CSS/JS** (or any other programming language!), or use an online template -> [I recommend this one!](https://github.com/Kaiserabbas/Todo-List-Template).

---

# How does my app currently work?

![structure-app](https://i.imgur.com/O3VE7ye.png)

My app communicates with a REST API for the backend, and relies on LocalStorage to persist folder structures.

---

# LocalStorage or Backend (REST API)?

> Want to make it really fast and simple? You can build a **frontend-only app** using **LocalStorage**.
> Want to access your data from anywhere? You will need a **Backend with a REST API** connected to a database.

### But what's the difference?

| Feature | LocalStorage | REST API |
| :--- | :--- | :--- |
| **Where the data lives** | User's browser | Centralized server / Database |
| **Data sharing** | Locked to one browser and device | Accessible across any device / user |
| **Storage limit** | **5MB to 10MB** per domain | Virtually **unlimited** |
| **Security** | Low (Vulnerable to **XSS attacks**) | High (Server-side controls) |
| **Operations** | **Synchronous** (Blocks main thread) | **Asynchronous** (HTTP requests) |
| **Data Types** | **Strings only** (Requires serialization) | **Any format** (JSON, images, etc.) |

---

# Launch the project

1. Install the dependencies:

    ```bash
    pnpm install # or pnpm i
    ```

2. Start the development server:

    ```bash
    pnpm dev
    ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

The development server reloads automatically when you modify the source files.

---

# Compile the project

1. Run compilation and optimization:

    ```bash
    pnpm build
    ```

---

# Useful commands for development

| Command | Role |
| :--- | :--- |
| **pnpm i** | Install dependencies. |
| **pnpm dev** | Launch the dev server on localhost:5173. |
| **pnpm check-types** | Launch the TypeScript type checker. |
| **pnpm format** | Format all project files correctly. |
| **pnpm lint** | Run the Biome linter to catch errors. |
| **pnpm run (script)** | Run a specific script from `package.json`. |

---

# What's next?

Now you have everything you need to build your own! If you get stuck, don't hesitate to ask questions in developer forums. If you want a reference model without copying directly just to see what it looks like, [check out this template!](https://github.com/Kaiserabbas/Todo-List-Template).
