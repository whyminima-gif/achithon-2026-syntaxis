import { db } from "@/db";
import { analyses } from "@/db/schema";
import OpenAI from "openai";

export const dynamic = "force-dynamic";


type AnalysisRequestBody = {
  appName: string;
  manifestXml: string;
  privacyPolicy: string;
};

type AnalysisResult = {
  riskScore: number;
  riskLevel: string;
  headline: string;
  summary: string;
  permissionsOverview: string;
  unexpectedPermissions: string[];
  policySummary: string;
  actionRecommendation: string;
};

function extractPermissions(manifestXml: string): string[] {
  const regex = /<uses-permission[^>]*android:name\s*=\s*"([^"]+)"/gi;
  const permissions = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = regex.exec(manifestXml)) !== null) {
    if (match[1]) {
      permissions.add(match[1]);
    }
  }

  return Array.from(permissions);
}

function summarizeDangerousPermissions(permissions: string[]): string[] {
  const labels: string[] = [];
  const lowerJoined = permissions.join(" ").toLowerCase();

  if (/camera/.test(lowerJoined)) labels.push("Camera access");
  if (/record_audio/.test(lowerJoined) || /microphone/.test(lowerJoined)) labels.push("Microphone access");
  if (/access_fine_location/.test(lowerJoined) || /access_coarse_location/.test(lowerJoined) || /location/.test(lowerJoined))
    labels.push("Precise location");
  if (/read_contacts/.test(lowerJoined) || /write_contacts/.test(lowerJoined)) labels.push("Contacts");
  if (/read_sms/.test(lowerJoined) || /receive_sms/.test(lowerJoined) || /send_sms/.test(lowerJoined)) labels.push("SMS messages");
  if (/read_call_log/.test(lowerJoined) || /write_call_log/.test(lowerJoined)) labels.push("Call history");
  if (/read_external_storage/.test(lowerJoined) || /write_external_storage/.test(lowerJoined) || /manage_external_storage/.test(lowerJoined))
    labels.push("Files and media");
  if (/read_phone_state/.test(lowerJoined) || /read_phone_numbers/.test(lowerJoined)) labels.push("Device identity");

  if (labels.length === 0 && permissions.length > 0) {
    labels.push("Standard app permissions");
  }

  return Array.from(new Set(labels));
}

export async function POST(req: Request) {
  let body: AnalysisRequestBody;

  try {
    body = (await req.json()) as AnalysisRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { appName, manifestXml, privacyPolicy } = body;

  if (!appName || !manifestXml || !privacyPolicy) {
    return Response.json(
      { error: "appName, manifestXml, and privacyPolicy are required" },
      { status: 400 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured on the server" },
      { status: 500 },
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const permissions = extractPermissions(manifestXml);
  const dangerousPermissionLabels = summarizeDangerousPermissions(permissions);

  let aiResult: AnalysisResult;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a security and privacy assistant for non-technical users. Return a short, punchy JSON-only analysis of mobile app risks.",
        },
        {
          role: "user",
          content: JSON.stringify({
            appName,
            manifestXml,
            privacyPolicy,
            extractedPermissions: permissions,
            dangerousPermissionLabels,
          }),
        },
        {
          role: "system",
          content:
            "Always respond with a single JSON object with keys: riskScore (0-100), riskLevel (one of: low, medium, high), headline, summary, permissionsOverview, unexpectedPermissions (array of strings), policySummary, actionRecommendation. Keep text concise and friendly for non-technical people.",
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    aiResult = JSON.parse(content) as AnalysisResult;
  } catch (error) {
    console.error("OpenAI analysis error", error);
    return Response.json(
      { error: "Failed to analyze with OpenAI. Please try again." },
      { status: 500 },
    );
  }

  try {
    await db.insert(analyses).values({
      appName,
      manifestXml,
      privacyPolicy,
      permissions: { all: permissions, dangerousLabels: dangerousPermissionLabels },
      riskScore: aiResult.riskScore,
      riskLevel: aiResult.riskLevel,
    });
  } catch (error) {
    console.error("Failed to persist analysis", error);
  }

  return Response.json({
    appName,
    permissions,
    dangerousPermissionLabels,
    analysis: aiResult,
  });
}
