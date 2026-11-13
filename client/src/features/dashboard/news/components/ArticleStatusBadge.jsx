import { Badge } from "../../../../components/ui";

export default function ArticleStatusBadge({ status }) {
  const published = status === "published";

  return (
    <Badge
      variant={published ? "success" : "warning"}
      className="px-3 py-1 font-bold"
    >
      {published ? "Published" : "Draft"}
    </Badge>
  );
}
