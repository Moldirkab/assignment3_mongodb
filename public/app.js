const API = "/blogs";
const blogsContainer = document.getElementById("blogs");
const form = document.getElementById("blogForm");
const errorMsg = document.getElementById("errorMsg");

let editId = null;

async function loadBlogs() {
    try {
        const res = await fetch(API);
        const blogs = await res.json();
        blogsContainer.innerHTML = "";

        blogs.forEach(blog => {
            const div = document.createElement("div");
            div.className = "blog-card";

            div.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.body}</p>
                <small>Author: ${blog.author || "Anonymous"} | Created: ${new Date(blog.createdAt).toLocaleString()}</small>
                <div class="buttons">
                    <button class="edit" onclick="editBlog('${blog._id}')">Edit</button>
                    <button class="delete" onclick="deleteBlog('${blog._id}')">Delete</button>
                </div>
            `;
            blogsContainer.appendChild(div);
        });
    } catch (err) {
        errorMsg.textContent = "Error loading blogs";
    }
}

form.addEventListener("submit", async e => {
    e.preventDefault();
    errorMsg.textContent = "";

    const blogData = {
        title: document.getElementById("title").value,
        body: document.getElementById("body").value,
        author: document.getElementById("author").value || "Anonymous"
    };

    try {
        const method = editId ? "PUT" : "POST";
        const url = editId ? `${API}/${editId}` : API;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blogData)
        });

        if (!res.ok) throw new Error("Failed to save blog");

        editId = null;
        form.reset();
        loadBlogs();
    } catch (err) {
        errorMsg.textContent = err.message;
    }
});

async function editBlog(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const blog = await res.json();
        document.getElementById("title").value = blog.title;
        document.getElementById("body").value = blog.body;
        document.getElementById("author").value = blog.author;
        editId = id;
    } catch {
        errorMsg.textContent = "Error loading blog";
    }
}

async function deleteBlog(id) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        loadBlogs();
    } catch {
        errorMsg.textContent = "Error deleting blog";
    }
}
loadBlogs();
