# Homepage image assets

The 14 photographs are original image fills downloaded through the official Figma MCP design context, not crops of page screenshots. The source is the desktop frame `2465:11054` on the `2435:7422` page of the supplied Website file.

`manifest.json` records the source node ID and the original pixel dimensions for each image. Originals are between 896 and 1376 pixels wide and were converted to WebP at quality 94 without resizing or upscaling. Layout crops are handled with CSS `object-fit: cover`.

The anniversary text is rendered as live HTML over the building photo; no breakpoint-specific screenshot composites are needed. Temporary Figma download URLs are not used at runtime or stored in the repository.
