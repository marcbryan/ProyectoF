export interface IAuthService {
    
    /**
     * Función que llama al endpoint de iniciar sesión
     */
    signIn(user: any);
    
    /**
     * Función que llama al endpoint de registro de usuario
     * @param user - Los datos del usuario que queremos crear
     */
    signUp(user: any);

    /**
     * Asigna un token y su expiración en LocalStorage
     * @param res Objeto con un token y su expiración
     */
    setSession(res: any);

    /**
     * Elimina el token de acceso para cerrar la sesión
     */
    logout();

    /**
     * Comprueba si el usuario esta logeado mediante un token acceso
     * @return {boolean} true si está logeado, false si no lo está
     */
    isLoggedIn: boolean;
}