import express from "express";
import { ToolsService, tool, ParameterType } from "@optimizely-opal/opal-tools-sdk";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const toolsService = new ToolsService(app);

interface JSONInput {
  results: Record<string, any>;
}

export function convertJSONToCSV(parameters: JSONInput) {
  const results = parameters.results;

  const csvRows = [];
  const headers = Object.keys(results[0]);
  csvRows.push(headers.join(","));
  for (const row of results) {
    const values = headers.map(header => {
      const escaped = ("" + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
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
