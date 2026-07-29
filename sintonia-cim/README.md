# Sintonía CIM: el reto de la integración

Aplicación web interactiva para estudiantes de Comunicación Integrada de Mercadeo. La actividad permite discutir qué tan coherente es una campaña cuando se alinean cuatro decisiones: necesidad del público, público objetivo, mensaje y medio.

## Archivos del proyecto

- `index.html`: estructura semántica de la aplicación.
- `styles.css`: diseño visual, consola, perillas, medidor y adaptación móvil.
- `script.js`: datos de casos, estado, controles, evaluación, retroalimentación e historial.
- `README.md`: documentación de uso y personalización.

## Cómo ejecutar

Abre `index.html` directamente en un navegador moderno. No requiere instalación, compilación, backend ni dependencias externas.

## Cómo modificar o agregar casos

Los casos están en el arreglo `cases` dentro de `script.js`. Cada caso contiene:

- `id`, `title`, `context`, `problem`, `objective`, `difficulty`.
- `options`: cuatro listas con `needs`, `audiences`, `messages` y `media`.
- `compatibility`: matrices de compatibilidad para las seis relaciones evaluadas.

Cada opción debe tener `id`, `label`, `description` y `tags`. Las etiquetas ayudan a calcular compatibilidad aproximada cuando una pareja no está definida explícitamente.

## Sistema de puntuación

La puntuación total se calcula con seis relaciones:

- Necesidad del público ↔ Público: 20 %
- Necesidad del público ↔ Mensaje: 20 %
- Público ↔ Mensaje: 20 %
- Público ↔ Medio: 15 %
- Mensaje ↔ Medio: 15 %
- Necesidad del público ↔ Medio: 10 %

Cada relación recibe un valor de 0 a 100. Si la combinación existe en la matriz del caso, se usa ese valor. Si no existe, el sistema compara etiquetas semánticas compartidas y genera una estimación limitada para no convertir la actividad en una única respuesta correcta.

## Personalizar ponderaciones

Edita el objeto `relationWeights` en `script.js`. La suma recomendada es `1.0`. Si cambias los pesos, revisa también las discusiones pedagógicas para que la retroalimentación siga correspondiendo a los criterios del curso.

## Borrar progreso

La aplicación guarda historial básico en `localStorage`. Para eliminarlo desde la interfaz, usa el botón “Borrar progreso”. También puedes borrar los datos del sitio desde las herramientas del navegador.

## Publicar con GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube `index.html`, `styles.css`, `script.js` y `README.md`.
3. En GitHub, entra a Settings → Pages.
4. Selecciona la rama principal y la carpeta raíz.
5. Abre la URL publicada cuando GitHub Pages termine el despliegue.

## Limitaciones conocidas

- El historial se guarda solo en el navegador del usuario.
- No hay exportación de resultados a archivo.
- Las compatibilidades son un modelo pedagógico editable, no una medición objetiva de efectividad publicitaria.
- El modo de discusión oculta el puntaje, pero la retroalimentación cualitativa sigue dando pistas para orientar la conversación.
