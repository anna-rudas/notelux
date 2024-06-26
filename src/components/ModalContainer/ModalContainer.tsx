import React, { useContext } from "react";
import * as style from "./ModalContainer.module.css";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import { AppContext } from "../../context";
import { Formik, Form, FormikValues } from "formik";

type ModalContainerProps = {
  setIsModalOpen: (value: boolean) => void;
  title: string;
  subtitle?: string;
  primaryButtonText: string;
  children?: JSX.Element[] | JSX.Element;
  initialFormValues: object;
  validationSchema: object;
  handleSubmit: (v: FormikValues) => void;
};

function ModalContainer({
  children,
  handleSubmit,
  setIsModalOpen,
  title,
  subtitle,
  primaryButtonText,
  initialFormValues,
  validationSchema,
}: ModalContainerProps) {
  const { isLoading } = useContext(AppContext);

  return (
    <div {...className(style.confModalContainer)}>
      <div {...className(shared.shadow, style.confModal)}>
        <span {...className(shared.secondaryTitleText, style.modalText)}>
          {title}
        </span>
        <span
          {...className(
            shared.normalText,
            style.modalText,
            subtitle ? "" : shared.hide
          )}
        >
          {subtitle}
        </span>
        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            handleSubmit(values);
            resetForm();
            setSubmitting(false);
          }}
        >
          <Form noValidate {...className(style.inputsCon)}>
            <div {...className(style.inputsCon)}>{children}</div>
            <div {...className(style.confModalBtnsCon)}>
              <button
                disabled={isLoading}
                type="submit"
                {...className(
                  shared.btn,
                  shared.buttonPrimary,
                  style.btn,
                  isLoading ? shared.btnDisabled : ""
                )}
              >
                {primaryButtonText}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setIsModalOpen(false);
                }}
                {...className(
                  shared.btn,
                  shared.buttonSecondary,
                  style.btn,
                  isLoading ? shared.btnDisabled : ""
                )}
              >
                Cancel
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ModalContainer;
