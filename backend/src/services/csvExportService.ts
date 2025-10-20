import { createObjectCsvWriter } from 'csv-writer';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Create exports directory if it doesn't exist
const EXPORTS_DIR = path.join(__dirname, '../../exports');
if (!fs.existsSync(EXPORTS_DIR)) {
  fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

export const exportUserToCSV = async (userId: string) => {
  try {
    // Get user with full profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            promptAnswers: {
              include: {
                prompt: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!user || !user.profile) {
      throw new Error('User or profile not found');
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `user_${user.profile.firstName}_${timestamp}.csv`;
    const filepath = path.join(EXPORTS_DIR, filename);

    // Prepare data for CSV
    const csvData: any = {
      // Basic Info
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt.toISOString(),
      
      // Profile Info
      fullName: user.profile.firstName, // This contains "First Last" from onboarding
      age: user.profile.age,
      gender: user.profile.gender,
      bio: user.profile.bio || '',
      birthCity: user.profile.location || '',
      interestedIn: user.profile.interestedIn.join(', '),
      
      // AI Insight
      aiInsight: user.profile.aiInsight || 'Not generated yet',
    };

    // Add each prompt answer as a separate column
    user.profile.promptAnswers.forEach((pa, index) => {
      csvData[`question_${index + 1}`] = pa.prompt.text;
      csvData[`answer_${index + 1}`] = pa.answer;
      csvData[`category_${index + 1}`] = pa.prompt.category || '';
    });

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: filepath,
      header: Object.keys(csvData).map(key => ({ id: key, title: key })),
    });

    // Write data
    await csvWriter.writeRecords([csvData]);

    console.log(`✅ CSV exported: ${filename}`);
    return { filename, filepath };
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error('Failed to export user data to CSV');
  }
};

// Export all users to a single CSV
export const exportAllUsersToCSV = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: {
          include: {
            promptAnswers: {
              include: {
                prompt: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `all_users_${timestamp}.csv`;
    const filepath = path.join(EXPORTS_DIR, filename);

    const csvData = users.map(user => {
      const data: any = {
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        hasProfile: user.profile ? 'Yes' : 'No',
      };

      if (user.profile) {
        data.firstName = user.profile.firstName;
        data.age = user.profile.age;
        data.gender = user.profile.gender;
        data.bio = user.profile.bio || '';
        data.location = user.profile.location || '';
        data.interestedIn = user.profile.interestedIn.join(', ');
        data.aiInsight = user.profile.aiInsight || 'Not generated';
        data.promptAnswersCount = user.profile.promptAnswers.length;

        // Add first 3 prompt answers
        user.profile.promptAnswers.slice(0, 3).forEach((pa, index) => {
          data[`q${index + 1}`] = pa.prompt.text;
          data[`a${index + 1}`] = pa.answer;
        });
      }

      return data;
    });

    // Get all possible headers from all users
    const allKeys = new Set<string>();
    csvData.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });

    const csvWriter = createObjectCsvWriter({
      path: filepath,
      header: Array.from(allKeys).map(key => ({ id: key, title: key })),
    });

    await csvWriter.writeRecords(csvData);

    console.log(`✅ CSV exported: ${filename} (${users.length} users)`);
    return { filename, filepath, userCount: users.length };
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error('Failed to export all users to CSV');
  }
};

