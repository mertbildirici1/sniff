import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create additional brands
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
      { name: "Versace", country: "IT" },
      { name: "Gucci", country: "IT" },
      { name: "Prada", country: "IT" },
      { name: "Dolce & Gabbana", country: "IT" },
      { name: "Bvlgari", country: "IT" },
      { name: "Montblanc", country: "DE" },
      { name: "Hugo Boss", country: "DE" },
      { name: "Calvin Klein", country: "US" },
      { name: "Ralph Lauren", country: "US" },
      { name: "Burberry", country: "GB" },
      { name: "Jo Malone", country: "GB" },
      { name: "Penhaligon's", country: "GB" },
      { name: "By Kilian", country: "FR" },
      { name: "Maison Margiela", country: "BE" },
      { name: "Diptyque", country: "FR" },
      { name: "L'Artisan Parfumeur", country: "FR" },
      { name: "Serge Lutens", country: "FR" },
      { name: "Annick Goutal", country: "FR" },
      { name: "Lancôme", country: "FR" },
      { name: "Guerlain", country: "FR" },
      { name: "Givenchy", country: "FR" },
      { name: "Thierry Mugler", country: "FR" },
      { name: "Jean Paul Gaultier", country: "FR" },
      { name: "Issey Miyake", country: "JP" },
      { name: "Kenzo", country: "FR" },
      { name: "Comme des Garçons", country: "JP" },
      { name: "Amouage", country: "OM" },
      { name: "Nasomatto", country: "IT" },
      { name: "Ormonde Jayne", country: "GB" },
      { name: "Miller Harris", country: "GB" },
      { name: "Acqua di Parma", country: "IT" },
      { name: "Bottega Veneta", country: "IT" },
      { name: "Balenciaga", country: "ES" },
      { name: "Loewe", country: "ES" },
      { name: "Carolina Herrera", country: "VE" },
      { name: "Oscar de la Renta", country: "DO" },
      { name: "Viktor & Rolf", country: "NL" },
      { name: "Maison Martin Margiela", country: "BE" },
      { name: "Atelier Cologne", country: "FR" },
      { name: "Annick Goutal", country: "FR" },
      { name: "L'Occitane", country: "FR" },
      { name: "Cacharel", country: "FR" },
      { name: "Rochas", country: "FR" },
      { name: "Lalique", country: "FR" },
      { name: "Caron", country: "FR" },
      { name: "Patou", country: "FR" },
      { name: "Lanvin", country: "FR" },
      { name: "Nina Ricci", country: "FR" },
      { name: "Pierre Balmain", country: "FR" },
      { name: "Rochas", country: "FR" },
      { name: "Cacharel", country: "FR" },
      { name: "Lalique", country: "FR" },
      { name: "Caron", country: "FR" },
      { name: "Patou", country: "FR" },
      { name: "Lanvin", country: "FR" },
      { name: "Nina Ricci", country: "FR" },
      { name: "Pierre Balmain", country: "FR" }
    ],
    skipDuplicates: true
  });

  // Create comprehensive notes
  const notes = [
    "Bergamot", "Lemon", "Orange", "Grapefruit", "Mandarin", "Lime", "Citrus",
    "Iris", "Rose", "Jasmine", "Lily", "Peony", "Magnolia", "Tuberose", "Gardenia", "Lily of the Valley", "Freesia", "Narcissus", "Orchid", "Violet",
    "Amber", "Vanilla", "Tonka Bean", "Benzoin", "Labdanum", "Styrax", "Frankincense", "Myrrh",
    "Cedar", "Sandalwood", "Vetiver", "Patchouli", "Oud", "Agarwood", "Guaiac Wood", "Rosewood", "Ebony", "Mahogany", "Teak",
    "Musk", "Civet", "Ambergris", "Castoreum", "Honey", "Beeswax", "Milk", "Leather", "Tobacco", "Smoke",
    "Lavender", "Sage", "Thyme", "Rosemary", "Mint", "Basil", "Tarragon", "Oregano", "Coriander", "Cardamom", "Cinnamon", "Clove", "Nutmeg", "Ginger", "Pepper", "Saffron",
    "Fresh", "Aquatic", "Marine", "Salty", "Mineral", "Green", "Herbal", "Woody", "Oriental", "Spicy", "Gourmand", "Powdery", "Floral", "Fruity", "Chypre", "Fougère"
  ];
  
  for (const n of notes) {
    await prisma.note.upsert({ 
      where: { name: n }, 
      update: {}, 
      create: { name: n } 
    });
  }

  // Get brand references
  const brandMap = new Map();
  const allBrands = await prisma.brand.findMany();
  allBrands.forEach(brand => brandMap.set(brand.name, brand.id));

  // 100+ Perfumes with detailed information
  const perfumes = [
    // Dior Collection
    { brand: "Dior", name: "Sauvage", concentration: "EDT", releaseYear: 2015, genderTarget: "Men", notes: ["Bergamot", "Pepper", "Ambroxan", "Cedar"] },
    { brand: "Dior", name: "Sauvage EDP", concentration: "EDP", releaseYear: 2016, genderTarget: "Men", notes: ["Bergamot", "Pepper", "Ambroxan", "Cedar", "Vanilla"] },
    { brand: "Dior", name: "Homme Intense", concentration: "EDP", releaseYear: 2011, genderTarget: "Men", notes: ["Iris", "Lavender", "Amber", "Vanilla"] },
    { brand: "Dior", name: "Homme Sport", concentration: "EDT", releaseYear: 2012, genderTarget: "Men", notes: ["Citrus", "Ginger", "Cedar", "Musk"] },
    { brand: "Dior", name: "Fahrenheit", concentration: "EDT", releaseYear: 1988, genderTarget: "Men", notes: ["Lavender", "Leather", "Tobacco", "Cedar"] },
    { brand: "Dior", name: "J'adore", concentration: "EDP", releaseYear: 1999, genderTarget: "Women", notes: ["Rose", "Jasmine", "Ylang-Ylang", "Vanilla"] },
    { brand: "Dior", name: "Miss Dior", concentration: "EDP", releaseYear: 1947, genderTarget: "Women", notes: ["Rose", "Jasmine", "Patchouli", "Musk"] },
    { brand: "Dior", name: "Poison", concentration: "EDP", releaseYear: 1985, genderTarget: "Women", notes: ["Rose", "Tuberose", "Amber", "Vanilla"] },
    { brand: "Dior", name: "Hypnotic Poison", concentration: "EDP", releaseYear: 1998, genderTarget: "Women", notes: ["Almond", "Vanilla", "Sandalwood", "Musk"] },
    { brand: "Dior", name: "Pure Poison", concentration: "EDP", releaseYear: 2004, genderTarget: "Women", notes: ["Jasmine", "Orange Blossom", "Sandalwood", "Amber"] },

    // Chanel Collection
    { brand: "Chanel", name: "No. 5", concentration: "EDP", releaseYear: 1921, genderTarget: "Women", notes: ["Rose", "Jasmine", "Ylang-Ylang", "Vanilla", "Sandalwood"] },
    { brand: "Chanel", name: "Coco Mademoiselle", concentration: "EDP", releaseYear: 2001, genderTarget: "Women", notes: ["Bergamot", "Rose", "Jasmine", "Patchouli", "Vanilla"] },
    { brand: "Chanel", name: "Chance", concentration: "EDT", releaseYear: 2002, genderTarget: "Women", notes: ["Citrus", "Jasmine", "Pink Pepper", "Patchouli", "Vanilla"] },
    { brand: "Chanel", name: "Allure", concentration: "EDT", releaseYear: 1996, genderTarget: "Women", notes: ["Mandarin", "Rose", "Jasmine", "Vanilla", "Sandalwood"] },
    { brand: "Chanel", name: "Bleu de Chanel", concentration: "EDP", releaseYear: 2010, genderTarget: "Men", notes: ["Citrus", "Ginger", "Jasmine", "Cedar", "Sandalwood"] },
    { brand: "Chanel", name: "Allure Homme", concentration: "EDT", releaseYear: 1999, genderTarget: "Men", notes: ["Mandarin", "Pepper", "Cedar", "Vanilla"] },
    { brand: "Chanel", name: "Platinum Égoïste", concentration: "EDT", releaseYear: 1993, genderTarget: "Men", notes: ["Lavender", "Rose", "Sandalwood", "Amber"] },
    { brand: "Chanel", name: "Antaeus", concentration: "EDT", releaseYear: 1981, genderTarget: "Men", notes: ["Lavender", "Rose", "Leather", "Musk"] },
    { brand: "Chanel", name: "Coco", concentration: "EDP", releaseYear: 1984, genderTarget: "Women", notes: ["Rose", "Jasmine", "Patchouli", "Vanilla", "Sandalwood"] },
    { brand: "Chanel", name: "Cristalle", concentration: "EDT", releaseYear: 1974, genderTarget: "Women", notes: ["Citrus", "Jasmine", "Oakmoss", "Sandalwood"] },

    // Tom Ford Collection
    { brand: "Tom Ford", name: "Black Orchid", concentration: "EDP", releaseYear: 2006, genderTarget: "Unisex", notes: ["Truffle", "Chocolate", "Patchouli", "Vanilla", "Sandalwood"] },
    { brand: "Tom Ford", name: "Oud Wood", concentration: "EDP", releaseYear: 2007, genderTarget: "Men", notes: ["Oud", "Rosewood", "Sandalwood", "Vanilla"] },
    { brand: "Tom Ford", name: "Tobacco Vanille", concentration: "EDP", releaseYear: 2007, genderTarget: "Unisex", notes: ["Tobacco", "Vanilla", "Tonka Bean", "Cocoa"] },
    { brand: "Tom Ford", name: "Noir de Noir", concentration: "EDP", releaseYear: 2007, genderTarget: "Unisex", notes: ["Rose", "Truffle", "Patchouli", "Vanilla"] },
    { brand: "Tom Ford", name: "Tuscan Leather", concentration: "EDP", releaseYear: 2007, genderTarget: "Men", notes: ["Leather", "Raspberry", "Saffron", "Jasmine"] },
    { brand: "Tom Ford", name: "Café Rose", concentration: "EDP", releaseYear: 2012, genderTarget: "Unisex", notes: ["Rose", "Saffron", "Coffee", "Patchouli"] },
    { brand: "Tom Ford", name: "Santal Blush", concentration: "EDP", releaseYear: 2011, genderTarget: "Unisex", notes: ["Sandalwood", "Rose", "Cinnamon", "Vanilla"] },
    { brand: "Tom Ford", name: "Velvet Orchid", concentration: "EDP", releaseYear: 2014, genderTarget: "Women", notes: ["Orchid", "Honey", "Vanilla", "Sandalwood"] },
    { brand: "Tom Ford", name: "Lost Cherry", concentration: "EDP", releaseYear: 2018, genderTarget: "Unisex", notes: ["Cherry", "Almond", "Rose", "Vanilla"] },
    { brand: "Tom Ford", name: "Bitter Peach", concentration: "EDP", releaseYear: 2020, genderTarget: "Unisex", notes: ["Peach", "Rum", "Patchouli", "Vanilla"] },

    // Creed Collection
    { brand: "Creed", name: "Aventus", concentration: "EDP", releaseYear: 2010, genderTarget: "Men", notes: ["Pineapple", "Black Currant", "Jasmine", "Musk", "Oakmoss"] },
    { brand: "Creed", name: "Green Irish Tweed", concentration: "EDT", releaseYear: 1985, genderTarget: "Men", notes: ["Lemon", "Iris", "Violet", "Sandalwood"] },
    { brand: "Creed", name: "Silver Mountain Water", concentration: "EDT", releaseYear: 1995, genderTarget: "Men", notes: ["Bergamot", "Green Tea", "Black Currant", "Sandalwood"] },
    { brand: "Creed", name: "Royal Oud", concentration: "EDP", releaseYear: 2011, genderTarget: "Men", notes: ["Oud", "Pink Pepper", "Sandalwood", "Cedar"] },
    { brand: "Creed", name: "Millesime Imperial", concentration: "EDT", releaseYear: 1995, genderTarget: "Men", notes: ["Bergamot", "Sea Salt", "Musk", "Sandalwood"] },
    { brand: "Creed", name: "Virgin Island Water", concentration: "EDT", releaseYear: 2007, genderTarget: "Unisex", notes: ["Lime", "Coconut", "Ginger", "Rum"] },
    { brand: "Creed", name: "Himalaya", concentration: "EDT", releaseYear: 2002, genderTarget: "Men", notes: ["Bergamot", "Grapefruit", "Cedar", "Musk"] },
    { brand: "Creed", name: "Bois du Portugal", concentration: "EDT", releaseYear: 1987, genderTarget: "Men", notes: ["Lavender", "Cedar", "Sandalwood", "Amber"] },
    { brand: "Creed", name: "Tabarome", concentration: "EDT", releaseYear: 1875, genderTarget: "Men", notes: ["Tobacco", "Ginger", "Cedar", "Amber"] },
    { brand: "Creed", name: "Original Santal", concentration: "EDT", releaseYear: 2007, genderTarget: "Men", notes: ["Sandalwood", "Cinnamon", "Ginger", "Vanilla"] },

    // Le Labo Collection
    { brand: "Le Labo", name: "Santal 33", concentration: "EDP", releaseYear: 2011, genderTarget: "Unisex", notes: ["Sandalwood", "Violet", "Leather", "Musk"] },
    { brand: "Le Labo", name: "Rose 31", concentration: "EDP", releaseYear: 2006, genderTarget: "Unisex", notes: ["Rose", "Cumin", "Cedar", "Musk"] },
    { brand: "Le Labo", name: "Bergamote 22", concentration: "EDT", releaseYear: 2006, genderTarget: "Unisex", notes: ["Bergamot", "Grapefruit", "Cedar", "Musk"] },
    { brand: "Le Labo", name: "Thé Noir 29", concentration: "EDP", releaseYear: 2015, genderTarget: "Unisex", notes: ["Black Tea", "Fig", "Cedar", "Tobacco"] },
    { brand: "Le Labo", name: "Patchouli 24", concentration: "EDP", releaseYear: 2006, genderTarget: "Unisex", notes: ["Patchouli", "Birch", "Vanilla", "Musk"] },
    { brand: "Le Labo", name: "Another 13", concentration: "EDP", releaseYear: 2010, genderTarget: "Unisex", notes: ["Ambergris", "Musk", "Jasmine", "Moss"] },
    { brand: "Le Labo", name: "Fleur d'Oranger 27", concentration: "EDP", releaseYear: 2006, genderTarget: "Unisex", notes: ["Orange Blossom", "Lemon", "Bergamot", "Musk"] },
    { brand: "Le Labo", name: "Lys 41", concentration: "EDP", releaseYear: 2012, genderTarget: "Unisex", notes: ["Lily", "Jasmine", "Tuberose", "Vanilla"] },
    { brand: "Le Labo", name: "Iris 39", concentration: "EDP", releaseYear: 2011, genderTarget: "Unisex", notes: ["Iris", "Rose", "Patchouli", "Musk"] },
    { brand: "Le Labo", name: "Vetiver 46", concentration: "EDP", releaseYear: 2006, genderTarget: "Unisex", notes: ["Vetiver", "Pepper", "Cedar", "Musk"] },

    // Maison Francis Kurkdjian Collection
    { brand: "Maison Francis Kurkdjian", name: "Baccarat Rouge 540", concentration: "EDP", releaseYear: 2015, genderTarget: "Unisex", notes: ["Saffron", "Jasmine", "Amber", "Cedar"] },
    { brand: "Maison Francis Kurkdjian", name: "Grand Soir", concentration: "EDP", releaseYear: 2016, genderTarget: "Unisex", notes: ["Benzoin", "Amber", "Vanilla", "Musk"] },
    { brand: "Maison Francis Kurkdjian", name: "Oud Satin Mood", concentration: "EDP", releaseYear: 2015, genderTarget: "Unisex", notes: ["Oud", "Rose", "Violet", "Vanilla"] },
    { brand: "Maison Francis Kurkdjian", name: "Amyris Homme", concentration: "EDP", releaseYear: 2012, genderTarget: "Men", notes: ["Amyris", "Bergamot", "Cedar", "Musk"] },
    { brand: "Maison Francis Kurkdjian", name: "Aqua Universalis", concentration: "EDT", releaseYear: 2009, genderTarget: "Unisex", notes: ["Bergamot", "Lemon", "Lily of the Valley", "Musk"] },
    { brand: "Maison Francis Kurkdjian", name: "Aqua Celestia", concentration: "EDT", releaseYear: 2017, genderTarget: "Unisex", notes: ["Lime", "Mint", "Mimosa", "Musk"] },
    { brand: "Maison Francis Kurkdjian", name: "L'Homme À La Rose", concentration: "EDP", releaseYear: 2020, genderTarget: "Men", notes: ["Rose", "Grapefruit", "Cedar", "Musk"] },
    { brand: "Maison Francis Kurkdjian", name: "724", concentration: "EDT", releaseYear: 2021, genderTarget: "Unisex", notes: ["Bergamot", "Jasmine", "Musk", "Cedar"] },
    { brand: "Maison Francis Kurkdjian", name: "Gentle Fluidity Gold", concentration: "EDP", releaseYear: 2019, genderTarget: "Unisex", notes: ["Juniper", "Cinnamon", "Vanilla", "Musk"] },
    { brand: "Maison Francis Kurkdjian", name: "Gentle Fluidity Silver", concentration: "EDP", releaseYear: 2019, genderTarget: "Unisex", notes: ["Juniper", "Coriander", "Musk", "Cedar"] },

    // Hermès Collection
    { brand: "Hermès", name: "Terre d'Hermès", concentration: "EDT", releaseYear: 2006, genderTarget: "Men", notes: ["Orange", "Grapefruit", "Flint", "Cedar"] },
    { brand: "Hermès", name: "Un Jardin en Méditerranée", concentration: "EDT", releaseYear: 2003, genderTarget: "Unisex", notes: ["Fig", "Orange", "Cedar", "Musk"] },
    { brand: "Hermès", name: "Un Jardin sur le Nil", concentration: "EDT", releaseYear: 2005, genderTarget: "Unisex", notes: ["Mango", "Grapefruit", "Lotus", "Cedar"] },
    { brand: "Hermès", name: "Twilly d'Hermès", concentration: "EDP", releaseYear: 2017, genderTarget: "Women", notes: ["Ginger", "Tuberose", "Sandalwood"] },
    { brand: "Hermès", name: "Jour d'Hermès", concentration: "EDP", releaseYear: 2013, genderTarget: "Women", notes: ["Gardenia", "Jasmine", "Sandalwood", "Musk"] },
    { brand: "Hermès", name: "Eau des Merveilles", concentration: "EDT", releaseYear: 2004, genderTarget: "Women", notes: ["Orange", "Amber", "Cedar", "Musk"] },
    { brand: "Hermès", name: "Kelly Caleche", concentration: "EDP", releaseYear: 2007, genderTarget: "Women", notes: ["Rose", "Jasmine", "Leather", "Musk"] },
    { brand: "Hermès", name: "Rocabar", concentration: "EDT", releaseYear: 1998, genderTarget: "Men", notes: ["Lavender", "Cedar", "Vanilla", "Amber"] },
    { brand: "Hermès", name: "Hiris", concentration: "EDT", releaseYear: 1999, genderTarget: "Women", notes: ["Iris", "Rose", "Cedar", "Musk"] },
    { brand: "Hermès", name: "Amazone", concentration: "EDT", releaseYear: 1974, genderTarget: "Women", notes: ["Rose", "Jasmine", "Oakmoss", "Sandalwood"] },

    // Yves Saint Laurent Collection
    { brand: "Yves Saint Laurent", name: "Opium", concentration: "EDP", releaseYear: 1977, genderTarget: "Women", notes: ["Mandarin", "Jasmine", "Vanilla", "Sandalwood"] },
    { brand: "Yves Saint Laurent", name: "Black Opium", concentration: "EDP", releaseYear: 2014, genderTarget: "Women", notes: ["Coffee", "Jasmine", "Vanilla", "Cedar"] },
    { brand: "Yves Saint Laurent", name: "Libre", concentration: "EDP", releaseYear: 2019, genderTarget: "Women", notes: ["Lavender", "Orange Blossom", "Vanilla", "Cedar"] },
    { brand: "Yves Saint Laurent", name: "Mon Paris", concentration: "EDP", releaseYear: 2016, genderTarget: "Women", notes: ["Strawberry", "Jasmine", "Patchouli", "Musk"] },
    { brand: "Yves Saint Laurent", name: "Y", concentration: "EDP", releaseYear: 2017, genderTarget: "Men", notes: ["Bergamot", "Ginger", "Sage", "Cedar"] },
    { brand: "Yves Saint Laurent", name: "L'Homme", concentration: "EDT", releaseYear: 2006, genderTarget: "Men", notes: ["Ginger", "Bergamot", "Cedar", "Musk"] },
    { brand: "Yves Saint Laurent", name: "La Nuit de L'Homme", concentration: "EDT", releaseYear: 2009, genderTarget: "Men", notes: ["Cardamom", "Cedar", "Cumin", "Musk"] },
    { brand: "Yves Saint Laurent", name: "Kouros", concentration: "EDT", releaseYear: 1981, genderTarget: "Men", notes: ["Lavender", "Jasmine", "Leather", "Musk"] },
    { brand: "Yves Saint Laurent", name: "Rive Gauche", concentration: "EDT", releaseYear: 1971, genderTarget: "Women", notes: ["Rose", "Jasmine", "Oakmoss", "Sandalwood"] },
    { brand: "Yves Saint Laurent", name: "Cinema", concentration: "EDP", releaseYear: 2004, genderTarget: "Women", notes: ["Mandarin", "Jasmine", "Vanilla", "Sandalwood"] },

    // Giorgio Armani Collection
    { brand: "Giorgio Armani", name: "Acqua di Gio", concentration: "EDT", releaseYear: 1996, genderTarget: "Men", notes: ["Bergamot", "Jasmine", "Cedar", "Musk"] },
    { brand: "Giorgio Armani", name: "Acqua di Gio Profumo", concentration: "EDP", releaseYear: 2015, genderTarget: "Men", notes: ["Bergamot", "Jasmine", "Patchouli", "Musk"] },
    { brand: "Giorgio Armani", name: "Code", concentration: "EDT", releaseYear: 2004, genderTarget: "Men", notes: ["Bergamot", "Lavender", "Tonka Bean", "Musk"] },
    { brand: "Giorgio Armani", name: "Emporio Armani", concentration: "EDT", releaseYear: 2003, genderTarget: "Men", notes: ["Bergamot", "Ginger", "Cedar", "Musk"] },
    { brand: "Giorgio Armani", name: "Armani Code", concentration: "EDT", releaseYear: 2004, genderTarget: "Men", notes: ["Bergamot", "Lavender", "Tonka Bean", "Musk"] },
    { brand: "Giorgio Armani", name: "Si", concentration: "EDP", releaseYear: 2013, genderTarget: "Women", notes: ["Black Currant", "Rose", "Vanilla", "Musk"] },
    { brand: "Giorgio Armani", name: "Armani Code for Her", concentration: "EDP", releaseYear: 2006, genderTarget: "Women", notes: ["Orange Blossom", "Jasmine", "Vanilla", "Sandalwood"] },
    { brand: "Giorgio Armani", name: "Diamonds", concentration: "EDP", releaseYear: 2010, genderTarget: "Women", notes: ["Rose", "Jasmine", "Vanilla", "Musk"] },
    { brand: "Giorgio Armani", name: "Mania", concentration: "EDT", releaseYear: 2002, genderTarget: "Men", notes: ["Bergamot", "Cinnamon", "Cedar", "Musk"] },
    { brand: "Giorgio Armani", name: "Attitude", concentration: "EDT", releaseYear: 2007, genderTarget: "Men", notes: ["Bergamot", "Ginger", "Cedar", "Musk"] },

    // Versace Collection
    { brand: "Versace", name: "Eros", concentration: "EDT", releaseYear: 2012, genderTarget: "Men", notes: ["Mint", "Green Apple", "Tonka Bean", "Vanilla"] },
    { brand: "Versace", name: "Dylan Blue", concentration: "EDT", releaseYear: 2016, genderTarget: "Men", notes: ["Bergamot", "Grapefruit", "Cedar", "Musk"] },
    { brand: "Versace", name: "The Dreamer", concentration: "EDT", releaseYear: 1996, genderTarget: "Men", notes: ["Lavender", "Tobacco", "Cedar", "Musk"] },
    { brand: "Versace", name: "Bright Crystal", concentration: "EDT", releaseYear: 2006, genderTarget: "Women", notes: ["Yuzu", "Peony", "Magnolia", "Musk"] },
    { brand: "Versace", name: "Crystal Noir", concentration: "EDP", releaseYear: 2004, genderTarget: "Women", notes: ["Ginger", "Peony", "Sandalwood", "Musk"] },
    { brand: "Versace", name: "Versense", concentration: "EDT", releaseYear: 2009, genderTarget: "Women", notes: ["Bergamot", "Jasmine", "Cedar", "Musk"] },
    { brand: "Versace", name: "Eros Pour Femme", concentration: "EDP", releaseYear: 2014, genderTarget: "Women", notes: ["Lemon", "Jasmine", "Sandalwood", "Musk"] },
    { brand: "Versace", name: "Man Eau Fraîche", concentration: "EDT", releaseYear: 2006, genderTarget: "Men", notes: ["Bergamot", "Cedar", "Musk", "Sage"] },
    { brand: "Versace", name: "Versace Pour Homme", concentration: "EDT", releaseYear: 2008, genderTarget: "Men", notes: ["Bergamot", "Neroli", "Cedar", "Musk"] },
    { brand: "Versace", name: "Signature", concentration: "EDT", releaseYear: 2010, genderTarget: "Men", notes: ["Bergamot", "Cedar", "Musk", "Amber"] }
  ];

  console.log(`Creating ${perfumes.length} perfumes...`);

  for (const perfume of perfumes) {
    const brandId = brandMap.get(perfume.brand);
    if (!brandId) {
      console.log(`Brand not found: ${perfume.brand}`);
      continue;
    }

    const created = await prisma.perfume.upsert({
      where: { 
        id: `${brandId}-${perfume.name}`
      },
      update: {},
      create: {
        id: `${brandId}-${perfume.name}`,
        name: perfume.name,
        concentration: perfume.concentration,
        releaseYear: perfume.releaseYear,
        genderTarget: perfume.genderTarget,
        brandId: brandId,
      },
    });

    // Add notes to the perfume
    for (const noteName of perfume.notes) {
      const note = await prisma.note.findFirst({ where: { name: noteName } });
      if (note) {
        const positions = ["top", "heart", "base"];
        const randomPosition = positions[Math.floor(Math.random() * positions.length)];
        
        await prisma.perfumeNote.create({
          data: {
            perfumeId: created.id,
            noteId: note.id,
            position: randomPosition as any
          }
        }).catch(() => {
          // Ignore duplicate key errors
        });
      }
    }
  }

  console.log("Seeded successfully!");
}

main().catch(e => { 
  console.error(e); 
  process.exit(1); 
}).finally(() => prisma.$disconnect());
