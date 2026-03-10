import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_WRITE_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  const { certificateID } = req.query;
  if (!certificateID) return res.status(400).json({ message: "Certificate ID required" });

  const records = await base("Certificates").select({ filterByFormula: `{certificateID}='${certificateID}'` }).firstPage();

  if (records.length === 0) return res.status(404).json({ valid: false });

  res.status(200).json({ valid: true, certificate: records[0].fields });
}