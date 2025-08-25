import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;
const PREFIX = process.env.AWS_S3_PREFIX || "data/"; // 👈 base folder inside bucket

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const week = searchParams.get("week");
  const file = searchParams.get("file");

  if (!city || !week || !file) {
    return NextResponse.json(
      { error: "city, week, and file are required" },
      { status: 400 }
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: `${PREFIX}${city}/${week}/${file}`, // 👈 include data/
    });

    const data = await s3.send(command);
    const body = await streamToString(data.Body);

    return NextResponse.json(JSON.parse(body));
  } catch (err) {
    console.error("Error fetching file:", err);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}
