import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const prompts = [
  // User Self-Assessment Questions (True/False)
  { 
    text: "I need alone time to recharge and feel at peace", 
    category: 'user_self',
    type: 'true_false',
    options: JSON.stringify(['True', 'False'])
  },
  { 
    text: "I prefer to talk through problems immediately rather than taking time to process", 
    category: 'user_self',
    type: 'true_false',
    options: JSON.stringify(['True', 'False'])
  },
  { 
    text: "Physical touch and affection are essential for me to feel loved", 
    category: 'user_self',
    type: 'true_false',
    options: JSON.stringify(['True', 'False'])
  },
  { 
    text: "I've learned that I need a partner who gives me space to grow independently", 
    category: 'user_self',
    type: 'true_false',
    options: JSON.stringify(['True', 'False'])
  },
  { 
    text: "I believe confronting fears together makes a relationship stronger", 
    category: 'user_self',
    type: 'true_false',
    options: JSON.stringify(['True', 'False'])
  },
  
  // Partner Preference Questions (Multiple Choice, Multiple Selection)
  { 
    text: "What qualities are most important in a partner? (Select all that apply)", 
    category: 'partner_preference',
    type: 'multiple_choice',
    options: JSON.stringify([
      'Emotional intelligence',
      'Sense of humor',
      'Ambition and drive',
      'Kindness and empathy',
      'Physical affection',
      'Good communication',
      'Adventurous spirit',
      'Stability and reliability'
    ])
  },
  { 
    text: "How do you want your partner to handle conflict? (Select all that apply)", 
    category: 'partner_preference',
    type: 'multiple_choice',
    options: JSON.stringify([
      'Address issues immediately',
      'Take time to cool down first',
      'Listen actively without interrupting',
      'Validate my feelings',
      'Work together to find solutions',
      'Be willing to compromise',
      'Stay calm and respectful',
      'Follow up after resolving issues'
    ])
  },
  { 
    text: "What ways of showing love resonate with you most? (Select all that apply)", 
    category: 'partner_preference',
    type: 'multiple_choice',
    options: JSON.stringify([
      'Words of affirmation',
      'Quality time together',
      'Physical touch',
      'Acts of service',
      'Thoughtful gifts',
      'Active listening',
      'Planning surprises',
      'Supporting my goals'
    ])
  },
  { 
    text: "What relationship dynamics are important to you? (Select all that apply)", 
    category: 'partner_preference',
    type: 'multiple_choice',
    options: JSON.stringify([
      'Deep emotional connection',
      'Maintaining independence',
      'Sharing vulnerabilities',
      'Growing together',
      'Having separate interests',
      'Being best friends',
      'Mutual respect',
      'Supporting each other\'s dreams'
    ])
  },
  { 
    text: "What are deal-breakers or concerns in a relationship? (Select all that apply)", 
    category: 'partner_preference',
    type: 'multiple_choice',
    options: JSON.stringify([
      'Lack of emotional availability',
      'Poor communication',
      'Dishonesty',
      'Not respecting boundaries',
      'Different life goals',
      'Lack of effort',
      'Avoiding difficult conversations',
      'Not supporting personal growth'
    ])
  },
  { 
    text: "What does a meaningful relationship look like to you? (Select all that apply)", 
    category: 'partner_preference',
    type: 'multiple_choice',
    options: JSON.stringify([
      'Two independent people choosing each other',
      'Constant communication and togetherness',
      'Safe space for vulnerability',
      'Supporting each other\'s growth',
      'Shared values and goals',
      'Deep friendship and romance',
      'Honest and direct communication',
      'Balancing individuality and partnership'
    ])
  },
  
  // Fun prompts
  { text: "I'm weirdly attracted to...", category: 'fun' },
  { text: "My most controversial opinion is...", category: 'fun' },
  { text: "I'm overly competitive about...", category: 'fun' },
  { text: "The dorkiest thing about me is...", category: 'fun' },
  { text: "My go-to karaoke song is...", category: 'fun' },
  { text: "I'm secretly a nerd about...", category: 'fun' },
  
  // Deep prompts
  { text: "The key to my heart is...", category: 'deep' },
  { text: "I'm looking for...", category: 'deep' },
  { text: "My simple pleasures are...", category: 'deep' },
  { text: "The way to win me over is...", category: 'deep' },
  { text: "I value...", category: 'deep' },
  { text: "A life goal of mine is...", category: 'deep' },
  
  // Lifestyle prompts
  { text: "My ideal Sunday looks like...", category: 'lifestyle' },
  { text: "I spend most of my free time...", category: 'lifestyle' },
  { text: "On my bucket list is...", category: 'lifestyle' },
  { text: "My greatest strength is...", category: 'lifestyle' },
  { text: "I'm weirdly good at...", category: 'lifestyle' },
  { text: "I won't shut up about...", category: 'lifestyle' },
  
  // Dating prompts
  { text: "We'll get along if...", category: 'dating' },
  { text: "My love language is...", category: 'dating' },
  { text: "The best way to ask me out is...", category: 'dating' },
  { text: "I'm convinced that...", category: 'dating' },
  { text: "Dating me is like...", category: 'dating' },
  { text: "My perfect first date would be...", category: 'dating' },
  
  // Random prompts
  { text: "Change my mind about...", category: 'random' },
  { text: "I bet you can't...", category: 'random' },
  { text: "Fact about me that surprises people...", category: 'random' },
  { text: "I'll know I've met the one when...", category: 'random' },
  { text: "My most irrational fear is...", category: 'random' },
  { text: "Together we could...", category: 'random' },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data (in correct order to avoid foreign key constraints)
  await prisma.promptAnswer.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.photo.deleteMany({});
  await prisma.promptAnswer.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.prompt.deleteMany({});

  // Create admin user (complete profile - can access dev dashboard)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dating.ai',
      password: hashedPassword,
      isAdmin: true,
      profile: {
        create: {
          firstName: 'Admin',
          age: 30,
          bio: 'Dating.ai Administrator',
          location: 'San Francisco, CA',
          gender: 'non-binary',
          interestedIn: ['male', 'female', 'non-binary'],
          minAge: 18,
          maxAge: 50,
          maxDistance: 100,
        },
      },
    },
  });

  console.log('✅ Created admin user: admin@dating.ai / admin123 (complete profile with dev access)');

  // Create test user (incomplete profile - will go through onboarding)
  const testUserPassword = await bcrypt.hash('user123', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: testUserPassword,
      isAdmin: false,
    },
  });

  console.log('✅ Created test user: user@test.com / user123 (incomplete profile - will do onboarding)');

  // Create prompts first
  for (const prompt of prompts) {
    await prisma.prompt.create({
      data: prompt,
    });
  }

  console.log(`✅ Created ${prompts.length} prompts`);

  // Create fake test users
  const fakeUsers = [
    {
      email: 'sarah.miller@test.com',
      firstName: 'Sarah',
      age: 28,
      bio: 'Coffee enthusiast ☕ | Travel lover 🌍 | Dog mom 🐕',
      location: 'San Francisco, CA',
      gender: 'female',
      interestedIn: ['male'],
      prompts: [
        { text: "What brings you genuine peace or fulfillment in life?", answer: "Morning runs with my dog, watching the sunrise over the ocean, and deep conversations over coffee with people I love" },
        { text: "What are the top three qualities you look for in a partner?", answer: "Emotional intelligence, adventure spirit, and someone who makes me laugh even on tough days" },
        { text: "We'll get along if...", answer: "You can keep up with my spontaneous road trip ideas and don't mind my dog taking up half the bed" }
      ]
    },
    {
      email: 'alex.chen@test.com',
      firstName: 'Alex',
      age: 32,
      bio: 'Software engineer by day, amateur chef by night 👨‍💻🍳',
      location: 'San Francisco, CA',
      gender: 'male',
      interestedIn: ['female', 'non-binary'],
      prompts: [
        { text: "When you're stressed or upset, how do you usually respond?", answer: "I cook. There's something therapeutic about following a recipe and creating something delicious. It helps me process emotions and feel productive" },
        { text: "What's something you've learned about yourself from past relationships?", answer: "I need to be better at expressing my feelings with words, not just actions. My love language is acts of service, but I've learned that verbal affirmation matters too" },
        { text: "The dorkiest thing about me is...", answer: "I have a collection of over 100 mechanical keyboards and can talk about keycap profiles for hours" }
      ]
    },
    {
      email: 'jordan.parks@test.com',
      firstName: 'Jordan',
      age: 26,
      bio: 'Artist 🎨 | Yoga instructor 🧘 | Plant parent 🌱',
      location: 'Oakland, CA',
      gender: 'non-binary',
      interestedIn: ['male', 'female', 'non-binary'],
      prompts: [
        { text: "What three things make you feel most loved or appreciated?", answer: "When someone remembers small details I mentioned weeks ago, genuine compliments on my art, and quality time without phones or distractions" },
        { text: "What does a truly meaningful relationship look like to you?", answer: "Two whole people choosing each other every day, supporting each other's growth, and creating a safe space to be vulnerable and authentic" },
        { text: "I'm secretly a nerd about...", answer: "Rare succulents and their Latin names - I can spend hours at plant nurseries" }
      ]
    },
    {
      email: 'marcus.james@test.com',
      firstName: 'Marcus',
      age: 35,
      bio: 'Fitness coach 💪 | Foodie 🍜 | Adventure seeker 🏔️',
      location: 'San Francisco, CA',
      gender: 'male',
      interestedIn: ['female'],
      prompts: [
        { text: "What's a fear or challenge you're working on overcoming?", answer: "Learning to be vulnerable and ask for help. As a fitness coach, I'm used to being the strong one, but I'm learning that emotional strength means being open too" },
        { text: "What are the top three qualities you look for in a partner?", answer: "Authenticity, someone who challenges me to be better, and a sense of adventure - both in life and trying new foods" },
        { text: "My love language is...", answer: "Quality time and acts of service - I love cooking for people I care about" }
      ]
    },
    {
      email: 'emily.rodriguez@test.com',
      firstName: 'Emily',
      age: 29,
      bio: 'Marketing manager 📱 | Wine enthusiast 🍷 | Bookworm 📚',
      location: 'San Jose, CA',
      gender: 'female',
      interestedIn: ['male', 'female'],
      prompts: [
        { text: "What brings you genuine peace or fulfillment in life?", answer: "Getting lost in a great book, meaningful conversations over wine, and helping my team succeed at work. I find fulfillment in both solitude and connection" },
        { text: "What's something you've learned about yourself from past relationships?", answer: "I used to avoid conflict to keep the peace, but I've learned that honest communication, even when uncomfortable, builds stronger relationships than pretending everything is fine" },
        { text: "My perfect first date would be...", answer: "Wine tasting followed by browsing a bookstore and sharing our favorite finds over coffee" }
      ]
    }
  ];

  for (const user of fakeUsers) {
    const userPassword = await bcrypt.hash('password123', 10);
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        password: userPassword,
        profile: {
          create: {
            firstName: user.firstName,
            age: user.age,
            bio: user.bio,
            location: user.location,
            gender: user.gender,
            interestedIn: user.interestedIn,
            minAge: 22,
            maxAge: 40,
            maxDistance: 50,
            latitude: 37.7749 + (Math.random() - 0.5) * 0.5, // Random location near SF
            longitude: -122.4194 + (Math.random() - 0.5) * 0.5,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Add prompt answers
    const allPrompts = await prisma.prompt.findMany();
    for (let i = 0; i < user.prompts.length; i++) {
      const promptData = user.prompts[i];
      const prompt = allPrompts.find(p => p.text === promptData.text);
      if (prompt && createdUser.profile) {
        await prisma.promptAnswer.create({
          data: {
            profileId: createdUser.profile.id,
            promptId: prompt.id,
            answer: promptData.answer,
            order: i + 1,
          },
        });
      }
    }

    console.log(`✅ Created fake user: ${user.firstName} (${user.email})`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

