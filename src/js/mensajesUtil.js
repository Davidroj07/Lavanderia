export function mensajeerror(mensaje) {
    Swal.fire({
      title: "Error!",
      text: mensaje,
      icon: "error",
      confirmButtonText: "Ok",
    });
  }

  export function mensajeCorrecto(title,mensaje) {
    Swal.fire({
      title: title,
      text: mensaje,
      icon: "success"
    });
  }

export function registroCorrectoRuta(mensaje, ruta) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  Toast.fire({
    icon: 'success',
    title: mensaje
  }).then(() => {
    location.href = ruta;
  });
}
export function registroCorrecto(mensaje) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  Toast.fire({
    icon: 'success',
    title: mensaje
  });
}

export function registroConAlerta(mensaje) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  Toast.fire({
    icon: 'warning',
    title: mensaje
  });
}





