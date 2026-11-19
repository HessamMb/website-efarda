import Image from "next/image";
import type { PostBlock } from "@/data/post-content";

export default function PostBlocks({ blocks }: { blocks: PostBlock[] }) {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "heading":
        return <h2 key={index} id={`section-${index + 1}`}>{block.text}</h2>;
      case "quote":
        return <blockquote key={index}>{block.text}</blockquote>;
      case "list":
        return (
          <ul key={index}>
            {block.text.split("\n").filter((line) => line.trim()).map((line, i) => <li key={i}>{line.trim()}</li>)}
          </ul>
        );
      case "image":
        return (
          <figure key={index}>
            <Image
              src={block.image.src}
              alt={block.image.alt}
              width={block.image.width}
              height={block.image.height}
              sizes="(max-width: 800px) 100vw, 850px"
              unoptimized={block.image.src.startsWith("/api/post-images/")}
            />
          </figure>
        );
      case "divider":
        return <hr key={index} />;
      case "paragraph":
        return <p key={index}>{block.text}</p>;
    }
  });
}
