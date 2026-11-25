# Homepage image assets

The 14 photographs are original image fills downloaded through the official Figma MCP design context, not crops of page screenshots. The source is the desktop frame `2465:11054` on the `2435:7422` page of the supplied Website file.

`manifest.json` records the source node ID and the original pixel dimensions for each image. Originals are between 896 and 1376 pixels wide and were converted to WebP at quality 94 without resizing or upscaling. Layout crops are handled with CSS `object-fit: cover`.

The anniversary text is rendered as live HTML over the building photo; no breakpoint-specific screenshot composites are needed. Temporary Figma download URLs are not used at runtime or stored in the repository.

The product grid uses locally stored product visuals in `public/images/products/`.

- Hamrah Card promotional image from the [Sibbank listing](https://sibbank.ir/).
- Iran Card Platinum art from the [official Iran Card announcement](https://www.linkedin.com/posts/irancards_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86%DA%A9%D8%A7%D8%B1%D8%AA-%D8%A8%D8%A7%D9%86%DA%A9%D8%A2%DB%8C%D9%86%D8%AF%D9%87-%D8%A7%DB%8C%D8%B1%D8%A7%D9%86%DA%A9%D8%A7%D8%B1%D8%AA%D9%BE%D9%84%D8%A7%D8%AA%DB%8C%D9%86%DB%8C%D9%88%D9%85-activity-6873870912861593600-0udX). The tall artwork was cropped around the card for the landscape layout.
- Finnotech illustration from the [official Finnotech website](https://finnotech.ir/).

The solutions cards use Hamrah Card's card-to-card transfer visual from its [Myket listing](https://myket.ir/app/com.adpdigital.mbs.ayande), a portrait crop of the Iran Card Platinum artwork above, and the open banking illustration from [Finnotech](https://finnotech.ir/).
