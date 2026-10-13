import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getThreads } from "../services/threads.service";
import { useDebounce } from "../hooks/useDebounce";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";

function ThreadList() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const debouncedSearch = useDebounce(search, 300);

  const {
    data = [],
    isPending,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["threads", { search: debouncedSearch, sort }],
    queryFn: ({ queryKey }) => getThreads(queryKey[1]),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return <p>Something went wrong while loading threads.</p>;
  }

  return (
    <div>
      <h2>Threads</h2>

      <SearchBar value={search} onChange={setSearch} />

      <SortDropdown value={sort} onChange={setSort} />

      {isPending ? (
        <p>Loading threads...</p>
      ) : (
        <>
          {isFetching && <p>Updating threads...</p>}

          {data.length === 0 ? (
            <p>No threads found.</p>
          ) : (
            <div>
              {data.map((thread, index) => (
                <article
                  key={thread.id ?? thread._id ?? index}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px",
                    marginTop: "12px",
                  }}
                >
                  <h3>{thread.title ?? "Untitled thread"}</h3>

                  {thread.content && <p>{thread.content}</p>}
                  {thread.body && <p>{thread.body}</p>}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ThreadList;