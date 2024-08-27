import React, { useContext } from "react";
import * as style from "./ModalContainer.module.css";
import * as shared from "../../../assets/styles/shared.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import { className } from "../../../utilities/helpers";
import { Formik, Form, FormikValues } from "formik";
import PrimaryButton from "../../buttons/PrimaryButton";
import SecondaryButton from "../../buttons/SecondaryButton";
import { AppContext } from "../../../context/AppContext";
import { DashboardContext } from "../../../context/DashboardContext";
import { colors } from "../../../data/constants";

type ModalContainerProps = {
  handleCancel: () => void;
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
  handleCancel,
  title,
  subtitle,
  primaryButtonText,
  initialFormValues,
  validationSchema,
}: ModalContainerProps) {
  const { activeNote } = useContext(DashboardContext);
  const { user } = useContext(AppContext);

  return (
    <div {...className(style.confModalContainer)}>
      <div
        {...className(shared.shadow, style.confModal)}
        style={
          activeNote && user?.theme === "light"
            ? { backgroundColor: colors[activeNote.color] }
            : {}
        }
      >
        <span {...className(textStyles.subtitleText, textStyles.centerText)}>
          {title}
        </span>
        <span
          {...className(
            textStyles.normalText,
            textStyles.centerText,
            !subtitle && shared.hide
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
              <PrimaryButton
                buttonText={primaryButtonText}
                buttonStyle={style.btn}
              />
              <SecondaryButton
                buttonText="Cancel"
                handleClick={handleCancel}
                buttonStyle={style.btn}
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ModalContainer;
