import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    chrome.cookies.get(
      { url: "https://twitter.com", name: "ct0" },
      (response) => {
        let csrf_token = response.value;
        chrome.storage.local.get("optionsToken", function (result) {
          listKeywords(result.optionsToken, csrf_token)
            .then((r) => r.json())
            .then((result) => {
              setWords(result.muted_keywords);
            });
        });
      }
    );
  }, []);

  const list = words.map((item) => (
    <li
      key={item.id}
      className="flex justify-end gap-2 truncate pr-2 dark:text-white"
    >
      <div className="flex-wrap">{item.keyword}</div>
      <button
        className="rounded-full bg-red-500 px-1 py-0.5 text-white  hover:bg-red-100"
        type="button"
        onClick={(e) => {
          console.debug("clicked on remove word button");
          testDestroy(item.id);
          const filtered = words.filter((obj) => obj.id != item.id);
          setWords(filtered);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </li>
  ));

  return (
    <>
      <ul className="mt-2 list-none space-y-2 ">{list}</ul>
    </>
  );
}

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

function listKeywords(bearerToken, csrfToken) {
  return fetch("https://twitter.com/i/api/1.1/mutes/keywords/list.json", {
    headers: {
      authorization: `Bearer ${bearerToken}`,
      "content-type": "application/x-www-form-urlencoded",
      "x-csrf-token": csrfToken,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "x-twitter-client-language": "en",
    },

    method: "GET",
  });
}

function destroyWord(id, bearerToken, csrfToken) {
  // https://twitter.com/i/api/1.1/mutes/keywords/destroy.json

  return fetch("https://twitter.com/i/api/1.1/mutes/keywords/destroy.json", {
    headers: {
      authorization: `Bearer ${bearerToken}`,
      "content-type": "application/x-www-form-urlencoded",
      "x-csrf-token": csrfToken,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "x-twitter-client-language": "en",
    },

    body: `ids=${id}`,
    method: "POST",
  });
}

function testDestroy(id) {
  chrome.cookies.get(
    { url: "https://twitter.com", name: "ct0" },
    (response) => {
      let csrf_token = response.value;

      chrome.storage.local.get("optionsToken", function (result) {
        destroyWord(id, result.optionsToken, csrf_token)
          .then((res) => {
            console.debug("removing word", res);
          })
          .catch((err) => console.error(err));
      });
    }
  );
}
