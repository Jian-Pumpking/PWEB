const { createApp } = Vue;

function getPostIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "";
}

createApp({
  data() {
    return {
      post: null,
      postId: getPostIdFromQuery()
    };
  },
  methods: {
    async loadPost() {
      try {
        if (!window.BLOGS_DATA) {
          throw new Error("Blogs data global is missing");
        }
        const blogs = window.BLOGS_DATA;
        this.post = blogs.find((item) => item.id === this.postId) || null;

        if (this.post) {
          document.title = `${this.post.title} | 简彬 Jianbin`;
        }
      } catch (error) {
        console.error("Post loading error:", error);
      }
    },
    formatDate(value) {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
  },
  mounted() {
    this.loadPost();
  }
}).mount("#postApp");
