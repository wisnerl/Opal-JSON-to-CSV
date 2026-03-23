import express from "express";
import { ToolsService, tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const toolsService = new ToolsService(app);

interface JSONInput {
  results: Array<Record<string, any>>;
}

export function convertJSONToCSV(parameters: JSONInput) {
  const results = parameters.results;

  const csvRows = [];
  const headers = Object.keys(results[0]);
  csvRows.push(headers.join(","));
  for (const row of results) {
    const values = headers.map(header => {
      const val = row[header] == null ? "" : String(row[header]);
      // RFC 4180: escape double-quotes by doubling them, then wrap if necessary
      if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvRows.push(values.join(","));
  }

  let result = {
    csv: csvRows.join("\n"),
  }

  return result;
}

tool({
  name: "json-to-csv",
  description: "Converts JSON data to CSV format.",
  parameters: [
    {
      name: "results",
      type: ParameterType.Dictionary,
      description: "JSON data to be converted to CSV format",
      required: true,
    },
  ],
})(convertJSONToCSV);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Discovery endpoint: http://localhost:${PORT}/discovery`);
});
