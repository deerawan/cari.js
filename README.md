# Simple lunrjs vs elasticlunr benchmarking

### Curent results:

- Adding documents to search index
  - `Fastest is lunr#index.add`
- Simple search
  - `Fastest is lunr#index.search`
- Index Size for 5000 docs
  - The biggest size:
    - `index-elasticlunr-doc-copy.json`
  - The smallest size:
    - `index-lunr.json`
