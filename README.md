# Padel Academy

Web de **Daniel Palenzuela**, entrenador nacional de pádel de España con más de 15 años de experiencia.
Página estática (HTML + CSS + JavaScript, sin dependencias), en castellano, inglés y danés.

## Estructura

```
index.html              Página única
assets/css/styles.css   Estilos
assets/js/i18n.js       Textos en ES / EN / DA
assets/js/app.js        Selector de idioma, vídeos, agenda de reservas, colaboradores
assets/img/             Foto de Daniel y favicon
```

## Secciones

1. **Cabecera**: presentación de Daniel, selector de idioma (ES · EN · DA) y botón de WhatsApp (+45 71 38 08 94)
2. **Sobre mí**: técnica, juego de paredes y táctica
3. **Vídeos**: tres vídeos de YouTube
4. **Reservas**: tipo de clase → día → hora → nombre y teléfono → confirmación con un mensaje de WhatsApp ya escrito
5. **Colaboradores**: marcas de equipamiento y un apartado para nuevos anunciantes

## Configuración rápida (`assets/js/app.js`)

- `CONFIG.defaultLang`: idioma inicial (`'es'`, `'en'`, `'da'` o `'auto'` para usar el del navegador)
- `CONFIG.hours`: horas de clase que se muestran cada día
- `VIDEOS`: enlaces de YouTube
- `PARTNERS`: colaboradores; las marcas actuales **son de ejemplo para la demo**

También se puede forzar el idioma con la URL: `?lang=da`, `?lang=en`, `?lang=es`.

## Pendiente para producción

- [ ] Precios reales (ahora `[PRECIO]` / `[PRICE]` / `[PRIS]` en `i18n.js`)
- [ ] Conectar la agenda al calendario real (Google Calendar, Cal.com o Calendly). Ahora la ocupación es simulada (`isBooked` en `app.js`)
- [ ] Incrustar los reproductores de YouTube (ahora son tarjetas que abren YouTube)
- [ ] URL real del canal de YouTube
- [ ] Colaboradores reales con sus logotipos
- [ ] Revisión de los textos en danés por un nativo

## Publicar con GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
La web quedará en `https://vicotek.github.io/padel-academy/`.
