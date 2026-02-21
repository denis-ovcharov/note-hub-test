"use client";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import css from "./page.module.css";
import { useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import { useNotes } from "@/hooks/useNotes";
import { Note, NoteTag } from "@/types/note";

type Props = {
  tag: NoteTag;
};

function NotesClient({ tag }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  type ModalType = "create" | "edit" | null;
  const [isModalOpen, setIsModalOpen] = useState<ModalType>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { data, isSuccess } = useNotes(query, page, 9, tag);

  const updateQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setPage(1);
    },
    1000,
  );

  const notes = data?.notes || [];
  const totalPages = data?.totalPages ?? 1;

  const handleOpenCreateModal = () => {
    setIsModalOpen("create");
  };

  const handleOpenEditModal = (note: Note) => {
    setIsModalOpen("edit");
    setSelectedNote(note);
  };

  const handleCloseModal = () => {
    setIsModalOpen(null);
  };

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onSearch={updateQuery} />
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              page={page}
              onPageChange={setPage}
            />
          )}
          <button className={css.button} onClick={handleOpenCreateModal}>
            Create note +
          </button>
        </header>
        {notes.length > 0 && isSuccess && (
          <NoteList notes={notes} onEdit={handleOpenEditModal} />
        )}
      </div>
      {isModalOpen === "create" && (
        <Modal onClose={handleCloseModal}>
          <NoteForm mode="create" onClose={handleCloseModal} />
        </Modal>
      )}
      {isModalOpen === "edit" && selectedNote && (
        <Modal onClose={handleCloseModal}>
          <NoteForm mode="edit" note={selectedNote} onClose={handleCloseModal} />
        </Modal>
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default NotesClient;
