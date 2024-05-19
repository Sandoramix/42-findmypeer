# 42Firenze - Find My Peer

This is a local web application created for 42 students at 42Firenze to locate their peers. It currently displays which PCs are occupied and by whom.

## Available Features

You can find your peer either from:

- [x] Table
- [x] Graphical rapresentation of clusters.
- [x] Graphical rapresentation of each cluster on a single page.

The search bar is useful for filtering peers by their intra's nickname or by filtering the cluster position (c`<cluster>`r`<row>`p`<pc>`).

## Getting Started

If you want to test this application you'll simply need to:

- Rename [`.env.example`](.env.example) which contains everything you need into `.env` and modify it to your needs.
- Configure the clusters inside [`clusters.json`](src/clusters.json) file
- Install npm packages with:
  ```bash
    npm install
  ```
- And finally you can start the application with:
  ```bash
    npm start
  ```
  
