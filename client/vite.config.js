import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import {validateEnv} from "./src/config/validate-env";

export default defineConfig(({mode}) => {
    validateEnv(loadEnv(mode, process.cwd(), ""));

    return {
        plugins: [
            react()
        ],
        resolve: {
            tsconfigPaths: true
        },
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://localhost:5000',
                    changeOrigin: true,
                    secure: false
                }
            }
        }
    };
});
