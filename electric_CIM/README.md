# Electricistas de la comunicación

Actividad educativa interactiva hecha con HTML, CSS y JavaScript puro. Funciona sin servidor, frameworks, dependencias externas ni conexión a internet.

## Cómo abrir

Abre `index.html` directamente en el navegador. La actividad guarda el progreso y la preferencia de sonido en `localStorage`.

## Cómo funciona

Cada nivel presenta una situación de comunicación con una o varias averías. El estudiante debe reparar el circuito asignando tarjetas de reparación a los fusibles correctos.

- Se puede arrastrar una tarjeta hasta un fusible.
- También se puede usar teclado: selecciona una tarjeta con Enter y luego selecciona el fusible con Enter.
- El botón **Probar circuito** verifica la solución.
- Si hay errores, la bombilla parpadea, aparece una chispa y el panel da una pista sin revelar toda la respuesta.
- Si todo está correcto, la corriente recorre los cables, los módulos se iluminan y la bombilla se enciende.
- El botón **Nivel anterior** permite volver al caso previo para revisarlo.

## Puntuación

Cada nivel comienza con 100 puntos. Los intentos incorrectos y las pistas reducen el puntaje del nivel, sin bajar de cero. El puntaje final acumula los puntos obtenidos al completar cada nivel.

## Cómo agregar niveles

Los niveles están en el arreglo `niveles` de `script.js`. Para agregar uno nuevo, añade un objeto con esta estructura:

```js
{
  titulo: "Título del nivel",
  situacion: "Descripción breve de la situación.",
  averias: ["canal", "retroalimentacion"],
  reparaciones: [
    { id: "n7-r1", texto: "Reparación correcta para el canal.", destino: "canal" },
    { id: "n7-r2", texto: "Reparación correcta para la retroalimentación.", destino: "retroalimentacion" },
    { id: "n7-r3", texto: "Opción distractora.", destino: "distractor" }
  ],
  pistas: [
    "Primera pista.",
    "Segunda pista más específica."
  ],
  explicacion: "Explicación pedagógica final.",
  mensajeExito: "Mensaje breve de éxito."
}
```

Los valores de `averias` y `destino` deben coincidir con los identificadores de `componentes`: `emisor`, `codificacion`, `mensaje`, `canal`, `decodificacion`, `receptor` y `retroalimentacion`. El `ruido` se describe en `casoComponentes` como interferencia externa, pero no es un fusible del circuito.

## Relación pedagógica

La metáfora del circuito muestra que la comunicación necesita continuidad. Si un componente falla, el mensaje no llega con claridad.

- **Emisor:** quien inicia la comunicación.
- **Codificación:** forma en que el emisor convierte la idea en palabras, gestos, imágenes o señales.
- **Mensaje:** contenido que se transmite.
- **Canal o transmisión:** medio por el que viaja el mensaje.
- **Decodificación:** interpretación que hace quien recibe.
- **Receptor:** persona o grupo que recibe el mensaje.
- **Retroalimentación:** respuesta que confirma, ajusta o aclara la comunicación.
- **Ruido o interferencia:** obstáculo externo físico, técnico, semántico o cultural que afecta el circuito, pero no ocupa una tarjeta propia dentro de él.

## Criterios para revisar casos

Al crear o editar niveles, conviene separar estos problemas:

- Si el medio elegido no permite que el mensaje llegue a tiempo o con nitidez, la avería es de **canal**.
- Si el emisor usa palabras, tono, símbolos o ejemplos inadecuados, la avería es de **codificación**.
- Si el contenido está desordenado, incompleto o ambiguo, la avería es de **mensaje**.
- Si el receptor interpreta mal el significado recibido, la avería es de **decodificación**.
- Si no se confirma, corrige o aclara la comprensión, la avería es de **retroalimentación**.
- Si hay distracciones físicas, semánticas, culturales o temporales, eso se describe como **ruido externo**.
