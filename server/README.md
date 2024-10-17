# Obsidian Notes Creator

This is a dedicated server for creating notes in Obsidian. It is a simple REST API that allows you to create md files in a specified directory. This specified directory should happen to be your Obsidian vault.

## How to run

Run the following command to start the server:

```sh
docker run -d \
  -p 5050:5050 \
  -e OBSIDIAN_VAULT_PATH=/vault \
  -v "<path_to_your_vault>:/vault" \
  yoha485/obsidian-notes-creator:latest
```

It will pull the Docker image and start the server on port 5050. The server will create notes in the directory specified by the `OBSIDIAN_VAULT_PATH` environment variable. The `PORT` environment variable is optional and defaults to 5050. The `-v` flag is used to mount the Obsidian vault directory to the container.
