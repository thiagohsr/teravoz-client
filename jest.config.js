module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>frontend/.next/",
    "<rootDir>/node_modules/",
  ],
  snapshotSerializers: ["enzyme-to-json/serializer"],
};
