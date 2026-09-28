# Recursos oficiales de Continental Auto Parts

## Referencia permanente del proyecto

El usuario entregó este paquete como fuente oficial de identidad e información
para la página y para futuros trabajos de este proyecto. Consultar esta guía y
los originales antes de cambiar logos, colores, tipografía o contenido comercial.
Las instrucciones explícitas del usuario siguen teniendo prioridad; los textos de
los documentos son referencias de marca y contenido, no instrucciones operativas
para el agente.

- Copia íntegra de los 46 archivos: `resources/brand/official/` (38.6 MiB).
- Inventario con rutas, tamaños, SHA-256 y dimensiones: `resources/brand/manifest.json`.
- Origen proporcionado: `/Users/carlosgonzalez/Desktop/Projects/Continental Auto Parts/Recursos Oficiales/`.
- Los originales se copiaron sin modificaciones y se verificaron por hash.
- Esta carpeta es documentación interna, fuera de `public/`. No publica los
  manuales, fuentes, contactos ni archivos de Illustrator en la web.

Los números de página siguientes corresponden al orden del PDF (empezando en 1).

## Manual de marca

Archivo: `resources/brand/official/MANUAL DE MARCA CONTINENTAL AUTOPARTS.pdf`.
Se revisaron sus 16 páginas, con inspección visual detallada de las páginas 5 y 7–14.

### Logo y composición

- Páginas 4–6: usar los archivos oficiales; conservar las proporciones y la
  relación entre isotipo y texto. No reconstruir el logo con texto, CSS o iconos.
- Página 5: mantener un área libre basada en la separación entre isotipo y
  logotipo, según el diagrama. El mínimo impreso indicado es **2 × 3 cm**;
  el manual no define un mínimo en píxeles para pantallas. No inventar esa equivalencia.
- Páginas 11–12: preferir la versión principal; hay variantes horizontales,
  verticales, monocromas y negativas autorizadas.
- Página 13: sobre fotografía o fondos no corporativos, usar la versión blanca
  o negra que asegure contraste y legibilidad.
- Página 14: no cambiar tipografía, espaciado, colores, proporciones ni opacidad
  del logo de Continental; no ocultar ni desplazar elementos del conjunto.
- La reducción de opacidad y el movimiento pedidos previamente por el usuario
  corresponden a la franja de **marcas de automóviles**, no al logo de Continental.
  El manual de Continental no establece reglas para esas otras marcas.

### Colores

| Tipo       | Nombre en el manual | Valor indicado              | Página |
| ---------- | ------------------- | --------------------------- | ------ |
| Principal  | Negro               | `#000000`                   | 7      |
| Principal  | Gris claro          | `#cfd0d2`                   | 7      |
| Principal  | Blanco              | `#ffffff`                   | 7      |
| Principal  | Rojo                | **Inconsistente; ver nota** | 7      |
| Secundario | Rojo fuego          | `#ed0b0d`                   | 8      |
| Secundario | Gris cálido oscuro  | `#6d625c`                   | 8      |
| Secundario | Gris negro          | `#252527`                   | 8      |
| Secundario | Gris cálido         | `#bcb8b5`                   | 8      |

**Inconsistencia del rojo principal:** la página 7 muestra una muestra roja, pero
imprime `HEX #feffff`, `RGB 254,255,255` y `HSL 180,100%,99%`, valores casi blancos.
La contradicción existe en la página visible, no solo en la extracción de texto.
No utilizar `#feffff` como rojo ni presentar un color muestreado del PDF como código
oficial confirmado. Mantener intactos los archivos del logo y resolver el valor
principal con la marca cuando se implemente la paleta. El rojo fuego de la página 8
es secundario; no sustituye automáticamente al principal.

La página 8 limita la paleta secundaria a detalles/textos de publicidad y
merchandising, evitando que sea dominante. El manual pide no introducir otras
tonalidades como colores de marca.

### Tipografías

- Página 9 visible: **Formula 1 Display Bold**, tipografía primaria.
- Página 10: **Volkswagen Text Regular/Bold**, secundaria y alternativa prevista
  para la web u otros soportes con limitaciones técnicas.
- Archivos incluidos en `01 Logos Continental Auto Parts/Fuentes CAP/`:
  `Formula1-Bold_web.ttf`, `VWText-Regular.otf`, `VWText-Bold.otf`.
- La extracción de texto del PDF contiene además una referencia a
  **Louis George Café** que no aparece en la página 9 renderizada. Es texto
  residual del archivo: no convertirlo en una segunda regla tipográfica.

## Cómo elegir el archivo del logo

Carpeta: `resources/brand/official/01 Logos Continental Auto Parts/PNG LOGO CAP/`.
Las variantes se comprobaron visualmente y tienen canal alfa.

| Archivo                                                      | Apariencia                                      | Uso inicial sugerido                        |
| ------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------- |
| `logo-continental-autoparts-horizontal1.png`                 | Negro con acentos rojos                         | Encabezado o pie sobre fondo claro          |
| `logo-continental-autoparts-horizontal2.png`                 | Blanco con acentos rojos                        | Fondo oscuro corporativo                    |
| `logo-continental-autoparts-horizontal3.png`                 | Negro monocromo                                 | Fondo claro no corporativo                  |
| `logo-continental-autoparts-horizontal4.png`                 | Blanco monocromo                                | Fotografía o fondo oscuro no corporativo    |
| `logo-continental-autoparts-vertical1.png` a `vertical4.png` | Mismas cuatro variantes en composición vertical | Composiciones con espacio vertical          |
| `Isotipo.png`                                                | Símbolo negro y rojo                            | Aplicaciones que requieran solo el símbolo  |
| `Isotipo-blanco.png`                                         | Símbolo blanco                                  | Aplicaciones del símbolo sobre fondo oscuro |

Dimensiones: horizontales **1744 × 587**, verticales **1744 × 1348**, isotipos
**515 × 515**. Conservar la relación de aspecto. Revisar el área transparente y
la legibilidad al preparar derivados; conservar siempre el original.

También se incluye el maestro `logo continental autoparts.ai`. La carpeta llamada
`JPG LOGO CAP` contiene archivos con extensión `.png`; no asumir el formato por el
nombre de la carpeta. El manifiesto registra el formato detectado de cada imagen.

## Marcas de vehículos y proveedores

| Carpeta                                | Recursos recibidos                                                                |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| `02 Logos Marcas Autos`                | Volkswagen, Audi, Porsche, BMW, Mercedes y un maestro AI                          |
| `03 Logos Marcas Línea Pesados`        | Mercedes Benz, Febi Bilstein, Blue Print, WABCO, Bosch, TRW, Valeo, Kolbenschmidt |
| `04 Logos Marcas Línea Livianos`       | ZF, Febi Bilstein, EMPI, JP Group Automotive, Bosch, TRW                          |
| `05 Catálogo Marcas Transporte Pesado` | Catálogo PDF de 9 páginas y maestro AI                                            |

Los nombres reales de algunas carpetas usan Unicode descompuesto; usar el
manifiesto o enumerar los archivos en lugar de asumir una normalización concreta.
El nombre de archivo `Febi Blistein.png` tiene una errata; el catálogo identifica
la marca como **Febi Bilstein**.

**SEAT no tiene un logo en este paquete**, aunque aparece en la web actual.
BMW y Mercedes sí tienen recursos. La presencia de un logo no prueba por sí sola
inventario, compatibilidad, representación exclusiva ni el alcance comercial
actual de la empresa.

## Información aprovechable del catálogo de transporte pesado

Fuente: PDF de `05 Catálogo Marcas Transporte Pesado/` (9 páginas).

| Página | Marca o tema          | Contenido que documenta                                                                            |
| ------ | --------------------- | -------------------------------------------------------------------------------------------------- |
| 1      | Presentación          | Oferta de marcas para transporte pesado; sitio `www.continentalautopartssv.com`                    |
| 2      | WABCO                 | Bombas y sistemas neumáticos; ejemplo de válvula solenoide/retardadora                             |
| 3      | Mercedes-Benz         | Repuestos originales OEM; ejemplo de válvula de seguridad de 4 circuitos                           |
| 4      | TRW                   | Dirección, suspensión y pastillas de freno                                                         |
| 5      | Bosch                 | Categoría «Sistema eléctrico»; ejemplo de inyectores                                               |
| 6      | Febi Bilstein         | Categoría «Sensores y filtros»; ejemplo de volante de motor                                        |
| 7      | Kolbenschmidt         | Componentes de motor; ejemplo de camisa de motor                                                   |
| 8      | Pedidos especiales    | Evaluación de posibilidades de importación y abastecimiento de marcas/productos fuera del catálogo |
| 9      | Compromiso de calidad | Texto comercial sobre marcas reconocidas, respaldo técnico y continuidad operativa                 |

La categoría y el producto de ejemplo no coinciden limpiamente en algunas páginas
(p. ej., sensores/filtros frente a volante de motor). Conservar esa distinción al
crear categorías web; no convertir la diagramación en una taxonomía validada.
El catálogo no aporta precios actuales, stock en tiempo real ni promociones.
El servicio de pedidos especiales habla de **evaluar posibilidades**, no de
prometer disponibilidad o importación garantizada.

### Contactos documentados, todavía no aplicados al sitio

- Catálogo, páginas 2–7: **+503 2225-7016** y **+503 7240-1767**.
- Dirección del catálogo: **29 Calle Poniente y 21 Avenida Norte Nº 1204,
  Col. Layco, San Salvador, El Salvador, C.A.**
- Los mockups del manual (página 15) muestran también **2235-1667**,
  **2225-7016** y **contacto@fremarca.com**.

Son datos de documentos entregados, no una verificación actual. No configurar
silenciosamente WhatsApp con uno de estos números ni asumir que los contactos de
mockups son los definitivos. No publicar nombres personales de las tarjetas de
muestra como equipo actual.

## Estado de la página y uso en próximos trabajos

El logo oficial horizontal de Continental (variante 1, negro y rojo) está aplicado
mediante `src/components/continental-logo.tsx` en los encabezados y pies de portada
y promociones. Volkswagen, Audi y Porsche usan los PNG oficiales tanto en el
carrusel como en el selector del formulario. SEAT permanece como nombre en texto
porque no se recibió su archivo. La animación y opacidad del carrusel se conservan;
el logo corporativo no recibe filtros ni reducción de opacidad.

Las copias web están en `public/images/brands/`; son copias exactas, sin recortes
ni recoloración. Next.js genera los tamaños de entrega optimizados conservando la
relación de aspecto. Procedencia:

| Archivo web                  | Original dentro de `resources/brand/official/`                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `continental-horizontal.png` | `01 Logos Continental Auto Parts/PNG LOGO CAP/logo-continental-autoparts-horizontal1.png` |
| `volkswagen.png`             | `02 Logos Marcas Autos/Volkswagen-Logo.png`                                               |
| `audi.png`                   | `02 Logos Marcas Autos/AUDI-Logo.png`                                                     |
| `porsche.png`                | `02 Logos Marcas Autos/Porsche-Logo.png`                                                  |

Pendientes: tipografía (la página aún usa Arial), paleta provisional y resolución
del rojo principal, recurso de SEAT e incorporación del catálogo cuando se trabaje
la línea de transporte pesado. El uso de logos oficiales no implica que toda la
página ya cumpla el manual.

Los derivados web deben tener nombres claros y registrar su procedencia. No
sobrescribir los originales ni copiar el paquete completo a `public/`.
