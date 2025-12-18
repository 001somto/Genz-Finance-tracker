import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
    // Disable Tailwind's preflight (base styles) to prevent vertical-align issues
    // We'll keep our custom reset in index.css
    theme: {
        // Your custom theme configuration can go here
    },
})
