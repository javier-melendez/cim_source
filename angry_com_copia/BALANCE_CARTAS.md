# Balance de proyectiles y defensas

Referencia generada desde `src/config.ts`.

Notas:

- HP por bloque: Identidad `70`, Imagen `49`, Reputacion `35`.
- Daño directo estimado: `baseDamage * multiplicador * damageScale`.
- `damageScale` actual: `0.58`.
- El daño directo depende del tipo de proyectil y del bloque golpeado; la velocidad solo afecta la trayectoria.
- Todos los proyectiles usan la misma fisica: radio, densidad/peso, fuerza de lanzamiento, velocidad y trayectoria base. La diferencia entre cartas esta en el daño configurado y, en algunas cartas, daño de area sin empuje fisico.
- El daño directo se degrada por cubo unico tocado por el mismo proyectil: 1er cubo `100%`, 2do `80%`, 3ro `48%`, 4to `16%`, 5to `1.6%`, luego `0%`.
- El daño maximo por impacto directo tiene tope de `95`.
- Las curas pueden pasar del 100% y convertirse en armadura hasta el limite definido en el juego.

## Proyectiles

| Proyectil | Usos | Daño base | Identidad | Imagen | Reputacion | Area | Descripcion |
|---|---:|---:|---:|---:|---:|---|---|
| Falsos diferenciales | 1 | 52 | x0.55 / 17 | x1.45 / 44 | x0.35 / 11 | No | Comunica atributos comunes como si fueran ventajas unicas. Daña sobre todo el posicionamiento y empuja la decision hacia precio. |
| Comoditizacion | 1 | 68 | x0.35 / 14 | x1.65 / 65 | x0.55 / 22 | No | Vuelve a la marca reemplazable y generica. Es fuerte contra imagen/posicionamiento, pero debil contra reputacion acumulada. |
| Escandalo reputacional | 2 | 92 | x0.65 / 35 | x1.20 / 64 | x1.75 / 93 | Radio 115, daño 20 | Ataque con informacion negativa, real o sacada de contexto. Es un arma fuerte contra reputacion y requiere precision. |
| Brecha decir-hacer | 2 | 105 | x1.30 / 79 | x0.95 / 58 | x1.55 / 94 | No | Desfase entre discurso publico y conducta real. Golpea reputacion e identidad porque contradice lo que el actor dice ser. |
| Bumeran de marca | 3 | 118 | x0.90 / 62 | x1.70 / 116 | x1.25 / 86 | Radio 150, daño 32 | La promesa brillante de la marca se usa en su contra al revelar practicas ocultas. Es devastador contra imagen. |

Los numeros despues de `/` son daño directo del primer cubo tocado, antes de aplicar el tope global de `95`. En cubos siguientes se aplica la degradacion por orden de contacto.

Turnos: la defensa inicia y el ataque tiene `9` proyectiles. La partida termina al resolver el ultimo ataque si el castillo no cae antes, por lo que ambos jugadores tienen `9` turnos.

## Defensas

| Defensa | Usos | Cura base | Identidad | Imagen | Reputacion | Descripcion |
|---|---:|---:|---:|---:|---:|---|
| Variabilidad de codificacion | 8 | 38 | No aplica | x1.20 / 46 | No aplica | Repite el mensaje central con medios y ejecuciones distintas. Cura notoriedad e imagen, no una crisis reputacional. |
| Disculpa completa | 5 | 50 | x0.40 / 20 | x0.60 / 30 | x1.50 / 75 | Reconoce la falta, asume responsabilidad y ofrece reparacion. Cura con fuerza la reputacion si se percibe sincera. |
| Dialogo simetrico | 6 | 54 | x1.10 / 59 | x0.80 / 43 | x1.35 / 73 | Escucha, negocia y modifica conducta. Repara legitimidad y confianza mejor que una respuesta puramente persuasiva. |
| Auditoria RSC | 5 | 60 | x1.35 / 81 | x0.45 / 27 | x1.05 / 63 | Revisa practicas eticas y sociales para alinear lo que se es, se hace y se comunica. Cura identidad y reputacion. |
| Marca-experiencia | 6 | 50 | x0.70 / 35 | x1.15 / 57 | x1.10 / 55 | Repara desde experiencias consistentes en cada contacto. Fortalece imagen y reputacion de forma acumulada. |
| Educacion del consumidor | 4 | 45 | x0.75 / 34 | x1.25 / 56 | x0.45 / 20 | Enseña al publico a valorar atributos tecnicos o simbolicos. Protege posicionamiento y reduce la guerra de precios. |
| Auditoria de diferenciales | 4 | 40 | x0.80 / 32 | x1.20 / 48 | No aplica | Comprueba que el diferencial sea unico, valorado y comunicable. Previene promesas debiles y errores de posicionamiento. |

Los numeros despues de `/` son curacion potencial. En partida, la curacion real puede convertirse en armadura si el bloque supera el 100%, hasta el limite permitido.

Potencial recuperable aproximado si cada carta se usa sobre su bloque mas favorable: `2344`, equivalente a `1.38x` la resistencia base total del castillo (`1694`).
