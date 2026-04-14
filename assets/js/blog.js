const { createApp } = Vue;

createApp({
  data() {
    return {
      posts: window.BLOGS_DATA || [],
      activeTag: "",
      activeYear: "",
      searchQuery: "",
      currentPage: 1,
      pageSize: 4
    };
  },
  computed: {
    sortedPosts() {
      return [...this.posts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    allTags() {
      return [...new Set(this.posts.flatMap((item) => item.tags || []))];
    },
    allYears() {
      return [
        ...new Set(
          this.posts
            .map((item) => String(item.date || "").slice(0, 4))
            .filter(Boolean)
        )
      ].sort((a, b) => Number(b) - Number(a));
    },
    filteredPosts() {
      return this.sortedPosts.filter((post) => {
        const byTag = this.activeTag ? (post.tags || []).includes(this.activeTag) : true;
        const byYear = this.activeYear ? String(post.date || "").startsWith(this.activeYear) : true;
        const q = this.searchQuery.toLowerCase();
        const fullText = `${post.title || ""} ${post.summary || ""} ${(post.tags || []).join(" ")}`.toLowerCase();
        const bySearch = q ? fullText.includes(q) : true;
        return byTag && byYear && bySearch;
      });
    },
    pinnedPosts() {
      return this.filteredPosts.filter((post) => post.pinned);
    },
    normalPosts() {
      return this.filteredPosts.filter((post) => !post.pinned);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.normalPosts.length / this.pageSize));
    },
    pagedPosts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.normalPosts.slice(start, start + this.pageSize);
    }
  },
  watch: {
    activeTag() {
      this.currentPage = 1;
    },
    activeYear() {
      this.currentPage = 1;
    },
    searchQuery() {
      this.currentPage = 1;
    },
    totalPages(next) {
      if (this.currentPage > next) {
        this.currentPage = next;
      }
    }
  },
  methods: {
    formatDate(value) {
      if (!value) return "";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    }
  },
  mounted() {
    document.title = "Blog | Jianbin";
  }
}).mount("#blogApp");

