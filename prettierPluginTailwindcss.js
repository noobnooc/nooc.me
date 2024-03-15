let prettierPluginTailwindcss;

import('prettier-plugin-tailwindcss').then(module => {
  prettierPluginTailwindcss = module;
}).catch(err => {
  console.error('Failed to load prettier-plugin-tailwindcss', err);
});

module.exports = prettierPluginTailwindcss;