import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const config = {
		plugins: [react()],
	}

	if (mode === "development") {
		config.server = {
			proxy: {
				"/api": {
					target: "http://localhost:5000",
				},
			},
		}
	}

	return config
})
