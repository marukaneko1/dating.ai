# 📊 CSV Export Feature

## ✅ Automatic Data Backup

Every time a user completes onboarding, their data is automatically exported to a CSV file on your computer!

---

## 🎯 How It Works

### Automatic Export
When a **real user** (not admin) completes the onboarding:

1. ✅ Profile data saved to database
2. ✅ AI insight generated (if API key valid)
3. ✅ **CSV file created automatically**
4. ✅ Saved to `backend/exports/` folder
5. ✅ User navigates to homepage

### What Gets Exported

**User Information:**
- User ID
- Email
- isAdmin flag
- Created date

**Profile Data:**
- First name
- Age (calculated from birthday)
- Gender
- Bio
- Location (birth city)
- Interested in
- AI insight (if generated)

**All 7 Question Answers:**
- Question 1: Text + Answer + Category
- Question 2: Text + Answer + Category
- Question 3: Text + Answer + Category
- Question 4: Text + Answer + Category
- Question 5: Text + Answer + Category
- Question 6: Text + Answer + Category
- Question 7: Text + Answer + Category

---

## 📁 File Location

**Files are saved to:**
```
backend/exports/user_[FirstName]_[Timestamp].csv
```

**Example:**
```
backend/exports/user_Sarah_2025-10-19T23-15-30-123Z.csv
```

**Path on your computer:**
```
/Users/marukaneko/dating-ai/backend/exports/
```

---

## 📋 CSV Format

### Headers
```csv
userId,email,isAdmin,createdAt,firstName,age,gender,bio,location,interestedIn,aiInsight,question_1,answer_1,category_1,question_2,answer_2,category_2,...
```

### Example Data
```csv
"abc123","user@test.com",false,"2025-10-19T23:00:00Z","Sarah",28,"female","Born in San Francisco","San Francisco, CA","male","This person demonstrates...",
"What brings you genuine peace...","Morning runs with my dog...","meaningful",
"When you're stressed...","I cook and process emotions...","meaningful",...
```

---

## 🔒 Privacy & Security

### Automatic Protection
✅ **exports/** folder added to `.gitignore`  
✅ **Never committed to GitHub**  
✅ **Stored locally only**  
✅ **Admin users NOT exported** (preview mode)  

### Who Gets Exported
- ✅ Regular users (user@test.com)
- ✅ Fake users (if they re-do onboarding)
- ❌ Admin users (skipped)

---

## 🎯 When Export Happens

### Triggers
✅ User completes all 8 onboarding steps  
✅ After profile saved to database  
✅ After AI insight generation attempt  
✅ Before redirect to homepage  

### Timing
```
User clicks "Complete Profile"
    ↓
1. Save profile ✅
2. Save answers ✅
3. Refresh user ✅
4. Generate AI ✅
5. Export to CSV ✅ (NEW!)
6. Navigate to homepage
```

### Non-Blocking
- Won't prevent user from continuing if export fails
- Errors logged but not shown to user
- User experience unaffected

---

## 📊 View Exported Data

### Option 1: Finder
1. Open Finder
2. Navigate to: `/Users/marukaneko/dating-ai/backend/exports/`
3. See CSV files with timestamps
4. Double-click to open in Excel/Numbers

### Option 2: Terminal
```bash
cd /Users/marukaneko/dating-ai/backend/exports
ls -la
```

### Option 3: VSCode
1. Open VSCode
2. Navigate to `backend/exports/` folder
3. Click on CSV files to view

---

## 🔧 Advanced Features

### Export All Users (Manual)
You can export all users at once via API:

```bash
curl -X POST http://localhost:3001/api/profile/export-csv \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Export Format
- **Single user**: `user_[Name]_[Timestamp].csv`
- **All users**: `all_users_[Timestamp].csv`

---

## 📝 Console Messages

### When User Completes Onboarding
You'll see in backend terminal:
```
✅ User data exported to CSV: user_Sarah_2025-10-19T23-15-30-123Z.csv
```

### When Admin Completes Preview
```
Skipping CSV export for admin user
```

### If Export Fails
```
Failed to export user to CSV: [error details]
```

---

## 🎯 Use Cases

### Data Analysis
- Import CSV into Excel/Google Sheets
- Analyze user responses
- Find patterns in answers
- Track demographics

### Backup
- Local backup of user data
- Can restore if database issues
- Historical record
- Audit trail

### Research
- Study what users value
- Analyze answer lengths
- Common themes
- User insights

### Development
- Test data validation
- Verify answers saved correctly
- Debug onboarding flow
- Quality assurance

---

## 🔄 Testing the Export

### Test Flow
```
1. Logout
2. Click "👤 User"
3. Login
4. Complete onboarding (8 steps)
5. → Check backend terminal for: "✅ User data exported to CSV..."
6. → Open backend/exports/ folder
7. → See new CSV file!
```

### Verify CSV Contents
```bash
# List exports
ls -la backend/exports/

# View a CSV
cat backend/exports/user_*.csv | head -20

# Count exports
ls backend/exports/*.csv | wc -l
```

---

## 📁 Folder Structure

```
backend/
  ├── exports/                     ← NEW FOLDER
  │   ├── user_Sarah_2025...csv
  │   ├── user_John_2025...csv
  │   └── all_users_2025...csv
  ├── src/
  │   └── services/
  │       └── csvExportService.ts  ← NEW SERVICE
  └── .gitignore                   ← Updated
```

---

## ✅ What's Been Added

**Backend:**
- ✅ `csv-writer` package installed
- ✅ `src/services/csvExportService.ts` - Export logic
- ✅ `exports/` folder created (gitignored)
- ✅ Auto-export after onboarding
- ✅ `/api/profile/export-csv` endpoint

**Frontend:**
- ✅ Auto-trigger CSV export in `Onboarding.tsx`
- ✅ Console logs for debugging
- ✅ Non-blocking (won't affect UX)

**Git:**
- ✅ exports/ folder in .gitignore
- ✅ CSV files never committed
- ✅ Privacy protected

---

## 🎉 Benefits

✅ **Automatic backup** - Every user completion  
✅ **Local storage** - On your computer  
✅ **Privacy** - Never committed to git  
✅ **Easy access** - Standard CSV format  
✅ **Non-blocking** - Won't slow down app  
✅ **Timestamped** - Track when users sign up  
✅ **Complete data** - All answers + AI insight  
✅ **Selective** - Only real users, not admin  

---

## 🚀 Ready to Use!

**Try it now:**
1. Complete user onboarding
2. Check `backend/exports/` folder
3. Open the CSV file
4. See all the data! 📊

**Your user data is now automatically backed up to CSV files on your computer!** 🎉

