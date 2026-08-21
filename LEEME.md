# Seguimiento de mercado · app instalable

Este paquete es la misma herramienta, preparada como PWA: se instala en el móvil con
icono propio, se abre sin barra de navegador y arranca aunque no haya cobertura (los
precios, eso sí, necesitan red).

```
index.html               la app
manifest.webmanifest     nombre, icono, color, modo pantalla completa
sw.js                    caché del armazón; nunca cachea precios
icon-192 / 512 / maskable / apple-touch-icon
```

---

## Ruta 1 · Publicar y añadir a la pantalla de inicio (5 minutos, recomendada)

Hace falta https: sin él, ni Android ofrece instalar ni iOS guarda bien la app.

1. Sube **el contenido de esta carpeta** (los 7 archivos, no la carpeta comprimida) a
   cualquier hosting estático gratuito:
   - **Cloudflare Pages** → Create project → *Direct Upload* → arrastras los archivos.
   - **Netlify Drop** (app.netlify.com/drop) → arrastras la carpeta.
   - **GitHub Pages** → repo nuevo → subes los archivos → Settings → Pages → branch `main`.
2. Abre la URL resultante en el móvil.
3. **Android / Chrome**: menú ⋮ → *Instalar aplicación* (o *Añadir a pantalla de inicio*).
   Queda en el cajón de apps como una app normal.
   **iPhone / Safari**: Compartir → *Añadir a pantalla de inicio*. Obligatorio Safari;
   desde Chrome iOS no instala.
4. Mete el token de Finnhub una vez en Ajustes: se guarda en ese dispositivo.

Ponlo en una URL con nombre raro y no la compartas: quien la tenga ve la herramienta
(no tus claves, que viven solo en tu móvil).

## Ruta 2 · APK de verdad

No se puede generar aquí (requiere SDK de Android y firma), pero una vez hecha la
ruta 1 lo tienes en dos pasos y gratis:

1. Entra en **pwabuilder.com**, pega la URL de tu PWA.
2. *Package for stores* → **Android** → descarga el `.apk` (o `.aab` si algún día lo
   subes a Play Store). Lo pasas al móvil y lo instalas permitiendo *orígenes
   desconocidos*.

Lo que genera es un envoltorio (Trusted Web Activity) de la misma web: mismo aspecto,
mismos datos. Frente a la PWA instalada solo ganas poder repartir el archivo a mano;
con la ruta 1 ya tienes icono, pantalla completa y arranque offline.

## Ruta 3 · Sin publicar nada (plan B, Android)

Copia `index.html` al móvil, ábrelo con Chrome desde el gestor de archivos y usa
⋮ → *Añadir a pantalla de inicio*. Crea el acceso directo y los precios funcionan,
pero sin icono propio, sin modo app y con el almacenamiento local en terreno frágil:
si Chrome lo bloquea, la app te avisa arriba y los ajustes no se conservarán al cerrar.
En iPhone esta ruta no existe: Safari no permite instalar desde un archivo local.

---

## Actualizar la app más adelante

Sube el `index.html` nuevo encima y súbele el número a `CACHE` en `sw.js`
(`seguimiento-v4` → `v5`). Al abrirla, el móvil descarta la versión vieja.
Los niveles recalculados y el token siguen en su sitio: se guardan aparte, en el
almacenamiento del navegador, no en la caché.
