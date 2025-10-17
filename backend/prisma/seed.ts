import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const prompts = [
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

  // Clear existing prompts
  await prisma.prompt.deleteMany({});

  // Create prompts
  for (const prompt of prompts) {
    await prisma.prompt.create({
      data: prompt,
    });
  }

  console.log(`Created ${prompts.length} prompts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

