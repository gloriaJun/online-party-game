import type { Preview } from "@storybook/react";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { addons } from "@storybook/preview-api";

import "../src/styles/base-theme.css";

// Sync storybook-dark-mode toggle with .dark class on <body>
const channel = addons.getChannel();
channel.on(DARK_MODE_EVENT_NAME, (isDark: boolean) => {
  document.body.classList.toggle("dark", isDark);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      classTarget: "body",
      darkClass: "dark",
      lightClass: "",
      stylePreview: true,
    },
  },
};

export default preview;
