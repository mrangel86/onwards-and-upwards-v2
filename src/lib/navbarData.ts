export const navbarData = {
  logo: {
    url: "/",
    src: "/placeholder.svg",
    alt: "Onwards & Upwards",
    title: "ONWARDS & UPWARDS",
  },
  menu: [
    { title: "Home", url: "/" },
    {
      title: "Gallery",
      url: "#",
      items: [
        {
          title: "Photography",
          description: "Glimpses of life, frame by frame",
          url: "/gallery/photos",
        },
        {
          title: "Videography",
          description: "Little films from the road",
          url: "/gallery/videos",
        },
      ],
    },
    { title: "Blog", url: "/blog" },
    { title: "About Us", url: "/about" },
  ],
  auth: {
    login: { text: "Newsletter", url: "/newsletter" },
    signup: { text: "", url: "#" },
  },
};
