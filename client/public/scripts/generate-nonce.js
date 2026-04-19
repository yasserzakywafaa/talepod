const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR_NAME = "dist";
const INDEX_HTML_FILE_NAME = "index.html";
const NONCE_FILE_NAME = ".csp-nonce";
const CUSTOM_HEADERS_FILE_NAME = "customHttp.yml";
const NONCE_PLACEHOLDER = "%NONCE_PLACEHOLDER%";

const resolvePath = (...paths) => path.resolve(__dirname, ...paths);

const generateNonce = () => {
  const nonce = crypto.randomBytes(16).toString("base64");
  console.log(`[Nonce Script] Generated nonce: ${nonce}`);
  return nonce;
};

const directoryExists = (dirPath) =>
  fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();

const fileExists = (filePath) =>
  fs.existsSync(filePath) && fs.statSync(filePath).isFile();

const readFile = (filePath) => {
  if (!fileExists(filePath)) {
    throw new Error(`[Nonce Script] ERROR: File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
};

const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`[Nonce Script] Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error(`[Nonce Script] ERROR: Failed to write ${filePath}`, error);
  }
};

const findAllIndexHtmlFiles = (dir) => {
  /** @type {string[]} */
  const results = [];
  if (!directoryExists(dir)) {
    return results;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findAllIndexHtmlFiles(fullPath).forEach((p) => results.push(p));
    } else if (entry.isFile() && entry.name === INDEX_HTML_FILE_NAME) {
      results.push(fullPath);
    }
  }
  return results;
};

const injectNonceIntoIndexHtml = (indexHtml, nonce) => {
  let modifiedIndexHtml = indexHtml.split(NONCE_PLACEHOLDER).join(nonce);

  const scriptRegex = /(<script(?![^>]*\bnonce=)([^>]*))>/gi;
  const scriptReplacement = `$1 nonce="${nonce}">`;
  modifiedIndexHtml = modifiedIndexHtml.replace(scriptRegex, scriptReplacement);

  const styleRegex = /(<style(?![^>]*\bnonce=)([^>]*))>/gi;
  const styleReplacement = `$1 nonce="${nonce}">`;
  modifiedIndexHtml = modifiedIndexHtml.replace(styleRegex, styleReplacement);

  return modifiedIndexHtml;
};

const injectNonceIntoCustomHeaders = (customHeadersContent, nonce) =>
  customHeadersContent.replace(/nonce-\$NONCE/g, `nonce-${nonce}`);

const processBuildFiles = () => {
  console.log(`[Nonce Script] Started.`);

  const buildDir = resolvePath("..", "..", OUTPUT_DIR_NAME);
  const nonceFilePath = resolvePath(
    "..",
    "..",
    OUTPUT_DIR_NAME,
    NONCE_FILE_NAME,
  );
  const customHeadersPath = resolvePath(
    "..",
    "..",
    "..",
    CUSTOM_HEADERS_FILE_NAME,
  );

  if (!directoryExists(buildDir)) {
    console.error(
      `[Nonce Script] ERROR: Build directory not found: ${buildDir}`,
    );
    console.error(
      "[Nonce Script] Please run 'npm run build' or 'yarn build' first.",
    );
    process.exit(1);
  }
  console.log(`[Nonce Script] Build directory exists: ${buildDir}`);

  const nonce = generateNonce();

  const indexHtmlPaths = findAllIndexHtmlFiles(buildDir);
  if (indexHtmlPaths.length === 0) {
    console.error(
      `[Nonce Script] ERROR: No ${INDEX_HTML_FILE_NAME} files found under ${buildDir}`,
    );
    process.exit(1);
  }
  console.log(
    `[Nonce Script] Injecting nonce into ${indexHtmlPaths.length} HTML file(s)`,
  );
  for (const htmlPath of indexHtmlPaths) {
    let html = readFile(htmlPath);
    html = injectNonceIntoIndexHtml(html, nonce);
    writeFile(htmlPath, html);
  }

  if (fileExists(customHeadersPath)) {
    console.log(`[Nonce Script] customHttp.yml found at ${customHeadersPath}`);
    let customHeadersContent = readFile(customHeadersPath);
    customHeadersContent = injectNonceIntoCustomHeaders(
      customHeadersContent,
      nonce,
    );
    writeFile(customHeadersPath, customHeadersContent);
  } else {
    console.warn(
      `[Nonce Script] WARNING: customHttp.yml not found at ${customHeadersPath}`,
    );
  }

  writeFile(nonceFilePath, nonce);

  console.log(`[Nonce Script] Finished successfully.`);
};

processBuildFiles();
