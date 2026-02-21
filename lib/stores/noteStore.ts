import { create } from "zustand";
import { NoteData } from "../api";
import { persist } from "zustand/middleware";

type NoteDraftStore = {
  draft: NoteData;
  setDraft: (note: NoteData) => void;
  clearDraft: () => void;
};

const initialDraft: NoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "note-draft",
    },
  ),
);
