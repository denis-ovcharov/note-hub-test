import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { NoteTag } from "@/types/note";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function Notes({ searchParams, params }: PageProps) {
  const { slug } = await params;
  const tag = (slug?.[0] ?? "all") as NoteTag;

  const resolvedSearch = await searchParams;

  const query = resolvedSearch?.query ?? "";
  const page = Number(resolvedSearch?.page ?? 1);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", query, page, tag],
    queryFn: () => fetchNotes(query, page, 9, tag),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
