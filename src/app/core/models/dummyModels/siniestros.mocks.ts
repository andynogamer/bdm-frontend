import { Siniestro } from '../siniestro.model'; // Asegúrate de que la ruta sea correcta

export const SINIESTROS_DUMMY: Siniestro[] = [
  {
    id: 1,
    accidentDate: new Date(2026, 1, 15, 14, 30),
    userAffected: 'Angel Antonio Mata Zamora', //
    insurance: 'Qualitas',
    policyNumber: 'Q-1998377-A', //
    unitData: 'Mazda 3 2022, Placas: RGV-123-A, Serie: MZ3-998377', //
    location: 'Av. Universidad, San Nicolás de los Garza, NL',
    description: 'Impacto lateral en crucero. El vehículo asegurado tenía preferencia de paso.',
    otherUnits: true, //
    adjustorId: 1998377,
    resolutionDate: new Date(2026, 1, 20),
    payment: 4500.00,
    administratorId: 10,
    estatus: 3, // Aceptado con pago de deducible
    multimedia: [
      new Blob([''], { type: 'image/jpeg' }), // Simulación de foto del choque
      new Blob([''], { type: 'image/jpeg' })
    ]
  },
  {
    id: 2,
    accidentDate: new Date(2026, 1, 18, 0, 15),
    userAffected: 'Juan Alejandro Villarreal',
    insurance: 'GNP Seguros',
    policyNumber: 'GNP-88291-B',
    unitData: 'Nissan Versa 2020, Placas: SSG-881-B, Serie: NS-00129',
    location: 'Carretera Nacional, Monterrey, NL',
    description: 'Pérdida de control por pavimento mojado, impacto contra objeto fijo (muro).',
    otherUnits: false,
    adjustorId: 1998377,
    resolutionDate: new Date(2026, 1, 25),
    payment: 350000.00,
    administratorId: 10,
    estatus: 6, // Pérdida total
    multimedia: [
      new Blob([''], { type: 'image/jpeg' })
    ]
  },
  {
    id: 3,
    accidentDate: new Date(2026, 2, 1, 10, 0),
    userAffected: 'Pedro Páramo',
    insurance: 'AXA Seguros',
    policyNumber: 'AXA-99001-Z',
    unitData: 'Ford Figo 2019, Placas: PAA-009-C',
    location: 'Col. Lindavista, Guadalupe, NL',
    description: 'Intento de robo con cristalazo en estacionamiento público.',
    otherUnits: false,
    adjustorId: 45,
    estatus: 1, // Rechazado
    multimedia: []
  },
  {
    id: 4,
    accidentDate: new Date(2026, 2, 2, 18, 45),
    userAffected: 'María Enriqueta',
    insurance: 'Qualitas',
    policyNumber: 'Q-77281-K',
    unitData: 'Kia Forte 2023, Placas: KKL-221-D',
    location: 'Av. Constitución, Monterrey, NL',
    description: 'Alcance trasero leve. No hubo lesionados ni daños estructurales.',
    otherUnits: true,
    adjustorId: 45,
    administratorId: 10,
    estatus: 4, // Aceptado sin pago de deducible
    multimedia: [
      new Blob([''], { type: 'image/jpeg' }),
      new Blob([''], { type: 'image/png' })
    ]
  }
];