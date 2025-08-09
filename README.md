# 📂 NHFS (Next-HTTP-File-Server)

A **sleek and sexy** file manager built with **Next.js** and **HeroUI**.  
Originally created as my **CS50x final project**, now evolving into a long-term side project.  
Community pull requests are welcome.

> [!WARNING]
> **NHFS Is Still In Development** — Features are not well tested and may crash.

---

## ✨ Features — Ready ✅

- **Preview Files** — Videos, Images, and Audio
- **File Info** — Size, Path, and Date, etc.
- **File Uploads** — With drag & drop support
- **Create, Delete, Move, Rename, and Copy** files directly on the server

---

## 🚀 Usage:

```bash
npx nhfs
````

### CLI Options

* `--port`, `-p` — Server port (default: `3000`)
* `--dir`, `-d` — Base directory to serve (default: current working directory)
* `--hostname`, `-h` — Hostname (default: `localhost`)

Example:

```bash
npx nhfs -p 8080 -d ./files -h 0.0.0.0
```

---

## 🗺 Roadmap

### Core Features

* **Authentication** (user login & permissions)
* **Secure File Operations** — e.g., secure delete, move, copy
* **Search Files**

### File Handling

* **Text Preview** + Syntax Highlighting 🎨
* **Multiple File Selection**
* **Folder Size in Info**
* **File Icons by Type**
* **Download Directory as ZIP**

### Upload/Download Enhancements

* **Resumable Uploads**
* **Resumable Downloads**

---

## 📂 Tech Stack

* **Next.js 15 (App Router)**
* **HeroUI** (UI components)
* **React Dropzone** (drag-and-drop)
* **TypeScript**
* **Node.js / Express-style API routes** for backend logic

---

> \[!WARNING]
> **Windows support** is not tested yet. If you are on Windows, use WSL.

---

## 🧪 Testing Locally (Manual Setup)

> \[!NOTE]
> **Requirements:**
>
> * [Node.js](https://nodejs.org/en/download) version `>=18.18.0`
> * Linux 🐧 or macOS 🍎

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AliSananS/NHFS.git
cd NHFS
```

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

---

## 🤝 Contributing

See the [Contributing Guide](docs/contributing.md).

---

## 📜 License

This project is licensed under the **MIT License**.
See [LICENSE](LICENSE) for details.
