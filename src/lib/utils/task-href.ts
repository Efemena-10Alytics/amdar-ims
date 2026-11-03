import type { InternProjectTodo } from "@/features/interns-project/internship-project.types";

export function buildClassroomTaskHref({
  projectSlug,
  todoId,
  typeId,
}: {
  projectSlug: string;
  todoId: number;
  typeId?: number | null;
}) {
  const base = `/dashboard/internship-program/projects/${encodeURIComponent(projectSlug)}/classroom/${todoId}`;
  return typeId != null ? `${base}?type=${typeId}` : base;
}

export function getFirstTaskHref(
  projectSlug: string | null | undefined,
  todos: InternProjectTodo[] | undefined,
) {
  const slug = projectSlug?.trim();
  if (!slug || !todos?.length) return null;

  const firstTodo = [...todos].sort(
    (a, b) => a.week - b.week || a.sortOrder - b.sortOrder || a.id - b.id,
  )[0];
  if (!firstTodo) return null;

  const firstType = [...(firstTodo.types ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )[0];

  return buildClassroomTaskHref({
    projectSlug: slug,
    todoId: firstTodo.id,
    typeId: firstType?.id,
  });
}
