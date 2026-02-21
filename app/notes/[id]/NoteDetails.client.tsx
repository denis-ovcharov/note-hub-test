"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import css from "./NoteDetails.module.css";

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error || !note) return <p>Some error..</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p>{note.content}</p>
        <p>
          <span className={css.text}>Created at: </span>
          {formatDate(note.createdAt)}
        </p>
        <p>
          <span className={css.text}>Last updated at: </span>
          {formatDate(note.updatedAt)}
        </p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
