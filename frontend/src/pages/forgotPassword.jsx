import ForgotPasswordForm from '../components/forgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <div className="h-screen w-full flex bg-zinc-100 overflow-hidden">
      {/* Columna Izquierda: Acá inyectamos el componente del formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-transparent relative z-20">
        <ForgotPasswordForm />
      </div>

      {/* Columna Derecha: Ilustración importada */}
        <div className="hidden lg:flex w-1/2 relative h-full justify-end">

            <img 
            src="/images/loginPhoto.webp" 
            alt="Ilustración compra" 
            className="h-full w-auto object-contain z-10 mix-blend-multiply"
            />
        </div>
    </div>
  );
};

export default ForgotPasswordPage;