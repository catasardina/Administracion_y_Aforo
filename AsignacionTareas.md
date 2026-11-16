# Distribución de tareas del proyecto

## 1. Persona 1: Modelos y conexión al Gateway

### Archivos asignados

- `models/evento.model.ts`
- `models/resumen-evento.model.ts`
- `services/eventpass.service.ts`
- `app.config.ts`

### Tareas a implementar

- Definir las interfaces `Evento` y `ResumenEvento`.
- Configurar una URL base del Gateway que pueda modificarse fácilmente.
- Implementar los siguientes métodos en el servicio:
  - `obtenerEventos()`: realiza una consulta GET a `/api/eventos`.
  - `obtenerResumen(id)`: realiza una consulta GET a `/api/entradas/eventos/{id}/resumen`.
- Configurar `HttpClient`.
- Elaborar el README con instrucciones de instalación, compilación y ejecución para el docente.

### Entrega esperada

Servicio funcionando que obtenga los datos reales desde el Gateway y comunique los errores al componente correspondiente.

---

## 2. Persona 2: Funcionamiento del panel

### Archivo asignado

- `panel/panel.component.ts`

### Tareas a implementar

- Cargar los eventos mediante el servicio.
- Consultar el resumen al seleccionar un evento.
- Implementar la acción del botón **Actualizar**.
- Configurar la consulta automática cada 10 segundos.
- Registrar la hora de la última consulta exitosa.
- Mostrar errores conservando los últimos datos exitosos del mismo evento.
- Detener las consultas periódicas al salir del panel.
- Evitar que una respuesta correspondiente a un evento anterior sobrescriba los datos del evento actualmente seleccionado.

### Entrega esperada

Toda la lógica del panel implementada y lista para conectarse con el HTML.

---

## 3. Persona 3: Diseño y presentación

### Archivos asignados

- `panel/panel.component.html`
- `panel/panel.component.css`
- `docs/secuencia.mmd`

También se encarga de mostrar el panel desde el componente principal de la aplicación.

### Tareas a implementar

- Crear un selector de eventos.
- Diseñar cuatro tarjetas informativas:
  - Capacidad.
  - Entradas emitidas.
  - Entradas utilizadas.
  - Entradas disponibles.
- Incorporar el botón **Actualizar**.
- Mostrar la hora de la última consulta exitosa.
- Implementar mensajes visuales para:
  - Estado de carga.
  - Errores.
  - Ausencia de datos.
- Crear un diseño adaptable a computadores y celulares (responsive).
- Elaborar un diagrama de secuencia que incluya:
  - Administrador.
  - Panel Angular.
  - Gateway.
  - API de entradas.
  - Estructuras `loop` y `alt`.

### Entrega esperada

Pantalla conectada a la lógica implementada por la Persona 2 y diagrama de secuencia incorporado al repositorio.

---

## 4. Convenciones de nombres compartidas

Antes de comenzar el desarrollo, los integrantes deben acordar los siguientes nombres para asegurar la compatibilidad entre el HTML y TypeScript.

| Dato o acción | Nombre acordado |
|---|---|
| Lista de eventos | `eventos` |
| Evento seleccionado | `eventoSeleccionadoId` |
| Indicadores recibidos | `resumen` |
| Consulta en curso | `cargando` |
| Aviso de error | `mensajeError` |
| Última consulta exitosa | `ultimaActualizacion` |
| Seleccionar evento | `seleccionarEvento(id)` |
| Actualizar datos | `actualizarResumen()` |

---

## 5. Consideraciones para el trabajo en equipo

### Organización del desarrollo

- Trabajar en ramas de Git separadas.
- Respetar la asignación de archivos de cada integrante.
- Evitar modificar archivos asignados a otra persona sin coordinación previa.
- Mantener las convenciones de nombres acordadas para facilitar la integración.
- Integrar y probar los cambios en conjunto.

### Pruebas de integración

Al finalizar la integración, comprobar los siguientes comportamientos:

| Acción | Resultado esperado |
|---|---|
| Emitir una entrada | Aumenta la cantidad de entradas emitidas. |
| Validar una entrada | Aumenta la cantidad de entradas utilizadas, sin liberar cupos. |
| Fallo de conexión | Se conservan los últimos valores obtenidos exitosamente. |
| Cambiar de evento | Los datos mostrados corresponden al evento actualmente seleccionado. |
| Actualización automática | El resumen se consulta nuevamente cada 10 segundos. |
| Salir del panel | Se detienen las consultas periódicas. |

### Objetivo final

Conseguir que los tres desarrollos funcionen de manera integrada: conexión con el Gateway, lógica del panel y presentación visual, garantizando que la información mostrada corresponda a los datos reales de la API.