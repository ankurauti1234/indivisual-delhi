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
const PREFIX = process.env.AWS_S3_PREFIX || "data/"; // 👈 your folder prefix

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: PREFIX, // start inside "data/"
      Delimiter: "/", // return only folders directly under it
    });

    const data = await s3.send(command);

    console.log("S3 response for cities:", data);

    // Extract city names (strip "data/" and trailing "/")
    const cities =
      data.CommonPrefixes?.map((prefix) =>
        prefix.Prefix.replace(PREFIX, "").replace("/", "")
      ) || [];

    return NextResponse.json(cities);
  } catch (err) {
    console.error("Error listing cities:", err);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
