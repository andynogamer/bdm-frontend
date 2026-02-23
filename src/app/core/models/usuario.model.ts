export interface Usuario {
    id: number;
    name: string;
    lastName: string;
    birthDate: Date;
    photo: Blob;
    gender: boolean;
    correo: string;
    contrasena?: string;
    alias: string;
    rol: number;
}