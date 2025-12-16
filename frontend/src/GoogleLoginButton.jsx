import { useEffect } from "react";

const GoogleLoginButton = () => {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
      }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log("Google token:", response.credential);

    // Enviar token al backend
    const res = await fetch("http://localhost:3000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential: response.credential,
      }),
    });

    const data = await res.json();
    console.log("Respuesta backend:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login con Google OK");
    }
  };

  return <div id="googleSignInDiv"></div>;
};

export default GoogleLoginButton;
