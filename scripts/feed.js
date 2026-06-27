const FEEDS = [
  { title: "Thorsten Ball", url: "https://registerspill.thorstenball.com/feed" },
  { title: "Uros Popovic", url: "https://popovicu.com/rss.xml" },
  { title: "Kyla Scanlon", url: "https://kyla.substack.com/feed" },
  { title: "Sam Harris", url: "https://wakingup.libsyn.com/rss" },
  { title: "Pragmatic Engineer", url: "https://newsletter.pragmaticengineer.com/feed" },
  { title: "Evil Martians", url: "https://evilmartians.com/chronicles.atom" },
  { title: "Matt Bruenig", url: "https://mattbruenig.com/feed" },
];

const PROXY = 'https://corsproxy.io/?';
const CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_ITEMS = 50;
const DB_NAME = 'FeedCache';
const STORE = 'feeds';

let dbPromise;
function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'url' });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

async function readCache(url) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(url);
    req.onsuccess = () => {
      const entry = req.result;
      resolve(entry && Date.now() - entry.timestamp < CACHE_TTL_MS ? entry.data : null);
    };
    req.onerror = () => reject(req.error);
  });
}

async function writeCache(url, data) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE)
      .put({ url, data, timestamp: Date.now() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function parseXML(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('invalid XML');
  return doc;
}

async function fetchFeed(url) {
  const cached = await readCache(url);
  if (cached) {
    try { return parseXML(cached); } catch { /* refetch on bad cache */ }
  }
  const res = await fetch(PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const doc = parseXML(xml);
  await writeCache(url, xml);
  return doc;
}

// Atom entries may contain multiple <link> elements; prefer rel="alternate"
// or one without a rel. RSS <link> carries the URL as text content.
function extractLink(entry) {
  const links = [...entry.querySelectorAll('link')];
  const alt = links.find(l => {
    const rel = l.getAttribute('rel');
    return !rel || rel === 'alternate';
  }) ?? links[0];
  return alt?.getAttribute('href') || alt?.textContent?.trim() || '#';
}

function parseItems(feed, doc) {
  return [...doc.querySelectorAll('item, entry')].map(entry => {
    const dateStr = entry.querySelector('published, pubDate, updated')?.textContent;
    return {
      title: entry.querySelector('title')?.textContent?.trim() || '(untitled)',
      feed: feed.title,
      date: dateStr ? new Date(dateStr) : null,
      link: extractLink(entry),
    };
  });
}

async function loadFeed(feed) {
  try {
    return parseItems(feed, await fetchFeed(feed.url));
  } catch (err) {
    console.error(`Failed to load ${feed.url}:`, err);
    return [];
  }
}

function formatDate(d) {
  return [
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
    d.getFullYear(),
  ].join('/');
}

function buildRow(item) {
  const tr = document.createElement('tr');

  const dateCell = document.createElement('td');
  dateCell.className = 'date-col';
  dateCell.textContent = formatDate(item.date);
  tr.append(dateCell);

  const titleCell = document.createElement('td');
  const link = document.createElement('a');
  link.href = item.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = item.title;
  titleCell.append(link);
  tr.append(titleCell);

  const feedCell = document.createElement('td');
  feedCell.style.whiteSpace = 'nowrap';
  feedCell.textContent = item.feed;
  tr.append(feedCell);

  return tr;
}

function buildTable(items) {
  const table = document.createElement('table');
  table.innerHTML = `
    <colgroup><col><col><col></colgroup>
    <tr><th class="date-col">Date</th><th>Title</th><th>Feed</th></tr>
  `;
  for (const item of items) table.append(buildRow(item));
  return table;
}

// Kick off fetches before DOMContentLoaded so they overlap HTML parsing.
const itemsPromise = Promise.all(FEEDS.map(loadFeed));

async function render() {
  const lists = await itemsPromise;
  const items = lists.flat()
    .filter(it => it.date && !isNaN(it.date))
    .sort((a, b) => b.date - a.date)
    .slice(0, MAX_ITEMS);
  document.getElementById('content').replaceChildren(buildTable(items));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
