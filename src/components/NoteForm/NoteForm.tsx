import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage} from "formik";
import type { FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup"; 
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import axios from "axios";

interface NoteFormProps {
  onCancel: () => void;
}

interface NoteFormValues {
  title: string,
  content: string,
  tag: string,
}

const initialValues: NoteFormValues = {
title: "", content: "", tag: "Todo" 
};

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content must be no longer then 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"), 
});


export default function NoteForm({ onCancel }: NoteFormProps) {
  const fieldId = useId();

    
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: async (newNote: NoteFormValues) => {
    const res = await axios.post(
      `${import.meta.env.VITE_NOTEHUB_BASE_URL}/notes`,
      newNote,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
        },
      }
    );
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  },
});

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    mutation.mutate(values, {
      onSuccess: () => {
        actions.resetForm();
        onCancel();
      },
    });
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className={css.form}>
          <fieldset>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field
                id={`${fieldId}-title`}
                type="text"
                name="title"
                className={css.input}
              />
              <ErrorMessage name="title" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-content`}>Content</label>
              <Field
                as="textarea"
                id={`${fieldId}-content`}
                name="content"
                rows={8}
                className={css.textarea}
              />
              <ErrorMessage name="content" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <Field
                as="select"
                id={`${fieldId}-tag`}
                name="tag"
                className={css.select}
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
              >
                Create note
              </button>
            </div>

          </fieldset>
        </Form>
      )}
    </Formik>
  );
}
