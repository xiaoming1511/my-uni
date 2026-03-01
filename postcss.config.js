// postcss.config.js
export default {
  plugins: {
    "weapp-tailwindcss/postcss": {
      rem2rpx: true,
    },
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
