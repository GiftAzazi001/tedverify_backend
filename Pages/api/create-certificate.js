import Airtable from "airtable";
import CryptoJS from "crypto-js";

const base = new Airtable({ apiKey: process.env.AIRTABLE_WRITE_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Only POST allowed" });

  const { studentName, course, institutionCode } = req.body;
  const random = Math.random().toString(36).substring(2,8).toUpperCase();
  const certificateID = `TED-${institutionCode}-${random}`;
  const hash = CryptoJS.SHA256(studentName + course + certificateID).toString();

  try {
    const record = await base("Certificates").create({ certificateID, studentName, course, hash });
    res.status(200).json({ certificateID, hash, airtableRecord: record.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}