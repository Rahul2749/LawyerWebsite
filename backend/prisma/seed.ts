// prisma/seed.ts
// Seeds the database with initial data: services and default site settings.
// Run: npm run prisma:seed

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const services = [
  { name: "Property & Real Estate", slug: "property-real-estate", description: "Property disputes, title verification, and landlord-tenant matters.", icon: "building", price: 1000, duration: 60, displayOrder: 1 },
  { name: "Criminal Defence", slug: "criminal-defence", description: "Expert defence in criminal cases, bail applications, and trial representation.", icon: "shield", price: 1000, duration: 60, displayOrder: 2 },
  { name: "Civil Litigation", slug: "civil-litigation", description: "Representation in civil disputes, injunctions, and enforcement of rights.", icon: "gavel", price: 1000, duration: 60, displayOrder: 3 },
  { name: "Family Law", slug: "family-law", description: "Child custody, alimony, adoption, and family dispute resolution.", icon: "family", price: 1000, duration: 60, displayOrder: 4 },
  { name: "Divorce Law", slug: "divorce-law", description: "Mutual consent and contested divorce proceedings.", icon: "family", price: 1000, duration: 60, displayOrder: 5 },
  { name: "Corporate & Business", slug: "corporate-business", description: "Company registration, compliance, and end-to-end business support.", icon: "briefcase", price: 1000, duration: 60, displayOrder: 6 },
  { name: "Cyber Law", slug: "cyber-law", description: "Cybercrime complaints, online fraud, and data privacy violations.", icon: "laptop", price: 1000, duration: 60, displayOrder: 7 },
  { name: "Intellectual Property", slug: "intellectual-property", description: "Trademark, copyright, and patent registrations and infringement disputes.", icon: "star", price: 1000, duration: 60, displayOrder: 8 },
  { name: "Labour & Employment", slug: "labour-employment", description: "Wrongful termination, workplace disputes, and contract reviews.", icon: "users", price: 1000, duration: 60, displayOrder: 9 },
  { name: "Administrative Law", slug: "administrative-law", description: "Challenging government actions and handling regulatory disputes.", icon: "building", price: 1000, duration: 60, displayOrder: 10 },
  { name: "Taxation Law", slug: "taxation-law", description: "Income tax, GST disputes, and corporate tax planning.", icon: "briefcase", price: 1000, duration: 60, displayOrder: 11 },
  { name: "Consumer Protection", slug: "consumer-protection", description: "Defective products, service deficiencies, and unfair trade practices.", icon: "star", price: 1000, duration: 60, displayOrder: 12 },
  { name: "Environmental Law", slug: "environmental-law", description: "Clearances, pollution control board notices, and NGT matters.", icon: "building", price: 1000, duration: 60, displayOrder: 13 },
  { name: "Immigration Law", slug: "immigration-law", description: "Visa appeals, citizenship, and cross-border immigration issues.", icon: "users", price: 1000, duration: 60, displayOrder: 14 },
  { name: "Insurance Law", slug: "insurance-law", description: "Claim rejections, policy disputes, and motor accidents.", icon: "shield", price: 1000, duration: 60, displayOrder: 15 },
  { name: "Startup Law", slug: "startup-law", description: "Founders agreements, ESOPs, and funding documentation.", icon: "laptop", price: 1000, duration: 60, displayOrder: 16 },
  { name: "Business & Commercial Law", slug: "business-commercial", description: "Drafting commercial contracts, vendor agreements, and NDAs.", icon: "briefcase", price: 1000, duration: 60, displayOrder: 17 },
  { name: "NRI Legal Services", slug: "nri-legal-services", description: "Property management, OCI services, and special power of attorney.", icon: "users", price: 1000, duration: 60, displayOrder: 18 }
];

const siteSettings = [
  { key: "years_experience", value: "20", label: "Years of Experience" },
  { key: "cases_handled", value: "1500", label: "Cases Handled" },
  { key: "practice_areas", value: "8", label: "Practice Areas" },
  { key: "client_satisfaction", value: "98", label: "Client Satisfaction (%)" },
  { key: "lawyer_name", value: "Raja Agrawal", label: "Lawyer Name" },
  { key: "lawyer_phone", value: "+91 86053 99330", label: "Phone Number" },
  { key: "lawyer_email", value: "contact@rajaagrawal.in", label: "Email" },
  { key: "office_address", value: "Chamber No. 123, District Court Complex, New Delhi — 110001", label: "Office Address" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin user
  const passwordHash = await bcrypt.hash("Admin@123456", 12);
  await prisma.user.upsert({
    where: { email: "admin@rajaagrawal.in" },
    update: {},
    create: {
      email: "admin@rajaagrawal.in",
      passwordHash,
      name: "Raja Agrawal",
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Admin user created: admin@rajaagrawal.in / Admin@123456");
  console.log("   ⚠️  Change the password immediately after first login!");

  // Create services
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`✅ ${services.length} services seeded`);

  // Create site settings
  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, label: setting.label },
      create: setting,
    });
  }
  console.log(`✅ ${siteSettings.length} site settings seeded`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
