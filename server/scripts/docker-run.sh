VERSION=$1
OBSIDIAN_VAULT_PATH=$2

docker run -d -p 5050:5050 --env-file .env -v "$OBSIDIAN_VAULT_PATH:/vault" obsidian-notes-creator:$VERSION
