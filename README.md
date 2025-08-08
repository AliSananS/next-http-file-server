# 📂 NHFS (Next-HTTP-File-Server)

A **sleek and sexy** file manager built with **Next.js** and **HeroUI**.  
Originally created as my **CS50x final project**, now evolving into a long-term side project.  
Community pull requests are welcome.

> [!WARNING]
> **NHFS Is Still In Development**
> 
> Features are not well tested and may crash.

> [!NOTE]
> I was running out of time, so I decided to focus on the basic functionality first before adding extra features like authentication and search.

---

## ✨ Features — Ready ✅
- **Preview Files** — Videos, Images and Audio.
- **File Info** — Size, Path and Date, etc.
- **File uploads** With Drag & Drop Support
- **Create, Delete, Move, Rename, and Copy** files directly on the server

---

## 🚧 Features — Not Ready (Coming Soon)
- **Text Preview** + Syntax Highlighting 🎨
- **Resumable downloads**
- **Authentication**
- **Search**
- **Secure file operations** (e.g., secure delete, move, copy operations)
- **Multiple file selection**

---

## 📂 Tech Stack
- **Next.js 15 (App Router)**
- **HeroUI** (UI components)
- **React Dropzone** (drag-and-drop)
- **TypeScript**
- **Node.js / Express-style API routes** for backend logic

---

> [!WARNING]
> **Windows support** is not tested yet.
> If you are on windows use WSL

## 🧪 Testing Locally (Manual Setup)

> [!NOTE]
> **Requirements:**
> 
> - Make sure [node.js](https://nodejs.org/en/download) version `>=18.18.0` is installed.
> - Linux🐧 or a Mac🍎 system.

This project doesn’t have a CLI installer yet, so you’ll need to run it manually:

### 1️⃣ Clone the repository
```bash
git clone https://github.com/AliSananS/NHFS.git
cd NHFS
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment

Edit `.env` to set the base directory.
If not configured, the current working directory will be served.

### 4️⃣ Start the server

```bash
npm start
```

> \[!NOTE]
> There's no CLI interface yet — you'll run everything manually for now.

---

## 🤝 Contributing

See the [Contributing Guide](docs/contributing.md).

---

## 📜 License

This project is licensed under the **MIT License**.
See [LICENSE](LICENSE) for details.
