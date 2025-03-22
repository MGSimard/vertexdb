await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  experimental: {
    reactCompiler: true,
  },
};

export default config;
