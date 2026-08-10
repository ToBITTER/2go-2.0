import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rooms = [
  {
    slug: "football",
    name: "Football",
    description: "Match talk, banter, and live reactions.",
    category: "Sports",
  },
  {
    slug: "music",
    name: "Music",
    description: "Songs, clips, and whatever is stuck in your head.",
    category: "Culture",
  },
  {
    slug: "tech",
    name: "Tech",
    description: "Quick takes and late-night ideas.",
    category: "Ideas",
  },
  {
    slug: "campus",
    name: "Campus",
    description: "Chill conversation for the people around you.",
    category: "Social",
  },
  {
    slug: "gaming",
    name: "Gaming",
    description: "Open rooms for games, streams, and random wins.",
    category: "Fun",
  },
];

async function main() {
  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: {
        name: room.name,
        description: room.description,
        category: room.category,
      },
      create: room,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
