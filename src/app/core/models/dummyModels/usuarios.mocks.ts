import { Usuario } from "../usuario.model";

export const USUARIOS_DUMMY: Usuario[] = [
  {
    id: 1,
    name: 'Juan Alejandro',
    lastName: 'Villarreal Mojica',
    birthDate: new Date(1985, 4, 20), // Mayor de 18 años 
    photo: new Blob([''], { type: 'image/png' }), // Simulación de BLOB 
    gender: true, 
    correo: 'juan.villarreal@fcfm.edu.mx',
    alias: 'JuanAVM',
    rol: 1 // Supervisor: Puede ver todos los siniestros 
  },
  {
    id: 2,
    name: 'Roberto',
    lastName: 'García',
    birthDate: new Date(1998, 10, 5),
    photo: new Blob([''], { type: 'image/jpeg' }),
    gender: true,
    correo: 'ajustador.roberto@seguros.com',
    alias: 'BetoAjustador',
    rol: 2 // Ajustador: Solo ve lo que él registró 
  },
  {
    id: 3,
    name: 'Ana María',
    lastName: 'López',
    birthDate: new Date(2002, 1, 12),
    photo: new Blob([''], { type: 'image/png' }),
    gender: false,
    correo: 'ana.asegurada@gmail.com',
    alias: 'AnaPez',
    rol: 3 // Asegurado: Solo ve sus propios siniestros 
  },
  {
    id: 4,
    name: 'Juan Alejandro',
    lastName: 'Villarreal Mojica',
    birthDate: new Date(1985, 4, 20), // Mayor de 18 años 
    photo: new Blob([''], { type: 'image/png' }), // Simulación de BLOB 
    gender: true, 
    correo: 'juan.villarreal@fcfm.edu.mx',
    alias: 'JuanAVM',
    rol: 1 // Supervisor: Puede ver todos los siniestros 
  },
  {
    id: 5,
    name: 'Roberto',
    lastName: 'García',
    birthDate: new Date(1998, 10, 5),
    photo: new Blob([''], { type: 'image/jpeg' }),
    gender: true,
    correo: 'ajustador.roberto@seguros.com',
    alias: 'BetoAjustador',
    rol: 2 // Ajustador: Solo ve lo que él registró 
  },
  {
    id: 6,
    name: 'Ana María',
    lastName: 'López',
    birthDate: new Date(2002, 1, 12),
    photo: new Blob([''], { type: 'image/png' }),
    gender: false,
    correo: 'ana.asegurada@gmail.com',
    alias: 'AnaPez',
    rol: 3 // Asegurado: Solo ve sus propios siniestros 
  }
];