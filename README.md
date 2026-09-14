# Documents

*Please before continuing take a look at these documents!*

[Github Repository](https://github.com/Zetsukae/web-todo-ts-jobtrek)

[JobTrek documentation](https://docs.in.jt-lab.ch/apprentis/brief-projets/jt_dev_b41_web-todo-list-with-typescript.pdf) *(Internal use only)*

[RestAPI documentation from JobTrek](https://swagger.todos.in.jt-lab.ch/#/) -
[RestAPI documentation from RedHat](https://www.redhat.com/fr/topics/api/what-is-a-rest-api)

---

# A brief description time

**The web app helps you organize your life!** Stop trying to keep everything you have to do in your head, give your brain a rest and write it down. Here's what my web app can do:

- **Create to-dos** with specific dates and categories.

- **Delete tasks** whenever you want.

- **Create and edit custom categories** using different colors.

- **Create Folders** to organize what you need to do.

---

# How can I make my own?

You can make it from scratch in **HTML/CSS/JS** (you can use other programming languages!) or use some template available online -> [I recommend this one!](https://github.com/Kaiserabbas/Todo-List-Template).

---

# LocalStorage or RestAPI?

> Want to make it really fast and simple? I recommend to use **LocalStorage**.
> Want to take your time and make it more secure? I recommend to use the **RestAPI**.

### But what's the difference?

| Feature                  | LocalStorage                              | RestAPI                             |
| :----------------------- | :---------------------------------------- | ----------------------------------- |
| **Where the data lives** | User's browser                            | Centralized server / Database       |
| **Data sharing**         | Locked to one browser and device          | Accessible across any device / user |
| **Storage limit**        | **5MB to 10MB** per domain                | Virtually **unlimited**             |
| **Security**             | Low (Vulnerable to **XSS attacks**)       | High (Server-side controls)         |
| **Operations**           | **Synchronous** (Blocks main thread)      | **Asynchronous** (HTTP requests)    |
| **Data Types**           | **Strings only** (Requires serialization) | **Any format** (JSON, images, etc.) |

---

# Launch the project

1. Install the dependencies:

 ```bash
 pnpm install
 ```

1. Start the development server:

 ```bash
 pnpm dev
 ```

1. Open [http://localhost:5173](http://localhost:5173) in your browser.

The development server reloads automatically when you modify the source files.

---

# Here's usefull commands for development

| Commnand                 | Role                                      |
| :----------------------- | :---------------------------------------- |
| **pnpm i**               | Install dependencies.                     |
| **pnpm dev**             | launch the dev. server on localhost:5173. |
| **pnpm check-types**     | launch the TypeScript type checker.       |
| **pnpm format**          | format all project files correctly.       |
| **pnpm lint**            | run the biome linter, catch some errors.  |

---

# And now?

**Now** you have **everything** to make your **Own**! if you're stuck don't hesitate to ask question in different **Forums**. If you want a model without copying, just to see how it **looks like**, [I recommend this one!](https://github.com/Kaiserabbas/Todo-List-Template).
