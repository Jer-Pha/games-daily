import fuzzysort from "fuzzysort";

function SearchBar({ onSearch }) {
  const handleSearch = (event) => {
    const results = fuzzysort.go(event.target.value, news, { key: "title" });
    onSearch(results);
  };

  // ... render search input ...
}
