# 🎵 Spotify Clone

A full-featured music streaming application that replicates the core functionality and user experience of Spotify. Built with modern web technologies to deliver a seamless music discovery and playback experience.

---

## 📋 Project Overview

This Spotify Clone project demonstrates the integration of frontend and backend technologies to create a feature-rich music streaming platform. The application includes user authentication, playlist management, music search, and real-time playback controls.

---

## 🛠️ Tech Stack

| Technology | Usage | Percentage |
|-----------|-------|-----------|
| **JavaScript** | Frontend Logic & Interactivity | 56.5% |
| **Python** | Backend API & Server Logic | 32% |
| **CSS** | Styling & Responsive Design | 11.3% |
| **HTML** | Markup & Structure | 0.2% |

---

## ✨ Features

- 🎧 **Music Playback** - Stream audio with play, pause, skip, and volume controls
- 🔍 **Search Functionality** - Search for songs, artists, and playlists
- 📋 **Playlist Management** - Create, edit, and manage custom playlists
- 👤 **User Authentication** - Secure login and user account management
- 🎨 **Responsive UI** - Beautiful, intuitive interface that works on all devices
- ⭐ **Favorites** - Mark songs and artists as favorites
- 📊 **Music Discovery** - Browse trending tracks and personalized recommendations

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.7 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Bharath11000/Spotify-Clone.git
cd Spotify-Clone
```

2. **Install Frontend Dependencies:**
```bash
npm install
```

3. **Install Backend Dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure Environment Variables:**
Create a `.env` file in the root directory with your configuration:
```
SPOTIFY_API_KEY=your_api_key_here
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

5. **Start the Backend Server:**
```bash
python app.py
```

6. **Start the Frontend Development Server:**
```bash
npm start
```

7. **Open your browser:**
Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
Spotify-Clone/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── backend/
│   ├── app.py
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── requirements.txt
├── README.md
└── .gitignore
```

---

## 💻 Usage

1. **Create an Account** - Sign up with your email and password
2. **Browse Music** - Explore trending tracks and different genres
3. **Search** - Find your favorite songs, artists, or playlists
4. **Create Playlists** - Build custom playlists and add your favorite tracks
5. **Play Music** - Click any track to start playback with full playback controls
6. **Manage Library** - Add songs to favorites and organize your music library

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Music
- `GET /api/songs` - Get all songs
- `GET /api/songs/search` - Search songs
- `GET /api/artists` - Get all artists
- `GET /api/playlists` - Get user playlists

### User
- `GET /api/user/profile` - Get user profile
- `POST /api/user/favorites` - Add to favorites
- `GET /api/user/favorites` - Get favorite songs

---

## 🎯 Key Components

### Frontend
- **Player Component** - Music playback controls and progress tracking
- **Playlist Component** - Display and manage playlists
- **Search Component** - Real-time music search functionality
- **Navigation** - Seamless navigation between different sections

### Backend
- **Authentication Module** - User registration and login management
- **Music Database** - Store and retrieve music metadata
- **Playlist Manager** - Handle playlist CRUD operations
- **Search Engine** - Efficient music search implementation

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Inspired by Spotify's user interface and functionality
- Built with love and passion for music technology
- Thanks to all contributors and supporters

---

**Made with ❤️ by [Bharath11000](https://github.com/Bharath11000)**

⭐ If you find this project helpful, please consider giving it a star!
