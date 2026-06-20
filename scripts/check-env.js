const fs = require("fs");
const path = require("path");

const requiredEnvVars = [
  "REACT_APP_SUPABASE_URL",
  "REACT_APP_SUPABASE_PUBLISHABLE_KEY",
];

function loadLocalEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) return;

  const envFile = fs.readFileSync(envPath, "utf8");

  envFile.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) return;

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) return;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadLocalEnv();

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  console.error("Missing required build environment variables:");
  missingEnvVars.forEach((name) => console.error(`- ${name}`));
  console.error(
    "Set them in Vercel Project Settings > Environment Variables, then redeploy without using the existing build cache."
  );
  process.exit(1);
}
