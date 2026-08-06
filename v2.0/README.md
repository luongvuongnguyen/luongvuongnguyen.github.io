# Academic Personal Website

## Files
- `index.html`: page structure
- `styles.css`: academic light theme
- `app.js`: loads, filters, and renders publications
- `publications.csv`: publication database extracted from the original page

## Run locally
Because the browser fetches `publications.csv`, open the folder through a web server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Update publications
Add one row to `publications.csv` using these columns:
`status, year, type, title, authors, venue, publication_info, doi, url`.

Valid status examples: `Published`, `Accepted`, `In Review`.
