"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { Note } from "@/types/note";

const NotePreviewClient = () => {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error || !note) return <p>Some error..</p>;

  const handleClose = () => {
    router.back();
  };
  return (
    <Modal onClose={handleClose}>
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
        <button className={css.backBtn} onClick={handleClose}>
          Back
        </button>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
