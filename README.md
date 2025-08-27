# 🗂️ Google Drive Clone

A modern, full-stack file storage application built with Next.js and Appwrite that replicates core Google Drive functionality.

![Google Drive Clone](./public/assets/images/files.png)

## ✨ Features

### 🔐 **Authentication**
- **Email OTP Authentication** - Secure login with one-time passwords
- **User Registration** - Simple sign-up process
- **Session Management** - Persistent user sessions with cookies

### 📁 **File Management**
- **File Upload** - Drag & drop or click to upload files
- **File Download** - Direct file downloads
- **File Rename** - Edit file names in-place
- **File Delete** - Remove files with confirmation
- **File Sharing** - Share files with other users via email

### 🎯 **Smart Organization**
- **File Type Filtering** - Filter by Documents, Images, Videos, Audio, Others
- **Search Functionality** - Search files by name, type, or extension
- **Recent Files** - Quick access to recently uploaded files
- **Storage Analytics** - Visual breakdown of storage usage

### 📊 **Dashboard & Analytics**
- **Storage Usage Chart** - Visual representation of space used
- **File Type Breakdown** - See usage by file category
- **Usage Statistics** - Track total files and storage consumed
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🎨 **Modern UI/UX**
- **Clean Interface** - Intuitive and user-friendly design
- **Dark/Light Themes** - Modern color schemes
- **Responsive Layout** - Optimized for all screen sizes
- **Loading States** - Smooth user experience with proper feedback

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons

### **Backend & Database**
- **Appwrite** - Backend-as-a-Service
  - Database for user and file metadata
  - Storage for file uploads
  - Authentication system
  - Real-time capabilities

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Appwrite account (free at [appwrite.io](https://appwrite.io))

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/gdrive-clone.git
cd gdrive-clone
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
```

### **3. Environment Setup**
Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=your_users_collection_id
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID=your_files_collection_id
NEXT_PUBLIC_APPWRITE_STORAGE_ID=your_storage_bucket_id
NEXT_APPWRITE_SECRET=your_appwrite_secret_key
```

### **4. Appwrite Setup**

#### **Create Project**
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project
3. Note your Project ID and Endpoint

#### **Database Setup**
Create a database with two collections:

**Users Collection:**
```json
{
  "name": "users",
  "attributes": [
    {"key": "fullName", "type": "string", "size": 255, "required": true},
    {"key": "email", "type": "string", "size": 255, "required": true},
    {"key": "avatar", "type": "string", "size": 500, "required": true},
    {"key": "accountId", "type": "string", "size": 255, "required": true}
  ]
}
```

**Files Collection:**
```json
{
  "name": "files",
  "attributes": [
    {"key": "name", "type": "string", "size": 255, "required": true},
    {"key": "type", "type": "string", "size": 50, "required": true},
    {"key": "size", "type": "integer", "required": true},
    {"key": "url", "type": "string", "size": 500, "required": true},
    {"key": "extention", "type": "string", "size": 10, "required": false},
    {"key": "owner", "type": "string", "size": 255, "required": true},
    {"key": "accountId", "type": "string", "size": 255, "required": true},
    {"key": "users", "type": "string", "array": true, "required": false},
    {"key": "bucketFileId", "type": "string", "size": 255, "required": true},
    {"key": "fullName", "type": "string", "size": 255, "required": true}
  ]
}
```

#### **Storage Setup**
1. Create a storage bucket
2. Set appropriate permissions for file upload/download
3. Note the Bucket ID

#### **Authentication Setup**
1. Enable Email/Password authentication
2. Configure email templates (optional)

### **5. Run Development Server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
gdrive-clone/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/             
│   │   └── sign-up/             
│   ├── (root)/                   # Main application
│   │   ├── [type]/              # File type pages
│   │   └── page.tsx             # Dashboard
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn UI components
│   ├── AuthForm.tsx             
│   ├── FileUploader.tsx         
│   ├── Header.tsx               
│   └── ...                      
├── lib/                         # Utilities and configurations
│   ├── actions/                 # Server actions
│   │   ├── file.action.ts       
│   │   └── user.actions.ts      
│   ├── appwrite/               # Appwrite configuration
│   └── utils.ts                # Utility functions
├── types/                      # TypeScript type definitions
├── public/                     # Static assets
└── constants/                  # Application constants
```

## 🔧 Key Features Implementation

### **File Upload System**
- Chunked upload for large files
- File type validation and categorization
- Automatic thumbnail generation
- Progress tracking

### **Storage Management**
- 2GB storage limit per user
- Real-time usage tracking
- File size optimization
- Automatic cleanup of failed uploads

### **Security Features**
- Server-side validation
- File type restrictions
- User session management
- Access control for file operations

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### **Other Platforms**
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Appwrite](https://appwrite.io/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

If you have any questions or need help with setup:

1. Check the [Issues](https://github.com/yourusername/gdrive-clone/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ using Next.js and Appwrite**