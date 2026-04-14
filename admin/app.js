const $ = (id) => document.getElementById(id);
let adminPass = localStorage.getItem("cms_pass") || "";
let editingId = "";

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-pass": adminPass,
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "请求失败");
  }
  return res.json();
}

function setMsg(el, text, ok = true) {
  el.textContent = text || "";
  el.className = ok ? "ok" : "err";
}

function fillForm(post = null) {
  editingId = post?.id || "";
  $("formTitle").textContent = editingId ? `编辑文章: ${editingId}` : "新建文章";
  $("id").value = post?.id || "";
  $("id").disabled = !!editingId;
  $("title").value = post?.title || "";
  $("date").value = post?.date || "";
  $("summary").value = post?.summary || "";
  $("tags").value = (post?.tags || []).join(", ");
  $("cover").value = post?.cover || post?.thumb || "";
  $("gallery").value = (post?.gallery || []).join("\n");
  $("content").value = (post?.content || []).join("\n");
  $("pinned").checked = !!post?.pinned;
}

function collectPost() {
  const cover = $("cover").value.trim();
  return {
    id: $("id").value.trim(),
    title: $("title").value.trim(),
    date: $("date").value,
    summary: $("summary").value.trim(),
    link: "#",
    pinned: $("pinned").checked,
    thumb: cover,
    cover,
    tags: $("tags").value.split(",").map((x) => x.trim()).filter(Boolean),
    gallery: $("gallery").value.split("\n").map((x) => x.trim()).filter(Boolean),
    content: $("content").value.split("\n").map((x) => x.trim()).filter(Boolean)
  };
}

async function loadList() {
  const list = $("list");
  list.innerHTML = "<small class='muted'>加载中...</small>";
  const blogs = await api("/api/blogs");

  if (!blogs.length) {
    list.innerHTML = "<small class='muted'>还没有文章</small>";
    return;
  }

  list.innerHTML = "";
  blogs.forEach((post) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div>
        <strong>${post.title}</strong>
        <br/>
        <small>${post.id} · ${post.date || ""} · ${(post.tags || []).join(", ")}</small>
      </div>
      <div class="tools">
        <button data-edit="${post.id}">编辑</button>
        <button data-del="${post.id}">删除</button>
      </div>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll("button[data-edit]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-edit");
      const blogsNow = await api("/api/blogs");
      const post = blogsNow.find((x) => x.id === id);
      if (post) fillForm(post);
    });
  });

  list.querySelectorAll("button[data-del]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-del");
      if (!confirm(`确认删除 ${id} ?`)) return;
      await api(`/api/blogs/${encodeURIComponent(id)}`, { method: "DELETE" });
      setMsg($("formMsg"), "删除成功", true);
      if (editingId === id) fillForm(null);
      await loadList();
    });
  });
}

async function tryLogin() {
  const pass = $("password").value.trim();
  if (!pass) return setMsg($("loginMsg"), "请输入密码", false);

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: pass })
  });

  if (!res.ok) {
    setMsg($("loginMsg"), "登录失败：密码不正确", false);
    return;
  }

  adminPass = pass;
  localStorage.setItem("cms_pass", pass);
  $("loginCard").classList.add("hidden");
  $("app").classList.remove("hidden");
  fillForm(null);
  await loadList();
}

$("loginBtn").addEventListener("click", () => tryLogin().catch((e) => setMsg($("loginMsg"), String(e), false)));
$("password").addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryLogin().catch((err) => setMsg($("loginMsg"), String(err), false));
});

$("saveBtn").addEventListener("click", async () => {
  try {
    const payload = collectPost();
    if (!payload.id || !payload.title) {
      return setMsg($("formMsg"), "id 和标题必填", false);
    }

    if (editingId) {
      await api(`/api/blogs/${encodeURIComponent(editingId)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setMsg($("formMsg"), "更新成功", true);
    } else {
      await api("/api/blogs", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setMsg($("formMsg"), "创建成功", true);
    }

    fillForm(null);
    await loadList();
  } catch (e) {
    setMsg($("formMsg"), `保存失败: ${e.message}`, false);
  }
});

$("resetBtn").addEventListener("click", () => {
  fillForm(null);
  setMsg($("formMsg"), "", true);
});

$("uploadBtn").addEventListener("click", async () => {
  const file = $("imageFile").files?.[0];
  if (!file) return setMsg($("formMsg"), "请选择图片", false);

  try {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "x-admin-pass": adminPass },
      body: fd
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    $("uploadResult").value = data.path;
    $("cover").value = data.path;
    setMsg($("formMsg"), "上传成功，已自动填入封面路径", true);
  } catch (e) {
    setMsg($("formMsg"), `上传失败: ${e.message}`, false);
  }
});

$("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("cms_pass");
  location.reload();
});

if (adminPass) {
  $("password").value = adminPass;
  tryLogin().catch(() => {});
}
