// postcss.config.cjs
// Using .cjs extension because package.json has "type": "module"
// This forces Node.js to treat this file as CommonJS (module.exports syntax)
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
