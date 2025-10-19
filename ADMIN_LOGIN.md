# 🔐 Admin Login - Dating.ai

## ✅ Admin User Created

Your Dating.ai app now has a pre-configured admin user:

### 📧 Admin Credentials
- **Email**: `admin@dating.ai`
- **Password**: `admin123`

### 🎯 Admin Profile
- **Starts Fresh**: No profile data (like a new user)
- **Goes Through Setup**: Profile wizard with skip options
- **Tests Full Flow**: Experience the complete onboarding
- **Can Skip Everything**: Skip photos, prompts, and details
- **Simulates Real Users**: Test the actual user experience

---

## 🚀 How to Use

### Option 1: Web App (Easiest)
1. **Go to**: `http://localhost:5173`
2. **Login page** shows admin credentials pre-filled
3. **Click "Login"** - you're in!
4. **Profile Setup** - Goes through 3-step wizard:
   - **Step 1**: Add photos (or skip)
   - **Step 2**: Answer prompts (or skip)
   - **Step 3**: Add bio/location (or skip & finish)

### Option 2: Mobile App
1. **Start Expo**: `cd mobile && npx expo start`
2. **Open in simulator**: Press `i`
3. **Login** with admin credentials
4. **Complete onboarding** (or skip sections)

---

## 🎯 What You Can Do as Admin

✅ **Start fresh** - like a brand new user every time  
✅ **Skip onboarding** - test with minimal profile  
✅ **Complete profile** - test full user experience  
✅ **Browse fake users** - see 5 realistic test profiles  
✅ **Test matching** - like profiles and create matches  
✅ **Send messages** - test real-time chat  
✅ **Test all flows** - registration to messaging  

---

## 🔧 Admin Features Available

### User Management
- View all user profiles
- Test discovery algorithm
- Test matching system
- Monitor user activity

### Testing Features
- **Registration flow** - create test users
- **Profile creation** - upload photos, answer prompts
- **Discovery feed** - browse potential matches
- **Like system** - test profile/photo/prompt likes
- **Matching** - test mutual likes creating matches
- **Messaging** - test real-time chat
- **Preferences** - test age/distance filters

### Development Testing
- **API endpoints** - test all backend functionality
- **Real-time features** - test Socket.io messaging
- **File uploads** - test photo upload system
- **Database operations** - test all CRUD operations

---

## 🎉 Ready to Test!

Your Dating.ai app is now ready with:

✅ **Admin starts fresh** - incomplete profile every time  
✅ **Skip buttons** - on every onboarding step  
✅ **5 fake users** - realistic test accounts  
✅ **30 dating prompts** seeded  
✅ **Login pre-filled** for easy access  

**Just go to `http://localhost:5173` and click Login!** 🚀

---

## 👥 Test with Fake Users

5 complete profiles available for testing:
- **Sarah Miller** - 28, Female (sarah.miller@test.com)
- **Alex Chen** - 32, Male (alex.chen@test.com)
- **Jordan Parks** - 26, Non-binary (jordan.parks@test.com)
- **Marcus James** - 35, Male (marcus.james@test.com)
- **Emily Rodriguez** - 29, Female (emily.rodriguez@test.com)

**Password**: `password123` for all fake users

See `ADMIN_WORKFLOW.md` for detailed testing scenarios!

---

## 🔄 Reset Database (If Needed)

To reset everything and recreate the admin user:

```bash
cd backend
npx prisma migrate reset
npm run seed
```

This will:
- Drop all data
- Recreate database
- Create admin user
- Seed all prompts

---

## 📱 Mobile Testing

For mobile testing with admin:

1. **Start backend**: `cd backend && npm run dev`
2. **Start mobile**: `cd mobile && npx expo start`
3. **Open simulator**: Press `i`
4. **Login** with admin credentials

---

## 🎯 Next Steps

Now you can:
1. **Test the full app** as admin
2. **Create additional test users** via registration
3. **Test matching between users**
4. **Test real-time messaging**
5. **Develop new features** with a working foundation

Your Dating.ai app is fully functional! 💕
