import { useState, useMemo } from "react";
import { addHours, differenceInSeconds } from "date-fns";
import Swal from "sweetalert2";

export const useModal = () => {
  const [formValues, setFormValues] = useState({
    title: "Daniel",
    notes: "Herrera",
    start: new Date(),
    end: addHours(new Date(), 2),
  });

  const [isOpen, setIsOpen] = useState(true);
  const [formSubmited, setFormSubmited] = useState(false);

  const titleClass = useMemo(() => {
    if (!formSubmited) {
      return "";
    }

    return formValues.title.length > 0 ? "" : "is-invalid";
  }, [formValues.title, formSubmited]);

  const onDateChange = (event, changing) => {
    setFormValues({ ...formValues, [changing]: event });
  };

  const onInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmited(true);
    const difference = differenceInSeconds(formValues.end, formValues.start);

    const { start, end, title } = formValues;

    if (!start || !end) {
      Swal.fire(
        "Fechas incorrectas",
        "El campo de la fecha es obligatorio",
        "error"
      );
      return;
    }

    if (isNaN(difference) || difference <= 0) {
      Swal.fire("Fechas incorrectas", "Revisar las fechas ingresadas", "error");
      return;
    }

    if (title.trim().length <= 0) {
      Swal.fire("Título incorrecto", "Revisar el título ingresado", "error");
      return;
    }

    console.log("Formulario válido:", formValues);

    //TODO:
    //cerrar modal, remover errores en pantalla y cerrar modal
  };

  const onCloseModal = () => setIsOpen(false);

  return {
    formValues,
    onInputChange,
    onDateChange,
    onSubmit,
    titleClass,
    isOpen,
    onCloseModal,
  };
};
