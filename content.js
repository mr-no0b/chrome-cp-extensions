(async function() {
  // --- 1. Fetch the full problem set from Codeforces API ---
  const problemRatingMap = {};
  try {
    const response = await fetch("https://codeforces.com/api/problemset.problems");
    const data = await response.json();
    if (data.status === "OK") {
      console.log("Problemset loaded");
      for (const problem of data.result.problems) {
        const key = `${problem.contestId}-${problem.index}`;
        if (problem.rating) {
          problemRatingMap[key] = problem.rating;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch problems from CF API:", error);
    // we'll fall back to showing N/A
  }

  // --- 2. Find the status table ---
  const table = document.querySelector(".status-frame-datatable");
  if (!table) return;

  // --- 3. Insert a new "Rating" column header ---
  const theadRow = table.querySelector("thead tr");
  if (theadRow) {
    const ratingHeader = document.createElement("th");
    ratingHeader.textContent = "Rating";
    theadRow.appendChild(ratingHeader);
  }

  // --- 4. Process each row in the table body and insert rating ---
  const rows = table.querySelectorAll("tbody tr");
  rows.forEach(row => {
    // Problem link is in the 4th cell
    const link = row.querySelector("td:nth-child(4) a");
    let ratingText = "N/A";

    if (link) {
      const href = link.getAttribute("href");
      // e.g. "/problemset/problem/1987/E" → ["", "problemset","problem","1987","E"]
      const parts = href.split("/");
      const contestId = parts[3];
      const index     = parts[4];
      const key       = `${contestId}-${index}`;

      if (problemRatingMap[key]) {
        ratingText = problemRatingMap[key];
      }
    }

    const td = document.createElement("td");
    td.textContent = ratingText;
    if (ratingText !== "N/A") {
      td.style.fontWeight = "bold";
    }
    row.appendChild(td);
  });
})();

