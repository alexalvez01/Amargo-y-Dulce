import ResetPasswordForm from '../components/ResetPasswordForm';


const ResetPasswordPage = () => {
  return (
    <div className="h-screen w-full flex bg-zinc-100 overflow-hidden">
      {/* Columna Izquierda: Componente del Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-transparent relative z-20">
        <ResetPasswordForm />
      </div>

      {/* Columna Derecha: Ilustración importada */}
      <div className="hidden lg:flex w-1/2 relative h-full justify-end">
        <img 
          src="/images/LoginPhoto.webp" 
          alt="Nueva contraseña Amargo y Dulce" 
          className="max-w-[80%] object-contain"
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;