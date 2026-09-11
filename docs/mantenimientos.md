# Mantenimientos — qué es y qué hace cada uno

Referencia funcional de las pantallas de `Mantenimientos`, trasladada del LIMS
anterior. Sirve para entender el propósito de cada campo al construir o revisar
una pantalla, no solo su tipo de dato.

> **Nota de estado:** esta documentación incluye el comportamiento completo del
> sistema original. La implementación actual (frontend, mock) cubre un
> subconjunto de los campos de cada entidad. **Técnicas** ya tiene implementados
> todos los campos documentados aquí. El botón "Avanzado" abre la
> "Configuración avanzada", con 9 pestañas (Rangos de referencia, Texto
> referencia extendida, Decimales, Interpretación de resultado, Comentarios,
> Agrupaciones, Resultados alfabéticos, Fórmula y Artículos); por ahora son
> solo visuales, salvo tres excepciones funcionales: la pestaña **Agrupaciones**
> (solo visible si Tipo de Resultado es "Agrupación de pruebas") sí guarda de
> verdad qué técnicas forman parte de la agrupación, y al añadir la técnica
> padre a una petición se añaden automáticamente también todas sus técnicas
> asociadas; la pestaña **Comentarios** sí guarda de verdad qué comentarios
> (Mantenimientos / Comentarios) están vinculados a la técnica — es la misma
> relación que se edita desde el propio comentario, en su Avanzado; y el campo
> Incluir en Sección no está implementado porque depende del Mantenimiento de
> Secciones, que se retiró (ver
> [Pantallas retiradas temporalmente](#pantallas-retiradas-temporalmente)). El
> resto de pestañas (Rangos de referencia, Texto referencia extendida,
> Decimales, Interpretación de resultado, Resultados alfabéticos, Fórmula,
> Artículos) y el editor de fórmulas de las técnicas de tipo Calculado quedan
> pendientes de implementar.
>
> El botón "Avanzado" también existe en **Sociedades** (config. de
> facturación) y **Destino de informes** (correo/exportación/modelo de
> informe/condición) — solo visual en los dos. En **Soportes** (contenedores
> admitidos), **Contenedores** (destinos preanalíticos admitidos, con
> prioridad), **Comentarios** (técnicas vinculadas) y **Laboratorios de
> referencia** (técnicas asociadas, color, y valores de equivalencia/precio
> por técnica) sí es funcional: guardan de verdad la asociación.
> **Peticionarios**, **Procedencias** y **Tipos de petición** no tienen
> "Avanzado" porque no existe en el sistema original.

---

## Técnicas (parámetros)

### Concepto

Las técnicas (o parámetros) son las pruebas que realiza el laboratorio. Cada
una define cómo se introduce su resultado, cómo se presenta en el informe, y
cómo se agrupa y factura.

### Campos

- **Código**: el correspondiente al parámetro. Como es habitual, se puede
  elegir un hueco entre códigos existentes, el siguiente al último definido,
  o escribir un número concreto.
- **Nombre**: cómo se quiere identificar este registro.
- **Grupo**: grupo al que pertenece el parámetro.
- **Subgrupo**: subgrupo al que pertenece el parámetro.

  > Una prueba sin grupo ni subgrupo no aparecerá en el informe, aunque sí
  > será facturada.

- **Tipo de Resultado**: existen 6 tipos de resultado para las técnicas:
  - **Numérico (N)** — el resultado es un número.
  - **Texto Libre (T)** — el resultado hay que escribirlo a mano.
  - **Alfabético (A)** — el resultado se expresa con un texto pregrabado. Esos
    textos se codifican antes en el Mantenimiento de Resultados Alfabéticos
    para facilitar su introducción.
  - **Calculado (C)** — el resultado sale de una operación aritmética sobre
    otras pruebas (ejemplo: VLDL Colesterol). La fórmula se define en la
    configuración avanzada:
    - **Constantes**: números con o sin decimales, y paréntesis.
    - **Operadores**: producto (`*`), suma (`+`), resta (`-`), división (`/`),
      potencia (`^`).
    - **Pruebas**: el código de la técnica entre corchetes.
    - **Funciones**: matemáticas (`log()`, `abs()`, `sin()`...) y lógicas
      (`iff(<condición>; valorSi; valorNo)`).
    - El botón "Comprobar" valida la fórmula con un ejemplo antes de guardar.
  - **Agrupación de Pruebas (AP)** — un conjunto de pruebas agrupadas bajo un
    único epígrafe (ejemplo: Hemograma). Las muestras que forman la
    agrupación se añaden desde la configuración avanzada.
  - **Microbiología (M)** — identificación de microorganismos mediante
    métodos biológicos, bioquímicos, moleculares o químicos (ejemplo:
    Antibiograma). Los tipos de muestra de microbiología se dan de alta en
    Mantenimiento / Microbiología / Tipos de Muestra.
- **Nº Decimales**: si el resultado es numérico, cuántos decimales debe tener.
- **Nº de Líneas**: solo para Texto Libre y Microbiología. Determina cuántas
  líneas de edición hay disponibles al introducir el resultado y en el
  informe. Máximo 9.
- **Unidad 1**: unidad principal en la que se expresa el resultado.
- **Unidad 2**: unidad secundaria en la que se expresa el resultado.
- **Factor Conversión**: factor que convierte la Unidad 1 en la Unidad 2.
- **Referencia 1**: límite inferior a partir del cual el resultado se muestra
  en otro color, por estar por debajo de los valores normales.
- **Referencia 2**: límite superior a partir del cual el resultado se muestra
  en otro color, por estar por encima de los valores normales.

  > Es recomendable definir los valores de referencia al dar de alta una
  > técnica, aunque no es obligatorio. Las pruebas sin referencia se marcan
  > con otro color en la pantalla de Introducción de Resultados.

- **Alarma 1 / Alarma 2**: límites por debajo/encima de los cuales el sistema
  pide confirmación antes de grabar el resultado.
- **Pánico 1 / Pánico 2**: límites por debajo/encima de los cuales se
  considera que el resultado es imposible y se impide introducirlo.
- **Delta Check**: porcentaje de variación admitido entre el resultado actual
  y el último resultado de la misma técnica. Si se supera, se marca en la
  pantalla de resultados. Opcionalmente se puede acotar a un número de días
  (formato `porcentaje/días`).
  - Ejemplo: variación admitida del 2 % → `Delta Check = 2`.
  - Ejemplo: variación admitida del 3 % solo si el resultado anterior es de
    los últimos 60 días → `Delta Check = 3/60`.
- **Orden de Impresión**: posición de la técnica dentro de su grupo y
  subgrupo en el informe.
- **Laboratorio Externo**: si la prueba se envía habitualmente a un
  laboratorio de referencia. Requiere tener definido antes el catálogo de
  pruebas de ese laboratorio.
- **Nombre en Informe**: sustituye al campo Nombre en el Informe de
  Resultados.
- **Cabecera Edición**: texto que aparece en el informe encima de la técnica.
- **Comentario Edición**: texto que aparece en el informe debajo de la
  técnica (ejemplo: método empleado).
- **Valor por Defecto**: valor (numérico o codificado) que se asigna
  automáticamente al resultado.
  - Un operador (`+ - * /`) antes del valor aplica esa operación sobre el
    resultado normal obtenido.
  - El símbolo `?` hace que el sistema pida el resultado al solicitar la
    técnica en Petición de Pruebas.
  - `&texto` antepone ese texto al resultado numérico en el informe.
    Ejemplo: resultado `30` con valor por defecto `&1/` → se muestra `1/30`.
- **Incluir en Catálogo**: la técnica aparece en el Catálogo de Pruebas
  (activado por defecto).
- **Incluir Evolución**: el informe muestra un gráfico de evolución junto al
  resultado.
- **No Imprimible**: la técnica queda marcada por defecto como no imprimible
  en el informe.
- **No Activa**: la técnica no está vigente y no puede solicitarse.
- **No Pedible Individual**: solo puede solicitarse dentro de una Agrupación
  de Pruebas, no de forma individual.
- **Imprimir Código QR**: añade un QR al informe que enlaza a la consulta de
  resultados online de esa petición (solo para la prueba escaneada). Útil,
  por ejemplo, para pruebas COVID.
- **Contenedor**: tipo de recipiente necesario para la prueba. Se define
  antes en Mantenimiento de Contenedores.
- **Incluir en Sección** *(no implementado)*: para los módulos de gestión de
  muestras y seroteca, y para asignar permisos por sección a los usuarios. Se
  define antes en Mantenimiento de Secciones — pantalla retirada por ahora,
  así que este campo queda pendiente de retomar junto con ella.
- **Tiempo de Respuesta**: tiempo estimado para obtener el resultado. Un
  número seguido de `DIA`, `DIAS`, `DIARIO`, `SEMANA`, `SEMANAS` o `SEMANAL`.
- **Sexo / Especie**: vincula la técnica a un sexo o especie concretos. Si la
  petición no coincide, se avisa de que la prueba solo está configurada para
  ese sexo/especie.
- **Requerimientos**: campo libre con los requisitos para realizar la
  prueba.

  > Contenedor, Tiempo de Respuesta y Requerimientos son información
  > adicional de uso interno que también se refleja en el Catálogo de
  > Pruebas.

- **Código Auxiliar**: código de texto alternativo para introducir la técnica
  en la petición (además del código numérico).
- **Costo**: precio de coste de realizar la prueba.

---

## Peticionarios

### Concepto

El peticionario es quien solicita el estudio. Este mantenimiento da de alta a
los profesionales con los que trabaja habitualmente el laboratorio.

### Campos

- **Código**: el correspondiente al peticionario (hueco libre, siguiente al
  último, o número concreto).
- **Nombre**: cómo se quiere identificar este registro.
- **Especialidad**: especialidad a la que pertenece el peticionario.
- **Observaciones**: campo libre para anotaciones sobre el profesional.
- **Teléfono / Móvil / Fax**: contacto del peticionario.
- **Nº Colegiado**: código del colegio oficial donde está colegiado.
- **Domicilio / Población / Provincia / CP**: dirección donde trabaja.
- **Aviso En Peticiones**: texto que aparece como aviso (icono de
  exclamación) al seleccionar este peticionario en una petición. Aplica con
  carácter retroactivo a todas las peticiones donde se use.

---

## Procedencias

### Concepto

La procedencia es el lugar físico donde se obtiene la muestra y/o a donde se
envía el informe.

### Campos

- **Código**: el correspondiente a la procedencia (hueco libre, siguiente al
  último, o número concreto).
- **Procedencia**: cómo se quiere identificar este registro.
- **Domicilio / Población / Provincia / CP**: dirección de la procedencia.
- **Persona Contacto**: con quién contactar para consultas.
- **Teléfono / Móvil / E-Mail / Fax**: contacto de la procedencia.
- **NIF**: número de identificación fiscal.
- **Cabeceras**: cabecera de documento asociada a la procedencia.
- **Forma de pago**: forma de pago habitual.
- **Cuenta Bancaria**: cuenta asociada.
- **Destino**: destino de facturación predeterminado.
- **Observaciones**: campo libre. El texto entre `{ }` se muestra en la
  pantalla de introducción de pruebas al hacer clic en el icono de aviso.
- **Aviso En Peticiones**: igual que en Peticionarios — aviso retroactivo al
  seleccionar esta procedencia.

---

## Sociedades

### Concepto

Registra los clientes del laboratorio, es decir, a quién se factura.

### Campos

- **Código**: el correspondiente a la sociedad (hueco libre, siguiente al
  último, o número concreto).
- **Nombre**: cómo se quiere identificar este registro.
- **Domicilio / Población / Provincia / CP**: dirección de la sociedad.
- **Persona Contacto / Teléfono / Móvil / E-mail / Fax Contacto**: datos de
  contacto.
- **Indicador Compañía**: código interno que la sociedad/compañía asigna al
  laboratorio, necesario para la facturación en fichero.
- **NIF/CIF**: identificación fiscal de la sociedad.
- **Valor Punto**: valor de cada "punto" para las compañías que facturan por
  puntos (el número de puntos de cada técnica se define en Mantenimientos /
  Facturación / Precios). Si el valor es 0, se factura en la moneda habitual;
  si es distinto de 0, se factura por puntos.
- **Tarifa aplicada**: cuando el cliente usa los precios de otra compañía.
- **Estado peticiones** (Estado de facturación): estado por defecto de las
  peticiones de este cliente — `Facturar`, `Prefacturar` (necesita validación
  previa) u `Omitir` (no se factura).
- **Forma de pago / Cuenta Bancaria / Destino**: igual que en Procedencias,
  pero para la facturación de este cliente.
- **Observaciones**: campo libre; el texto entre `{ }` es visible en la
  pantalla de introducción de pruebas.
- **Aviso En Peticiones**: aviso retroactivo al seleccionar esta sociedad.

---

## Tipos de petición (Estados de Petición)

### Concepto

Da de alta los estados que se pueden asignar a una petición para organizarla
internamente: urgente, rutina, preferente, etc.

---

## Destino de informes

### Concepto

Un destino de informe es un distribuidor inteligente de informes: recoge los
dispositivos (correos electrónicos) y lugares a los que se envían los
resultados de forma automática. Antes de enviar por destinos hace falta
configurar el servidor de correo saliente (por usuario, en Opciones / Correo
electrónico, o de forma general en Opciones Generales).

### Campos

- **Código**: identificador único del destino.
- **Descripción**: nombre identificativo del destino.
- **Orden**: preferencia al aplicar la impresión por destinos en Generación
  de Informes.
- **Tipo de Destino**: categoría del destino, y desde dónde se puede usar:
  - **Informes de Resultados** — desde la impresión de un informe individual
    (Proceso Diario / Peticiones y Resultados) o desde Generación de
    Informes.
  - **Facturas** — hay que definirlo en el mantenimiento de la Sociedad a
    facturar.
  - **Impresión General** — usable en cualquier impresión con botón
    "Imprimir"; sustituye a la opción "Pantalla".
  - **Pedidos de Almacén** — se define en el proveedor de los artículos
    pedidos.
  - **Presupuestos** — seleccionable en el campo Destino de un presupuesto
    (Proceso Diario / Módulos / Presupuestos).
- **Destino Asociado**: un segundo destino que también recibe la misma
  información. No puede ser el propio destino que se está editando.
- **Observaciones**: texto largo para información general no cubierta por
  otros campos.
- **Aviso En Peticiones**: aviso retroactivo al seleccionar este destino.

---

## Soportes

### Concepto

Da de alta los soportes físicos que albergan las muestras de las distintas
secciones (Mantenimientos / Soportes).

### Campos

- **Código**: el correspondiente al soporte (hueco libre, siguiente al
  último, o número concreto).
- **Descripción**: identifica al soporte con un texto.
- **Nº de filas / Nº de columnas**: dimensiones del soporte.
- **Orientación**: `Horizontal` o `Vertical`. Determina cómo se completa el
  soporte automáticamente desde el módulo de Seroteca:
  - `Horizontal` → de izquierda a derecha y de arriba a abajo.
  - `Vertical` → de arriba a abajo y de izquierda a derecha.

### Avanzado — Contenedores

Selecciona qué contenedores puede usar este soporte, con dos listas
(Disponibles / Contenedores asociados) y botones para mover uno a otra. Sin
ningún contenedor asociado el soporte admite todos (comportamiento por
defecto); en cuanto se asocia alguno, solo admite los de esa lista.

---

## Contenedores *(no documentado en el original; inferido de Técnicas)*

### Concepto

Tipos de recipiente necesarios para la recogida y conservación de cada
muestra. Se referencian desde el campo **Contenedor** de Técnicas.

### Campos

- **Contenedor**: nombre identificativo del recipiente.
- **Tipo de Muestra**: tipo de muestra para el que se usa este contenedor.
- **Volumen**: volumen que admite el contenedor.
- **Color asociado**: color identificativo del contenedor (tapón), útil para
  reconocerlo a simple vista en el laboratorio.
- **Permanencia Seroteca (Días)**: días que la muestra permanece conservada
  en la seroteca antes de descartarse.

### Avanzado — Destinos preanalíticos

Selecciona qué Destinos (Mantenimiento / Destino de informes) puede usar
este contenedor como destino preanalítico, con dos listas (Disponibles /
Asignados) y botones para mover uno a otra. Sin ninguno asignado el
contenedor admite cualquier destino; en cuanto se asocia alguno, solo admite
los de esa lista. El botón "Prioridad" (activo solo con algún destino
asignado) permite indicar un nº de prioridad por destino asignado, para
saber cuál usar primero.

---

> **Aparcado por el momento:** la documentación original también cubre
> **Tipos de Muestra de Microbiología** y, en general, todo lo específico de
> **Microbiología** (tabla de tipos de muestra propia de ese módulo). Queda
> fuera del alcance actual — no se construye pantalla ni modelo para ello por
> ahora. Ver también [Pantallas retiradas temporalmente](#pantallas-retiradas-temporalmente),
> donde se detalla que la entrada de menú de Microbiología se ha eliminado.

---

## Hojas de trabajo personalizadas

### Concepto

Agrupan hasta 16 técnicas en una sola hoja de trabajo, para poder
introducir sus resultados juntos en el módulo de Introducción de Resultados
en lugar de técnica a técnica.

### Campos

- **Código**: numérico, a partir de 1000 (los códigos por debajo de 1000
  están reservados para las hojas de trabajo agrupadas).
- **Texto**: nombre que identifica la hoja de trabajo.
- **Técnica 1 … Técnica 16**: hasta 16 técnicas que forman parte de esta
  hoja. Se seleccionan del catálogo de Técnicas.

---

## Hojas de trabajo agrupadas

### Concepto

Agrupan hasta 20 hojas de trabajo personalizadas (no técnicas sueltas) en
una agrupación de nivel superior, para organizar el trabajo diario por
bloques más grandes.

### Campos

- **Código**: numérico, por debajo de 1000 (reservado frente a las hojas de
  trabajo personalizadas, que usan códigos ≥ 1000).
- **Nombre de la agrupación**: identifica la agrupación.
- **Hoja 1 … Hoja 20**: hasta 20 hojas de trabajo personalizadas que forman
  parte de esta agrupación. Se seleccionan del catálogo de Hojas de trabajo
  personalizadas.

---

## Comentarios

### Concepto

Textos predefinidos y reutilizables que se pueden insertar en los informes
(por ejemplo, observaciones clínicas habituales, aclaraciones sobre un
resultado, etc.), para no tener que redactarlos cada vez a mano.

### Campos

- **Código**: el correspondiente al comentario (hueco libre, siguiente al
  último, o número concreto).
- **Nombre**: identifica el comentario en los listados/selectores.
- **Comentario**: el texto del comentario en sí. Admite formato (como un
  editor de texto enriquecido) y la inserción de campos predefinidos
  (variables que el sistema sustituye automáticamente al generar el
  informe, p. ej. nombre del paciente, fecha, valores de resultado, etc.).

### Avanzado — Técnicas vinculadas

Indica a qué técnicas se puede vincular este comentario, con dos listas
(Disponibles / Técnicas vinculadas) y botones para mover una a otra. Luego,
al introducir un comentario en un resultado (pestaña Resultados de una
Petición), si la técnica de esa línea tiene comentarios vinculados solo se
ofrecen esos por defecto (pestaña "Asociados"); la pestaña "Todos" da acceso
al resto de comentarios creados. Un comentario sin ninguna técnica vinculada
es genérico: no aparece en "Asociados" de ninguna técnica, solo en "Todos".

---

## Laboratorios de referencia (Laboratorios Externos)

### Concepto

Laboratorios externos a los que se derivan pruebas que el propio
laboratorio no realiza, para su procesamiento y posterior recepción del
resultado.

### Campos

- **Código**: el correspondiente al laboratorio externo (hueco libre,
  siguiente al último, o número concreto).
- **Nombre**: identifica al laboratorio de referencia.
- **Domicilio / Población / Provincia / CP**: dirección del laboratorio.
- **Nº de Cliente**: código que el propio laboratorio de referencia asigna
  al laboratorio como cliente suyo (necesario en las peticiones/envíos que
  se les hacen).
- **Persona de Contacto / Teléfono / Fax**: datos de contacto.
- **Observaciones**: campo libre para información adicional.
- **Listado de pruebas**: relación de las pruebas (técnicas) que este
  laboratorio de referencia realiza, para poder derivarlas desde el propio
  sistema.

### Avanzado — Técnicas, color y programa asociado

- **Color asociado**: identifica visualmente el laboratorio en su propio
  listado (un punto de color junto al código) y, más importante, en el
  código de la técnica dentro de la ventana de Resultados de una Petición.
- **Programa asociado**: nombre de la aplicación con la que, mediante un
  desarrollo adicional, se interconectaría este laboratorio (p. ej. envío
  automático de resultados). Puramente informativo: no existe hoy una
  integración real que lo use.
- **Envío de resultados** *(sección plegable, solo informativa)*: documenta
  las dos formas de mandar resultados a este laboratorio — por el Programa
  Asociado, o mediante el botón de exportar de Peticiones y Resultados.
  Ninguna tiene una integración real conectada.
- **Técnicas** (Disponibles / Técnicas asociadas): a diferencia del resto de
  entidades con este patrón de doble lista, aquí NO se guarda un array
  propio del laboratorio — `laboratorioExternoId` ya es un campo de la
  propia Técnica (usado también en la columna "Laboratorio de referencia"
  de Resultados), así que asociar/quitar aquí escribe directamente en la
  técnica y se guarda al instante, sin depender de pulsar "Guardar" en el
  laboratorio. Es exactamente la misma relación que el desplegable
  "Laboratorio Externo" de la propia ficha de la técnica: cambiarla desde
  cualquiera de los dos sitios se refleja en el otro.
- **Valores** (por técnica asociada, botón "€"): equivalencia y condiciones
  de esa técnica para este laboratorio externo — **Código Laboratorio**
  (el que la prueba tiene en el laboratorio de referencia), **Precio** (lo
  que cuesta realizarla allí) e **Incidencias** (requisitos de envío de la
  muestra). También se guarda al instante en la técnica.

---

## Sexo / especie

### Concepto

Combinaciones de sexo/especie seleccionables desde la Historia clínica del
paciente (Mantenimientos / Base de pacientes). En un laboratorio veterinario
sirve para combinar especie y sexo (p. ej. "Macho — Canino"); en humana basta
con un valor simple ("Mujer", "Hombre").

### Campos

- **Código**: el correspondiente al registro (hueco libre, siguiente al
  último, o número concreto).
- **Sexo / Especie**: el texto que identifica la combinación.

---

## Base de pacientes (Historia clínica)

### Concepto

Ficha del paciente: sus datos personales, de contacto y administrativos,
además de un conjunto de campos auxiliares libres para necesidades propias
de cada laboratorio.

### Campos

- **Historia clínica**: identifica al paciente en este sistema, igual que un
  código (hueco libre, siguiente al último, o número concreto).
- **Apellidos**: obligatorio. Identifica al paciente junto con el nombre.
- **Nombre**: nombre del paciente.
- **Fecha de nacimiento**: fecha de nacimiento del paciente.
- **Sexo / Especie**: se selecciona del catálogo de Sexo / especie.
- **Dni**: documento de identidad del paciente.
- **Domicilio / Población / Provincia / CP**: dirección del paciente.
- **Teléfono / Telefono2 / Móvil / E-Mail / Fax**: datos de contacto.
- **Sociedad**: compañía a la que pertenece el paciente, del catálogo de
  Sociedades.
- **Historia Clínica Host**: número de historia clínica en el sistema
  hospitalario/externo (host), cuando el paciente procede de uno.
- **Auxiliar5 … Auxiliar10**: campos libres adicionales, sin un uso fijo
  predefinido, para necesidades propias de cada laboratorio.
- **Observaciones**: campo libre para información adicional.

---

## Pantallas retiradas temporalmente

Las siguientes pantallas de Mantenimientos se han quitado del menú (no había
llegado a construirse nada más que un marcador de posición vacío en ninguna
de ellas). Se retiran hasta tener claros sus campos; cuando se retomen, hay
que volver a añadir su entrada en `main-navigation.ts` y su ruta en
`mantenimientos.routes.ts`.

- **Facturación**: sin especificación de campos todavía. Pendiente de
  definir qué se gestiona aquí (tarifas, precios por técnica/compañía,
  ciclos de facturación, etc. — hay referencias sueltas a "Tarifa aplicada"
  y "Valor Punto" en Sociedades, pero no una pantalla de mantenimiento
  propia).
- **Tablas dinámicas**: sin especificación de campos todavía.
- **Textos codificados**: sin especificación de campos todavía.
- **Microbiología**: aparcada explícitamente (ver nota más arriba, en
  Contenedores). Pendiente de definir su tabla de tipos de muestra propia y
  el resto de comportamiento específico del módulo.
- **Tipos de muestra**: la pantalla de mantenimiento se retira, pero el
  catálogo `tipos-muestra.json` se mantiene y lo sigue usando Contenedores
  internamente (campo "Tipo de Muestra"). Pendiente de definir los campos
  de esta pantalla y reconstruirla con CRUD completo.
- **Hojas de trabajo**: sus campos ya están documentados más arriba en este
  mismo archivo (ver [Hojas de trabajo personalizadas](#hojas-de-trabajo-personalizadas)
  y [Hojas de trabajo agrupadas](#hojas-de-trabajo-agrupadas)), pero la
  pantalla se retira por ahora — falta decidir si se construyen como una
  sola pantalla con pestañas o como dos pantallas independientes.
