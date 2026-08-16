# El asedio de la reputación

Prototipo educativo para navegador inspirado en la mecánica física de lanzamiento con resortera y destrucción de estructuras. No usa personajes, recursos visuales, sonidos ni niveles de otros juegos.

## Ejecución

Abre la carpeta `angry_com_copia` con un servidor local. Por ejemplo, con Live Server en VS Code abre `index.html`.

También puedes ejecutar un servidor simple desde la carpeta superior:

```bash
python3 -m http.server 8080
```

Luego visita `http://localhost:8080/angry_com_copia/`.

## Lenguaje y arquitectura

Esta copia queda migrada a **TypeScript + Matter.js**. La elección mantiene el juego como página web estática, pero agrega una base más apropiada para crecer: tipos, separación por módulos, compilación y una frontera clara entre código fuente y salida ejecutable.

- `index.html`: estructura de HUD, canvas, pantalla inicial, resultados y barra de herramientas.
- `styles.css`: composición visual, paneles, fondo medieval simple y estados de interfaz.
- `src/config.ts`: duración, gravedad, daño, castillo, proyectiles, reparaciones, catapulta y reglas conceptuales.
- `src/castle.ts`: construcción del castillo, integridad, daño, etiquetas y barras internas de resistencia.
- `src/projectiles.ts`: creación de proyectiles, resortera, límite de arrastre, velocidad y trayectoria estimada.
- `src/repairs.ts`: validación y cálculo de reparación según restricciones conceptuales.
- `src/game.ts`: Matter.js, estados, colisiones, temporizador, UI, sonidos y efectos.
- `src/matter-types.d.ts`: tipos mínimos compartidos para el motor y datos del juego.
- `dist/`: JavaScript generado que carga el navegador.

Matter.js 0.20.0 está incluido en `vendor/matter.min.js` para que la página funcione sin depender de internet durante la clase.

## Desarrollo

La página funciona abriendo `index.html` desde un servidor local, porque `dist/` ya contiene JavaScript ejecutable.

Si quieres editar TypeScript y recompilar:

```bash
npm install
npm run build
```

Para servir la carpeta:

```bash
npm run serve
```

Luego visita `http://localhost:8080/`.

## Mecánicas implementadas

- Pantalla inicial y partida de 90 segundos.
- Catapulta con restricción elástica de Matter.js.
- Arrastre con mouse y soporte básico táctil mediante `MouseConstraint`.
- Control de PC con teclado: `Enter` inicia, flechas arriba/abajo ajustan ángulo y `Espacio` se mantiene presionada para cargar potencia; al soltarla lanza.
- Física ralentizada con suelo sólido profundo para mantener proyectiles y bloques dentro de escena.
- Puntos de trayectoria estimada.
- Un solo proyectil activo en vuelo.
- Cuatro proyectiles con cantidades, tamaños, masas, daño y multiplicadores distintos.
- Explosión de área para `Crisis en redes` y `Escándalo ambiental`.
- Castillo físico con Identidad, Imagen y Reputación.
- Daño por colisión calculado con daño base, velocidad relativa, masa implícita del cuerpo y multiplicador conceptual.
- Enfriamiento por pareja de cuerpos para evitar daño repetido continuo.
- Daño menor por golpes fuertes durante derrumbes.
- Barras de integridad por nivel.
- Deterioro progresivo de niveles superiores cuando Identidad o Imagen llegan a cero.
- Reparación con materiales, cantidades y restricciones.
- Resultados educativos al terminar.
- Sonidos simples generados con Web Audio API y botón de silencio.
- Temblor de cámara, partículas, texto flotante y destello de explosión.
- Redimensionamiento básico del canvas sin reiniciar la partida.

## Balance

Modifica `src/config.ts` para ajustar y luego ejecuta `npm run build`:

- Duración de ronda.
- Gravedad.
- Escala y límite de daño.
- Resistencia, densidad y colores de bloques.
- Cantidades, daño y afinidades de proyectiles.
- Cantidades y eficacia de reparaciones.
- Radio de arrastre y límite de velocidad.
- Escala de potencia de la resortera y velocidad de simulación.
- Umbrales de evaluación final.

## Pruebas manuales mínimas

1. Lanzamiento suave.
2. Lanzamiento con potencia máxima.
3. Impacto directo en Identidad.
4. Impacto directo en Imagen.
5. Caída de la torre por pérdida de soporte.
6. Explosión de Crisis en redes.
7. Explosión de Escándalo ambiental.
8. Agotamiento de proyectiles.
9. Reparación válida.
10. Reparación inválida.
11. Fin de la ronda.
12. Reinicio completo.
13. Cambio de tamaño de la ventana.
14. Uso con mouse y pantalla táctil.
15. Uso con teclado: `Enter`, flechas arriba/abajo y `Espacio` mantenida para cargar y soltar para lanzar.

## Limitaciones del prototipo

- La trayectoria es aproximada, no una predicción exacta del motor.
- El redimensionamiento conserva la simulación en curso, pero no reacomoda todo el castillo si ya colapsó.
- El modo pausado está previsto como estado conceptual, pero la interfaz actual usa inicio, jugando y finalizado.
- El soporte táctil depende del comportamiento de `MouseConstraint` de Matter.js en el navegador.
