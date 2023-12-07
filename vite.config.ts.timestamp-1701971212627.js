// vite.config.ts
import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
var vite_config_default = defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      events: "rollup-plugin-node-polyfills/polyfills/events",
    },
  },
  optimizeDeps: {
    exclude: ["@tableland/sqlparser", "stream/web", "util/types"],
  },
  build: {
    outDir: "./dist",
    target: "es2020",
    sourcemap: true,
  },
  server: {
    port: 3867,
    host: "0.0.0.0",
    fs: {
      allow: ["/"],
      strict: false,
    },
  },
  define: {
    "process.env": {},
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCByZWFjdFJlZnJlc2ggZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXJlZnJlc2hcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdFJlZnJlc2goKV0sXG4gIHJlc29sdmU6IHtcbiAgICBkZWR1cGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICAgIGFsaWFzOiB7XG4gICAgICAvLyBidWZmZXI6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvYnVmZmVyLWVzNlwiLCAvLyBhZGQgYnVmZmVyXG4gICAgICBldmVudHM6IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvZXZlbnRzXCIsXG4gICAgICAvLyBzdHJlYW06IFwicm9sbHVwLXBsdWdpbi1ub2RlLXBvbHlmaWxscy9wb2x5ZmlsbHMvc3RyZWFtXCIsXG4gICAgICAvLyB1dGlsOiBcInJvbGx1cC1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMvcG9seWZpbGxzL3V0aWxcIixcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbXCJAdGFibGVsYW5kL3NxbHBhcnNlclwiLCBcInN0cmVhbS93ZWJcIiwgXCJ1dGlsL3R5cGVzXCJdLFxuICB9LFxuICBidWlsZDoge1xuICAgIG91dERpcjogXCIuL2Rpc3RcIixcbiAgICB0YXJnZXQ6IFwiZXMyMDIwXCIsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzODY3LFxuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIGZzOiB7XG4gICAgICBhbGxvdzogW1wiL1wiXSxcbiAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgXCJwcm9jZXNzLmVudlwiOiB7fSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICBwb3N0Y3NzTmVzdGluZ1xuICAgICAgICBdLFxuICAgIH0sXG59LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsT0FBTyxrQkFBa0I7QUFDekIsU0FBUyxvQkFBb0I7QUFFN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLGFBQWEsQ0FBQztBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNQLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxJQUM3QixPQUFPO0FBQUEsTUFFTCxRQUFRO0FBQUEsSUFHVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyx3QkFBd0IsY0FBYyxZQUFZO0FBQUEsRUFDOUQ7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixPQUFPLENBQUMsR0FBRztBQUFBLE1BQ1gsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLENBQUM7QUFBQSxFQUNsQjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ0wsU0FBUztBQUFBLFFBQ0w7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDQSxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
