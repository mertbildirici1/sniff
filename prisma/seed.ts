import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const brands = await prisma.brand.createMany({
    data: [
      { name: "Dior", country: "FR" },
      { name: "Chanel", country: "FR" },
      { name: "Tom Ford", country: "US" },
      { name: "Maison Francis Kurkdjian", country: "FR" },
      { name: "Le Labo", country: "US" },
      { name: "Creed", country: "FR" },
      { name: "Hermès", country: "FR" },
      { name: "Yves Saint Laurent", country: "FR" },
      { name: "Giorgio Armani", country: "IT" },
      { name: "Versace", country: "IT" }
    ],
    skipDuplicates: true
  });

  const notes = [
    "Bergamot", "Iris", "Rose", "Amber", "Vanilla", "Cedar", "Sandalwood", 
    "Musk", "Jasmine", "Vetiver", "Lavender", "Patchouli", "Oud", "Tobacco",
    "Leather", "Citrus", "Woody", "Floral", "Oriental", "Fresh"
  ];
  
  for (const n of notes) {
    await prisma.note.upsert({ 
      where: { name: n }, 
      update: {}, 
      create: { name: n } 
    });
  }

  const dior = await prisma.brand.findFirstOrThrow({ where: { name: "Dior" } });
  const mfk = await prisma.brand.findFirstOrThrow({ where: { name: "Maison Francis Kurkdjian" } });
  const tomFord = await prisma.brand.findFirstOrThrow({ where: { name: "Tom Ford" } });
  const leLabo = await prisma.brand.findFirstOrThrow({ where: { name: "Le Labo" } });
  const creed = await prisma.brand.findFirstOrThrow({ where: { name: "Creed" } });

  const perfumes = [
    { brandId: dior.id, name: "Homme Intense", concentration: "EDP", releaseYear: 2011 },
    { brandId: mfk.id, name: "Baccarat Rouge 540", concentration: "EDP", releaseYear: 2015 },
    { brandId: tomFord.id, name: "Black Orchid", concentration: "EDP", releaseYear: 2006 },
    { brandId: leLabo.id, name: "Santal 33", concentration: "EDP", releaseYear: 2011 },
    { brandId: creed.id, name: "Aventus", concentration: "EDP", releaseYear: 2010 },
    { brandId: dior.id, name: "Sauvage", concentration: "EDT", releaseYear: 2015 },
    { brandId: mfk.id, name: "Grand Soir", concentration: "EDP", releaseYear: 2016 },
    { brandId: tomFord.id, name: "Oud Wood", concentration: "EDP", releaseYear: 2007 },
    { brandId: leLabo.id, name: "Rose 31", concentration: "EDP", releaseYear: 2006 },
    { brandId: creed.id, name: "Green Irish Tweed", concentration: "EDT", releaseYear: 1985 }
  ];

  for (const p of perfumes) {
    const created = await prisma.perfume.upsert({
      where: { id: `${p.brandId}-${p.name}` },
      update: {},
      create: { ...p },
    });
    
    // Attach some notes to each perfume
    const iris = await prisma.note.findFirst({ where: { name: "Iris" } });
    const amber = await prisma.note.findFirst({ where: { name: "Amber" } });
    const vanilla = await prisma.note.findFirst({ where: { name: "Vanilla" } });
    const sandalwood = await prisma.note.findFirst({ where: { name: "Sandalwood" } });
    
    if (iris) await prisma.perfumeNote.create({ 
      data: { perfumeId: created.id, noteId: iris.id, position: "heart" } 
    });
    if (amber) await prisma.perfumeNote.create({ 
      data: { perfumeId: created.id, noteId: amber.id, position: "base" } 
    });
    if (vanilla) await prisma.perfumeNote.create({ 
      data: { perfumeId: created.id, noteId: vanilla.id, position: "base" } 
    });
    if (sandalwood) await prisma.perfumeNote.create({ 
      data: { perfumeId: created.id, noteId: sandalwood.id, position: "base" } 
    });
  }

  console.log("Seeded successfully!");
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
}).finally(() => prisma.$disconnect());
