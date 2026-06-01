const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

let initialized = false;

const resolveServiceAccountPath = (rawPath) => {
  const candidatePaths = [];

  if (path.isAbsolute(rawPath)) {
    candidatePaths.push(rawPath);
  } else {
    candidatePaths.push(path.resolve(process.cwd(), rawPath));
    candidatePaths.push(path.resolve(__dirname, "../../../", rawPath));
    candidatePaths.push(path.resolve(__dirname, "../../../../", rawPath));
  }

  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  return rawPath;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initFirebaseAdmin = () => {
  if (initialized) {
    return admin;
  }

  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.resolve(process.cwd(), "../service-account-key.json");
  const resolvedServiceAccountPath = resolveServiceAccountPath(serviceAccountPath);

  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(require(resolvedServiceAccountPath)),
      });
      logger.info("Firebase Admin SDK initialized successfully");
    } catch (error) {
      logger.error({
        message: "Firebase Admin SDK initialization failed",
        error: error.message,
        serviceAccountPath: resolvedServiceAccountPath,
        stack: error.stack,
      });
      throw error;
    }
  }

  initialized = true;
  return admin;
};

const getFirestore = () => {
  const adminClient = initFirebaseAdmin();
  return adminClient.firestore();
};

// Helper function to initialize and get the Firebase Auth Admin module
const getAuth = () => {
  const adminClient = initFirebaseAdmin();
  return adminClient.auth();
};

const withRetry = async (operation, options = {}) => {
  const { retries = 3, baseDelay = 1000, maxDelay = 4000 } = options;
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      logger.warn({
        message: `Firestore operation failed (attempt ${attempt}/${retries}), retrying in ${delay}ms`,
        error: error.message,
        code: error.code,
      });
      await sleep(delay);
    }
  }

  throw lastError;
};

module.exports = {
  getFirestore,
  getAuth,
  withRetry,
};