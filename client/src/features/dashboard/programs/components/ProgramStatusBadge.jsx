import { Badge } from "../../../../components/ui";

const executionStatus = {
  planned: {
    label: "Planned",
    variant: "warning",
  },
  ongoing: {
    label: "Ongoing",
    variant: "info",
  },
  completed: {
    label: "Completed",
    variant: "success",
  },
};

const publicationStatus = {
  draft: {
    label: "Draft",
    variant: "secondary",
  },
  published: {
    label: "Published",
    variant: "success",
  },
};

export function ExecutionStatusBadge({ status }) {
  const item = executionStatus[status] || executionStatus.planned;

  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function PublicationStatusBadge({ status }) {
  const item = publicationStatus[status] || publicationStatus.draft;

  return <Badge variant={item.variant}>{item.label}</Badge>;
}
