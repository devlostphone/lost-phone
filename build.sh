#!/bin/bash

# Sync static files to dist folder. Useful when running under npm run watch
rsync -avzhr ./static/ ./dist/
