import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import weappTailwindcss from "weapp-tailwindcss/vite";

export default defineConfig({
  plugins: [uni(), weappTailwindcss()],
  css: {
    postcss: {
      plugins: [
        require("@tailwindcss/postcss")({}),
        require("autoprefixer")({}),
      ],
    },
  },
});
