import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note, NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";
import { tags } from "../../types/note";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { createNote, updateNote } from "../../lib/api";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useNoteDraftStore } from "@/lib/stores/noteStore";


interface InitialValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  mode: "create" | "edit";
  note?: Note;
  onClose: () => void;
}

export default function NoteForm({ mode, note, onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  // В режимі "create" — беремо значення з draft (Zustand),
  // в режимі "edit" — з існуючої нотатки
  const initialValues: InitialValues =
    mode === "create"
      ? {
          title: draft.title,
          content: draft.content,
          tag: draft.tag as NoteTag,
        }
      : {
          title: note?.title || "",
          content: note?.content || "",
          tag: note?.tag || "Work",
        };

  const { mutate: createMutate } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      onClose();
      toast.success("Note created successfully!");
    },
    onError() {
      toast.error("There was an error creating the note");
    },
  });

  const { mutate: editMutate } = useMutation({
    mutationFn: updateNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
      toast.success("Note edited successfully!");
    },
    onError() {
      toast.error("There was an error editing the note");
    },
  });

  const handleSubmit = (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>,
  ) => {
    if (mode === "create") {
      createMutate(values, {
        onSuccess: () => actions.resetForm(),
      });
    } else if (mode === "edit" && note?.id) {
      editMutate(
        { id: note.id, noteData: values },
        {
          onSuccess: () => actions.resetForm(),
        },
      );
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name is too long")
      .required("Name is required"),
    content: Yup.string().max(500, "Content is too long. Max 500 characters"),
    tag: Yup.string().oneOf(tags, "Invalid tag").required("Tag is required"),
  });

  return (
    <>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}

      >
        {({ isSubmitting, isValid, dirty, handleChange: formikHandleChange }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field
                id="title"
                type="text"
                name="title"
                className={css.input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  formikHandleChange(e); // оновлюємо Formik
                  if (mode === "create") {
                    setDraft({ ...draft, [e.target.name]: e.target.value }); // оновлюємо Zustand
                  }
                }}
              />
              <ErrorMessage
                component="span"
                name="title"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  formikHandleChange(e);
                  if (mode === "create") {
                    setDraft({ ...draft, [e.target.name]: e.target.value });
                  }
                }}
              />
              <ErrorMessage
                component="span"
                name="content"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field
                as="select"
                id="tag"
                name="tag"
                className={css.select}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  formikHandleChange(e);
                  if (mode === "create") {
                    setDraft({ ...draft, [e.target.name]: e.target.value });
                  }
                }}
              >
                {tags.map((tagOption) => (
                  <option key={tagOption} value={tagOption}>
                    {tagOption}
                  </option>
                ))}
              </Field>
              <ErrorMessage component="span" name="tag" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={
                  isSubmitting || (mode === "create" && !dirty) || !isValid
                }
              >
                {mode === "create" ? "Create note" : "Edit note"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

