# Balance de proyectiles y defensas

Referencia generada desde `src/config.ts`.

Notas:

- HP por bloque: Identidad `70`, Imagen `49`, Reputacion `35`.
- Daño directo estimado: `baseDamage * multiplicador * damageScale`.
- `damageScale` actual: `0.58`.
- El daño real tambien depende de la velocidad/impacto del proyectil.
- El daño maximo por impacto directo tiene tope de `95`.
- Las curas pueden pasar del 100% y convertirse en armadura hasta el limite definido en el juego.

## Proyectiles

| Proyectil | Usos | Daño base | Identidad | Imagen | Reputacion | Area | Descripcion |
|---|---:|---:|---:|---:|---:|---|---|
| Rumor | 1 | 45 | x0.60 / 16 | x1.10 / 29 | x1.45 / 38 | No | Version no verificada que circula con rapidez y obliga a responder antes de que se vuelva creible. |
| Mala experiencia | 1 | 70 | x0.80 / 32 | x1.55 / 63 | x1.05 / 43 | No | Cliente afectado o servicio fallido que expone una brecha entre la promesa y la experiencia real. |
| Crisis en redes | 2 | 90 | x0.55 / 29 | x1.35 / 70 | x1.65 / 86 | Radio 115, daño 20 | Conversacion viral negativa que concentra atencion publica y acelera la presion sobre la organizacion. |
| Investigacion periodistica | 2 | 115 | x1.35 / 90 | x1.10 / 73 | x1.45 / 97 | No | Hallazgo documentado por medios que pone a prueba la consistencia entre discurso, evidencia y decisiones. |
| Escandalo ambiental | 3 | 135 | x1.80 / 141 | x1.00 / 78 | x1.25 / 98 | Radio 150, daño 34 | Crisis etica o ambiental que cuestiona practicas de fondo y exige una respuesta verificable. |

Los numeros despues de `/` son daño directo aproximado con factor de impacto `1.0`, antes de aplicar el tope global de `95`.

Turnos: la defensa inicia y el ataque tiene `9` proyectiles. La partida termina al resolver el ultimo ataque si el castillo no cae antes, por lo que ambos jugadores tienen `9` turnos.

## Defensas

| Defensa | Usos | Cura base | Identidad | Imagen | Reputacion | Descripcion |
|---|---:|---:|---:|---:|---:|---|
| Comunicado de prensa | 9 | 42 | No aplica | x1.25 / 53 | x1.00 / 42 | Ordena la informacion disponible, fija postura publica y reduce incertidumbre. |
| Disculpa publica | 6 | 50 | No aplica | x1.00 / 50 | x1.25 / 63 | Reconoce el daño, asume responsabilidad y abre una ruta de reparacion. |
| Informe de transparencia | 7 | 58 | x1.35 / 78 | x1.00 / 58 | x1.00 / 58 | Entrega evidencia, datos y criterios para que la respuesta pueda ser verificada. |
| Correccion interna | 6 | 65 | x1.45 / 94 | x1.10 / 72 | No aplica | Cambia procesos, responsables o protocolos para corregir el origen del problema. |
| Publicidad | 6 | 46 | No aplica | x1.45 / 67 | x0.85 / 39 | Refuerza mensajes positivos y busca recuperar atencion favorable. |
| Donacion | 4 | 40 | No aplica | x0.65 / 26 | x1.60 / 64 | Gesto social visible que intenta demostrar compromiso con una causa o comunidad. |
| Accion comunitaria | 4 | 56 | x1.20 / 67 | No aplica | x1.25 / 70 | Trabajo directo con grupos afectados para reconstruir confianza desde acciones concretas. |

Los numeros despues de `/` son curacion potencial. En partida, la curacion real puede convertirse en armadura si el bloque supera el 100%, hasta el limite permitido.

Potencial recuperable aproximado si cada carta se usa sobre su bloque mas favorable: `2897`, equivalente a `1.71x` la resistencia base total del castillo (`1694`).
