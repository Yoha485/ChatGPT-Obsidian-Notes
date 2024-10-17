#!/bin/bash

# Variables
IMAGE_NAME="yoha485/obsidian-notes-creator"
TAG=$1

# Assume that the image is already built with the tag and you already logged in to dockerhub
docker tag obsidian-notes-creator:$TAG $IMAGE_NAME:$TAG
docker tag obsidian-notes-creator:$TAG $IMAGE_NAME:latest
docker push $IMAGE_NAME:$TAG
docker push $IMAGE_NAME:latest