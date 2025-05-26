# 🐥 Tweety – Mini Twitter Clone

Tweety is a minimalist social media app inspired by X (formerly Twitter). It allows users to create and interact with short posts, follow others, search content, and even engage in real-time chat. Built as a full-stack project, Tweety showcases both frontend and backend integration with modern React tooling and socket-based communication.

🔗 Live: [https://tweety-little-twitter.netlify.app/](https://tweety-little-twitter.netlify.app/)

---

## 🧩 Features

- ✅ User authentication (signup, login, logout)
- 📝 Create, edit, and delete posts with support for:
  - Bold, italic, bullet points, and other basic markdown
- 👥 Follow / unfollow other users
- 🧭 Personalized feed based on who you follow
- 🔍 Search posts (user search coming soon)
- 🗨️ Basic real-time chat between online users (powered by sockets)
- 🧑‍💻 User dashboard: view your own posts, followers, and following list
- 💻 Responsive UI

---

### 🛠️ Tech Stack

- ⚛️ React (via Create React App)
- 🎨 Tailwind CSS for styling
- 🔗 React Router for navigation
- 📝 React Markdown for rich post formatting
- 📦 Immer & useImmer for state management
- 🌐 Axios for API requests
- 💬 Socket.io-client for real-time chat

---

## 📦 Installation (for development)

> You only need this section if you're cloning the project and running it locally.

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/tweety.git
cd tweety
npm install
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Create a `.env` file in the root directory with your backend URL:

```
REACT_APP_API_URL=https://tweety-backend-1o5v.onrender.com
```

### 4. Start development server:

```bash
npm start
```

> Note: You must have the backend running or deployed for full functionality.

---

## 🌐 Deployment

The project is deployed on Netlify:  
[https://tweety-little-twitter.netlify.app](https://tweety-little-twitter.netlify.app)

The backend is hosted separately on Render:  
[https://tweety-backend-1o5v.onrender.com](https://tweety-backend-1o5v.onrender.com)

---

## ✨ Future Improvements

### 🔧 Short-Term Goals

- ⏳ Emoji reactions (❤️ 😂 😮 etc.) for posts
- 🔍 Search for users (currently only post search is implemented)
- 📝 Improved markdown editor with preview

### 🚀 Long-Term Plans

- 💬 Fully featured chat system:
  - History of conversations
  - One-on-one messaging
  - Group messaging
- 🤝 Smart user suggestions (who to follow)

---

## 📄 License

This project is open source and free to use. No license currently applied.
