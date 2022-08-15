
clear


deno run                                    \
    --allow-read                            \
    --allow-write                           \
    --import-map=Tools/Formula/Imports.json \
    Tools/Formula/.js
