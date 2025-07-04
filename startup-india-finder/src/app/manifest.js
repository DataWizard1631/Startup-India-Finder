export default function manifest() {
  return {
    name: "Startup India Finder",
    short_name: "Startup Finder",
    description: "Discover government funding schemes, policies, and hackathons for Indian startups",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
