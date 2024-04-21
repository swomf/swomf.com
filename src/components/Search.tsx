import Fuse from "fuse.js";
import { useState } from "react";

// Configs fuse.js
// https://fusejs.io/api/options.html
const options = {
  keys: ["props.title", "props.description"],
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.5,
};

interface SearchProps {
  searchList: Record<string, any>[];
}

function Search({ searchList }: SearchProps) {
  // User's input
  const [query, setQuery] = useState("");

  const fuse = new Fuse(searchList, options);

  // Set a limit to the posts: 5
  const posts = fuse
    .search(query)
    .map(result => result.item)
    .slice(0, 5);

  function handleOnSearch({ target }: React.ChangeEvent<HTMLInputElement>) {
    setQuery(target.value);
  }

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={handleOnSearch}
        placeholder="Search posts"
        className="border p-1 bg-[var(--black)] focus:outline-none focus:border-[var(--accent)]"
      />
      {query.length > 1 && (
        <p>
          Found {posts.length} {posts.length === 1 ? "result" : "results"} for '
          {query}'
        </p>
      )}
      <ul>
        {posts &&
          posts.map(post => (
            <li key={post.props.title}>
              <a href={`/blog/${post.params.slug}`}>{post.props.title}</a>
              <p> {post.props.description} </p>
            </li>
          ))}
      </ul>
    </>
  );
}

export default Search;
