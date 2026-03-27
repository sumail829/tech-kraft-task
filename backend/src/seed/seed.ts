import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "../config/data-source";
import { Agent } from "../entities/agent";
import { Property } from "../entities/property";

dotenv.config();

const seed = async () => {
  await AppDataSource.initialize();
  console.log("✅ DB connected");

  const agentRepo = AppDataSource.getRepository(Agent);
  const propertyRepo = AppDataSource.getRepository(Property);

 
  await propertyRepo.query(`TRUNCATE TABLE "property" RESTART IDENTITY CASCADE`);
await agentRepo.query(`TRUNCATE TABLE "agent" RESTART IDENTITY CASCADE`);
  console.log("  Cleared existing data");

  const agents = agentRepo.create([
    {
      name: "Sarah Johnson",
      email: "sarah@realestate.com",
      phone: "0412 345 678",
      is_admin: true,
    },
    {
      name: "Mike Thompson",
      email: "mike@realestate.com",
      phone: "0423 456 789",
      is_admin: false,
    },
    {
      name: "Emily Chen",
      email: "emily@realestate.com",
      phone: "0434 567 890",
      is_admin: false,
    },
    {
      name: "James Wilson",
      email: "james@realestate.com",
      phone: "0445 678 901",
      is_admin: true,
    },
  ]);

  const savedAgents = await agentRepo.save(agents);
  console.log(`✅ Seeded ${savedAgents.length} agents`);

  const properties = propertyRepo.create([
    {
      title: "Modern Family Home in Northside",
      description: "Spacious modern home with open plan living, updated kitchen and large backyard. Perfect for families.",
      suburb: "Northside",
      propertyType: "house",
      price: 850000,
      beds: 4,
      baths: 2,
      internalStatusNotes: "Vendor motivated to sell quickly. Will accept offers above $820k.",
      agent: savedAgents[0],
    },
    {
      title: "Stylish City Apartment",
      description: "Contemporary apartment in the heart of the city with stunning views and modern finishes throughout.",
      suburb: "CBD",
      propertyType: "apartment",
      price: 520000,
      beds: 2,
      baths: 1,
      internalStatusNotes: "Tenant in place until March. Good investment opportunity.",
      agent: savedAgents[1],
    },
    {
      title: "Cozy Cottage Near River",
      description: "Charming cottage with original character features, renovated bathroom and stunning river views.",
      suburb: "Riverside",
      propertyType: "house",
      price: 620000,
      beds: 3,
      baths: 1,
      internalStatusNotes: "Some foundation work required. Priced accordingly.",
      agent: savedAgents[2],
    },
    {
      title: "Executive Townhouse Northside",
      description: "Brand new executive townhouse with premium finishes, double garage and private courtyard.",
      suburb: "Northside",
      propertyType: "townhouse",
      price: 975000,
      beds: 4,
      baths: 3,
      internalStatusNotes: "Part of a new development. 3 remaining in the complex.",
      agent: savedAgents[0],
    },
    {
      title: "Investment Unit in Eastville",
      description: "Well-maintained investment unit in a sought-after complex with pool and gym facilities.",
      suburb: "Eastville",
      propertyType: "apartment",
      price: 395000,
      beds: 1,
      baths: 1,
      internalStatusNotes: "Currently rented at $380/week. Lease expires June.",
      agent: savedAgents[3],
    },
    {
      title: "Heritage Home Westend",
      description: "Stunning heritage-listed home with original pressed metal ceilings, polished floors and wraparound verandah.",
      suburb: "Westend",
      propertyType: "house",
      price: 1200000,
      beds: 5,
      baths: 3,
      internalStatusNotes: "Heritage overlay - renovations require council approval.",
      agent: savedAgents[1],
    },
    {
      title: "Riverside Studio Apartment",
      description: "Compact and stylish studio perfect for first home buyers or investors. Walking distance to cafes and transport.",
      suburb: "Riverside",
      propertyType: "apartment",
      price: 280000,
      beds: 1,
      baths: 1,
      internalStatusNotes: "Body corp fees are high. Disclose to buyers.",
      agent: savedAgents[2],
    },
    {
      title: "Luxury Penthouse CBD",
      description: "Breathtaking penthouse with 270-degree city views, rooftop terrace, and fully automated smart home system.",
      suburb: "CBD",
      propertyType: "apartment",
      price: 2100000,
      beds: 3,
      baths: 2,
      internalStatusNotes: "High-profile vendor - maintain strict confidentiality.",
      agent: savedAgents[0],
    },
    {
      title: "Family Villa Eastville",
      description: "Immaculate family villa in a quiet street. Freshly painted, new carpets and a beautifully landscaped garden.",
      suburb: "Eastville",
      propertyType: "house",
      price: 760000,
      beds: 4,
      baths: 2,
      internalStatusNotes: "Sellers relocating interstate — flexible settlement terms.",
      agent: savedAgents[3],
    },
    {
      title: "Affordable Townhouse Westend",
      description: "Low-maintenance townhouse ideal for downsizers or investors. End unit with extra windows and natural light.",
      suburb: "Westend",
      propertyType: "townhouse",
      price: 490000,
      beds: 2,
      baths: 2,
      internalStatusNotes: "Vendor open to vendor finance arrangements.",
      agent: savedAgents[1],
    },
    {
      title: "New Build Home Northside",
      description: "Brand new 4-bedroom home with solar panels, rainwater tank and energy-efficient design throughout.",
      suburb: "Northside",
      propertyType: "house",
      price: 920000,
      beds: 4,
      baths: 2,
      internalStatusNotes: "Builder warranty still active for 5 years.",
      agent: savedAgents[2],
    },
    {
      title: "Waterfront Apartment Riverside",
      description: "Rare waterfront apartment with direct river access, private jetty and resort-style complex amenities.",
      suburb: "Riverside",
      propertyType: "apartment",
      price: 1450000,
      beds: 3,
      baths: 2,
      internalStatusNotes: "Flood zone — insurance premium is elevated. Must disclose.",
      agent: savedAgents[3],
    },
  ]);

  const savedProperties = await propertyRepo.save(properties);
  console.log(`✅ Seeded ${savedProperties.length} properties`);

  await AppDataSource.destroy();
  console.log("🎉 Seeding complete!");
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});