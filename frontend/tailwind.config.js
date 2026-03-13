/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cyber: {
                    bg: "#020617", // Deeper dark background
                    card: "#1E293B", // Card
                    cyan: "#00F5D4", // Accent Cyan
                    purple: "#7C3AED", // Accent Purple
                    red: "#F43F5E", // Alert Red
                    green: "#22C55E", // Success Green
                }
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif']
            }
        },
    },
    plugins: [],
}
