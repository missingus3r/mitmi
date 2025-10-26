# Mitmi

## Descripción General
Mitmi es una innovadora app diseñada para personas que buscan relaciones a largo plazo y amistades genuinas. Con un enfoque en la conexión profunda, Mitmi prioriza el conocimiento mutuo sobre la apariencia física.

## Características Principales

### Enfoque en Relaciones a Largo Plazo:

Mitmi está orientada a quienes buscan relaciones serias y duraderas, fomentando conexiones auténticas basadas en intereses compartidos y valores similares. ❤️

### Primera Impresión Basada en Intereses:

Los usuarios pueden conocer los intereses y valores de las personas antes de ver sus fotos, promoviendo una conexión más profunda desde el principio. 🔍

### Formulario Detallado de Perfil:

Los usuarios completan un perfil detallado que incluye gustos, intereses, aspectos físicos, edad, altura, y más, asegurando que las sugerencias de match sean precisas y relevantes. 📋

### Opciones de Matching:

Posibilidad de hacer match basado en intereses compartidos o en fotos, según la preferencia del usuario.
Opción de buscar amistades y hacer match con hasta tres personas simultáneamente para fomentar grupos de amistad. 🤝

### Mensajería y Grupos de Chat:

Chats privados entre usuarios que han hecho match.
Grupos de chat para matches múltiples en la categoría de amistad, facilitando la interacción en pequeños grupos. 💬

### Wingman:

Una inteligencia artificial (IA) que sugiere los primeros pasos en la conversación, basándose en intereses compartidos, ayudando a romper el hielo y facilitar la interacción. 🤖

* Mitmi es completamente gratuita, con un botón de donaciones opcional para aquellos que deseen apoyar el desarrollo y mantenimiento de la plataforma. 💸
* Al priorizar intereses y valores sobre la apariencia, Mitmi fomenta conexiones más auténticas y significativas. 🌟
* Una interfaz limpia y amigable, diseñada para facilitar la navegación y la interacción. 📱
* Opciones para buscar tanto relaciones amorosas como amistades, permitiendo una experiencia más rica y diversa. 🌍


Mitmi no solo se centra en encontrar parejas, sino también en construir comunidades y amistades duraderas. Con un enfoque en la autenticidad y el conocimiento mutuo, Mitmi ofrece una plataforma única que destaca en el saturado mercado de aplicaciones de citas. Únete a nosotros y descubre conexiones más profundas y significativas.

## Stack Tecnológico

- **Backend**: Node.js + Express
- **Motor de Vistas**: EJS
- **Base de Datos**: MongoDB (Mongoose)
- **Autenticación**: Auth0
- **Chat en Tiempo Real**: Socket.IO
- **Subida de Archivos**: Multer

## Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Auth0
1. Crea una cuenta en [Auth0](https://auth0.com/)
2. Crea una nueva aplicación (Regular Web Application)
3. Configura las siguientes URLs en Auth0:
   - **Allowed Callback URLs**: `http://localhost:3000/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

### 3. Configurar variables de entorno
Actualiza el archivo `.env` con tus credenciales de Auth0:
```env
AUTH0_SECRET=tu-secret-generado-aqui
AUTH0_CLIENT_ID=tu-client-id-de-auth0
AUTH0_ISSUER_BASE_URL=https://tu-tenant.auth0.com
```

### 4. Inicializar las preguntas en la base de datos
```bash
node utils/seedQuestions.js
```

### 5. Iniciar el servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Flujo de la Aplicación

1. **Landing Page** - Explicación de cómo funciona en 3 pasos
2. **Login con Auth0** - Autenticación segura
3. **Configurar Perfil** - Responder 15 preguntas sobre intereses y preferencias
4. **Descubrir Matches** - Ver perfiles compatibles (sin fotos)
5. **Chatear** - Conocerse a través de conversaciones
6. **Revelar Fotos** - Ambos usuarios deben aceptar (el chat se pausa)
7. **Match por Fotos** - Decidir si hay química visual
8. **Match Completo** - Si ambos se gustan, el chat se reactiva

## Estructura del Proyecto

```
mitmi/
├── config/          # Configuración de BD y Auth0
├── models/          # Modelos de Mongoose (User, Match, Message, Question)
├── routes/          # Rutas de Express
├── controllers/     # Lógica de negocio
├── middleware/      # Middleware de autenticación
├── utils/           # Utilidades (algoritmo de matching, seed)
├── views/           # Plantillas EJS
│   ├── pages/       # Páginas completas
│   └── partials/    # Componentes reutilizables
├── public/          # Archivos estáticos
│   ├── css/         # Estilos
│   ├── js/          # JavaScript del cliente
│   └── images/      # Imágenes y uploads
└── server.js        # Punto de entrada de la aplicación
```

## Características Implementadas

✅ Landing page minimalista con explicación en 3 pasos
✅ Autenticación con Auth0
✅ Formulario de 15 preguntas variadas
✅ Algoritmo de matching por compatibilidad de intereses
✅ Chat en tiempo real con Socket.IO
✅ Sistema de revelación de fotos (requiere aceptación mutua)
✅ Segundo matching por fotos (el chat se pausa)
✅ Lógica completa: si ambos se gustan por fotos, el chat continúa; si no, se termina
✅ Preferencias de género, edad y altura
✅ Interfaz responsive y minimalista

## Características Pendientes

- Wingman AI (sugerencias de conversación)
- Matches grupales para amistades (hasta 3 personas)
- Botón de donaciones
- Notificaciones por email/push

## Documentación

Para más información sobre la arquitectura y desarrollo, consulta el archivo `CLAUDE.md`
