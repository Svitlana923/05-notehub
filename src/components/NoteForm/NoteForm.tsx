// src/components/NoteForm/NoteForm.tsx
import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService"; 
import { toast } from "react-hot-toast";

interface NoteFormProps {
  onCancel: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be no longer than 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: NoteFormValues) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created!");
      onCancel(); 
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={(values, { resetForm }) => {
        createMutation.mutate(values, {
          onSuccess: () => {
            resetForm();
          },
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <fieldset>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
              <FormikError name="title" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-content`}>Content</label>
              <Field as="textarea" id={`${fieldId}-content`} name="content" rows={8} className={css.textarea} />
              <FormikError name="content" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <FormikError name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button type="button" className={css.cancelButton} onClick={onCancel}>
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={createMutation.isPending || isSubmitting}
              >
                {createMutation.isPending ? "Creating..." : "Create note"}
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}
