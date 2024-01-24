#!/usr/bin/env sh

# Build the React WebApp by using the `react-scripts` tools. Because they
# are part of the `react` package, we must execute the command through `npx`
# (npm exec).
# This produces a `build/` folder, in which the `index.html` is the React app.
echo "Building React WebApp"
npx react-scripts build

# Build the Quarto docs, from the `docs` folder. We want them to be produced
# in the `build/docs/` folder, where `build/` is the folder created by React.
# Note: the output dir is relative to the project dir, hence the `..`
echo "Building Quarto Docs"
quarto render docs --output-dir ../build/docs/
