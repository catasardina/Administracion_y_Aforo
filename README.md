## Equipo 02 — Panel de administración y aforo

Artefacto: Frontend web Tecnología: Angular

## Situación

Ustedes implementarán el panel utilizado por los organizadores para observar las entradas emitidas y el ingreso de asistentes. No deben crear ni modificar entradas: su aplicación consulta información proporcionada por otros servicios.

## Ubicación en el proceso

Su equipo observa el resultado de las compras y las validaciones. Una venta aumenta emitidas; un acceso autorizado aumenta utilizadas. Las entradas utilizadas siguen ocupando un cupo.

## Desarrollo solicitado

- 1. Consultar los eventos mediante GET /api/eventos y mostrar un selector.

- 2. Al seleccionar un evento, consultar GET /api/entradas/eventos/{id}/resumen.

- 3. Mostrar cuatro indicadores: capacidad, emitidas, utilizadas y disponibles.

- 4. Implementar un botón Actualizar y una actualización automática cada 10 segundos mientras se muestre el panel.

- 5. Indicar la hora de la última consulta exitosa. Si la API falla, mostrar un aviso sin reemplazar los valores previos por cifras inventadas.

## Comunicación con el sistema

Todas las solicitudes se realizan a la URL pública del Gateway. El campo disponibles expresa cupos que aún pueden venderse; utilizadas expresa personas que ya ingresaron.

```
GET /api/eventos
200 [{"id":1,"nombre":"Festival Norte",
"fecha":"2027-01-10T19:00:00","capacidad":100,"disponibles":99}]
GET /api/entradas/eventos/1/resumen
200 {"evento_id":1,"capacidad":100,"emitidas":1,
"utilizadas":0,"disponibles":99}
404 {"error":"EVENTO_NO_EXISTE","mensaje":"Evento no encontrado"}
```


## Diagrama de secuencia UML

Representen la selección de un evento y la recuperación de su resumen. Incluyan Administrador, Panel Angular, Gateway y API de entradas. Utilicen un fragmento loop para la consulta periódica y un fragmento alt para respuesta correcta / error de comunicación.

## Comprobación

Al emitir una nueva entrada, emitidas aumenta. Al validarla, utilizadas aumenta, sin alterar emitidas. Verifiquen que los datos cambian sin recargar manualmente toda la aplicación.

## Solicitud de despliegue

Soliciten al docente publicar el panel Angular en Railway cuando se encuentre en el repositorio. Entreguen la rama, comandos de compilación y ejecución, puerto y la URL del Gateway que debe configurarse. El docente realizará el despliegue. Entrega: enlace al repositorio Git del equipo y diagrama de secuencia UML dentro del mismo repositorio, en docs/secuencia.puml o docs/secuencia.mmd.
