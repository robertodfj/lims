/** Una línea de la "Solicitud de Pruebas": una técnica añadida a la petición y su precio. */
export interface PeticionTecnica {
  tecnicaId: string;
  precio: number | null;
}

export interface Peticion {
  readonly id: string;
  /** Nº de registro: automático y autoincremental, editable antes de guardar. */
  numRegistro: number;
  /** Momento de la visita, en formato local (yyyy-MM-ddTHH:mm) tal y como lo entrega <input type="datetime-local">. */
  fechaVisita: string;
  sociedadId: string | null;
  procedenciaId: string | null;
  peticionarioId: string | null;
  tipoPeticionId: string | null;
  estadoFacturacionId: string | null;
  destinoId: string | null;
  comentario: string;
  tecnicas: PeticionTecnica[];
  /** Paciente asociado (pestaña Datos demográficos), si se ha buscado/creado uno. */
  pacienteId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function createEmptyPeticion(): Peticion {
  return {
    id: '',
    numRegistro: 0,
    fechaVisita: '',
    sociedadId: null,
    procedenciaId: null,
    peticionarioId: null,
    tipoPeticionId: null,
    estadoFacturacionId: null,
    destinoId: null,
    comentario: '',
    tecnicas: [],
    pacienteId: null,
  };
}
