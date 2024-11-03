# 42Firenze - Find My Peer

This is a local web application created for 42 students at 42Firenze to locate their peers. It currently displays which PCs are occupied and by whom.


## Available Features

You can find your peer either from:

- [x] Table
- [x] Graphical representation of clusters.
- [x] Graphical representation of each cluster on a single page.

The search bar is very permissive.
It makes a partial lookup on these informations:

- Intra username
- Cluster position _c`<id>`r`<row>`p`<pc>`_ (e.g. `c1r2p3`, `c1`, `r2` or `p3`)

## Routes

- `/` : Homepage + where there is table and graphical representation of clusters
- `/cluster?id=<cluster_id>` : Graphical representation of a single cluster. If `id` is invalid or not provided, you'll get redirected to homepage

### API Endpoints

- **[GET]** `/api/peers/` : get information about all peers locations
- **[GET]** `/api/peers/mock` : get fake generated peers data. It accepts `density` parameter which accepts range from `0.0` to `1.0`
- **[GET]** `/api/clusters/` : get all clusters configurations
- **[GET]** `/api/clusters/<:id>` : get the cluster's configuration
- **[GET]** `/api/clusters/<cluster_id>/generate` : download the image of a single cluster's graphical representation.

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
