import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  appName: text("app_name").notNull(),
  manifestXml: text("manifest_xml").notNull(),
  privacyPolicy: text("privacy_policy").notNull(),
  permissions: jsonb("permissions").default(null),
  riskScore: integer("risk_score"),
  riskLevel: text("risk_level"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
});
