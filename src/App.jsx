
import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("readingCollection")) || []
  );

  const [form, setForm] = useState({
    title: "",
    author: "",
    type: "Book",
    genre: "Romance",
    status: "Want to Read",
    rating: 0
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  function saveItems(updated) {
    setItems(updated);
    localStorage.setItem("readingCollection", JSON.stringify(updated));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editId !== null) {
      saveItems(items.map(item =>
        item.id === editId ? { ...form, id: editId } : item
      ));
      setEditId(null);
    } else {
      saveItems([...items, { ...form, id: Date.now() }]);
    }

    setForm({
      title: "", author: "", type: "Book",
      genre: "Romance", status: "Want to Read", rating: 0
    });
  }

  function handleEdit(item) {
    setForm({ ...item });
    setEditId(item.id);
  }

  function handleDelete(id) {
    if (window.confirm("Remove this from your collection?")) {
      saveItems(items.filter(item => item.id !== id));
      if (editId === id) {
        setEditId(null);
        setForm({
          title: "", author: "", type: "Book",
          genre: "Romance", status: "Want to Read", rating: 0
        });
      }
    }
  }

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || item.type === filter)
  );

  return (
    <div className="app">
      <header>
        <p className="tagline">YOUR PERSONAL READING UNIVERSE ✿</p>
        <h1>Between <span>Pages.</span></h1>
        <p>Every story deserves a place in your collection.</p>
      </header>

      <section className="stats">
        <div><strong>{items.length}</strong><p>Total Collection</p></div>
        <div><strong>{items.filter(i => i.status === "Reading").length}</strong><p>Currently Reading</p></div>
        <div><strong>{items.filter(i => i.status === "Completed").length}</strong><p>Completed</p></div>
      </section>

      <form className="book-form" onSubmit={handleSubmit}>
        <h2>{editId !== null ? "Edit Entry ✎" : "Add to Collection ♡"}</h2>

        <input placeholder="Title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} required />

        <input placeholder="Author / Artist" value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })} required />

        <div className="form-row">
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option>Book</option><option>Manga</option><option>Manhwa</option>
            <option>Manhua</option><option>Webtoon</option>
            <option>Light Novel</option><option>Comic</option><option>Other</option>
          </select>

          <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}>
            <option>Romance</option><option>Fantasy</option><option>Action</option>
            <option>Mystery</option><option>Horror</option><option>Comedy</option>
            <option>Drama</option><option>Other</option>
          </select>

          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option>Want to Read</option><option>Reading</option>
            <option>Completed</option><option>On Hold</option><option>Dropped</option>
          </select>

          <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
            <option value="0">No Rating</option>
            <option value="1">1 Star</option><option value="2">2 Stars</option>
            <option value="3">3 Stars</option><option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        <button type="submit">{editId !== null ? "Update Entry" : "Add Entry +"}</button>

        {editId !== null && (
          <button type="button" className="cancel" onClick={() => {
            setEditId(null);
            setForm({
              title: "", author: "", type: "Book",
              genre: "Romance", status: "Want to Read", rating: 0
            });
          }}>Cancel</button>
        )}
      </form>

      <section className="library">
        <div className="library-heading">
          <h2>My Collection ♡</h2>
          <input placeholder="Search titles..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>

        <select className="filter" value={filter}
          onChange={e => setFilter(e.target.value)}>
          <option>All</option><option>Book</option><option>Manga</option>
          <option>Manhwa</option><option>Manhua</option>
          <option>Webtoon</option><option>Light Novel</option>
          <option>Comic</option><option>Other</option>
        </select>

        <div className="book-grid">
          {filtered.map(item => (
            <article className="book-card" key={item.id}>
              <div className="book-cover">📚</div>
              <h3>{item.title}</h3>
              <p>by {item.author}</p>
              <span className="genre">{item.type} · {item.genre}</span>
              <p className="status">{item.status}</p>
              <p className="rating">{item.rating ? "★".repeat(item.rating) : "Not rated"}</p>
              <div className="actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <p className="empty">Your collection is waiting for its first story! ♡</p>
          )}
        </div>
      </section>

      <footer>Made with love & a little bookish magic ♡</footer>
    </div>
  );
}

export default App;
