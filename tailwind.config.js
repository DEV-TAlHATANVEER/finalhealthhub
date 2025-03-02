/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite/plugin');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}', // Add Flowbite React content path
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite, // Add the Flowbite plugin
  ],
};
