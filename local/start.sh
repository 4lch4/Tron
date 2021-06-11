#!/bin/bash

# This script will startup Tron as long as the image and secrets are present on
# the machine.

docker run -d --env-file prod.env --name tron ghcr.io/4lch4/tron:latest
