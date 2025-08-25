import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;
const PREFIX = process.env.AWS_S3_PREFIX || "data/"; // 👈 base folder inside bucket

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "city is required" }, { status: 400 });
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: `${PREFIX}${city}/`, // 👈 e.g. data/delhi/
      Delimiter: "/", // only return subfolders (weeks)
    });

    const data = await s3.send(command);

    console.log("S3 response for weeks:", data);

    const weeks = (data.CommonPrefixes || []).map((p) =>
      p.Prefix.replace(`${PREFIX}${city}/`, "").replace("/", "")
    );

    return NextResponse.json(weeks);
  } catch (err) {
    console.error("Error listing weeks:", err);
    return NextResponse.json(
      { error: "Failed to fetch weeks" },
      { status: 500 }
    );
  }
}
