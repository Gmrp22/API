# 📚 Plan de Aprendizaje: Error Handling en Backend

## 🎯 Objetivo
Aprender a manejar errores correctamente en tu API, paso a paso, desde lo básico hasta lo avanzado.

---

## 📖 FASE 1: Entender el Problema Actual (15 min)

### ¿Qué aprenderás?
- Por qué el manejo de errores actual tiene problemas
- Qué pasa cuando algo falla en tu código

### Tareas:
1. **Lee tu código actual** en `src/controllers/auth.js` y `src/services/auth.service.js`
2. **Identifica los problemas:**
   - ¿Qué pasa si el email ya existe?
   - ¿Qué pasa si falta el email o password?
   - ¿Qué pasa si la base de datos falla?
   - ¿El usuario recibe un mensaje útil?

### Respuestas a las preguntas:

#### ¿Qué pasa si el email ya existe?
**Respuesta:** 
- En `auth.service.js` línea 11-12: Se lanza `throw new Error('User already exists')`
- Este error se captura en línea 20-22 y se vuelve a lanzar como `throw new Error('Registration failed: User already exists')`
- En el controller (línea 12-14), se captura y se responde con `400 Bad Request` y mensaje genérico "Bad request"
- **Problema:** El usuario no sabe QUÉ está mal, solo que es un "bad request"

#### ¿Qué pasa si falta el email o password?
**Respuesta:**
- Si falta `email` o `password`, `registerUser()` intentará ejecutarse igual
- Prisma podría fallar o el código podría intentar hacer `bcrypt.hash(undefined)`
- El error sería genérico y poco útil
- **Problema:** No hay validación temprana, el error llega tarde y es confuso

#### ¿Qué pasa si la base de datos falla?
**Respuesta:**
- Si Prisma falla (conexión perdida, timeout, etc.), el error se captura en línea 20
- Se convierte en `throw new Error('Registration failed: [mensaje técnico]')`
- El controller responde con `400 Bad Request`
- **Problema:** Un error del servidor (500) se reporta como error del cliente (400)

#### ¿El usuario recibe un mensaje útil?
**Respuesta:**
- NO. El usuario siempre recibe `{ error: "Bad request" }` sin más detalles
- En desarrollo, podría ver el stack trace, pero en producción no
- **Problema:** El usuario no sabe qué hacer para corregir el error

### Conceptos clave:
- **Try-catch**: Captura errores pero no siempre los maneja bien
- **Error genérico**: `throw new Error()` no dice mucho al usuario
- **Códigos HTTP**: 400, 401, 404, 500 tienen significados diferentes

---

## 📖 FASE 2: Mejorar el Error Handler Básico (30 min)

### ¿Qué aprenderás?
- Cómo funciona el middleware de errores en Express
- Cómo dar respuestas consistentes al cliente

### Tareas:
1. **Mejorar `src/middlewares/errorHandler.js`:**
   - Usar el logger (Pino) en lugar de `console.error`
   - Dar respuestas más informativas
   - Manejar diferentes tipos de errores

### Conceptos clave:
- **Middleware de errores**: Siempre va al final, recibe `(err, req, res, next)`
- **Estructura de respuesta**: Siempre el mismo formato
- **Logging**: Registrar errores para debugging

### Ejemplo de lo que aprenderás:
```javascript
// Antes: console.error(err.stack)
// Después: logger.error({ err, requestId }, 'Error occurred')
```

### Respuestas a las preguntas:

#### ¿Por qué usar logger en lugar de console.error?
**Respuesta:**
- `console.error` solo muestra en la consola, no se puede filtrar ni buscar
- Pino permite niveles (error, warn, info), formato estructurado, y puede enviar logs a servicios externos
- En producción, necesitas buscar errores específicos - con logs estructurados es más fácil

#### ¿Qué información debe tener una respuesta de error?
**Respuesta:**
- **Mensaje claro**: Qué salió mal en lenguaje humano
- **Código de error**: Para que las apps puedan reaccionar automáticamente
- **Request ID**: Para rastrear el error en los logs (opcional pero muy útil)
- **NO incluir**: Stack traces en producción, información sensible (passwords, tokens)

---

## 📖 FASE 3: Códigos de Error HTTP Correctos (20 min)

### ¿Qué aprenderás?
- Qué código HTTP usar para cada situación
- Cómo asignar códigos a errores

### Tareas:
1. **Aprender los códigos comunes:**
   - 400: Bad Request (datos inválidos)
   - 401: Unauthorized (no autenticado)
   - 403: Forbidden (no autorizado)
   - 404: Not Found (recurso no existe)
   - 409: Conflict (recurso ya existe)
   - 500: Internal Server Error (error del servidor)

2. **Aplicar en tu código:**
   - Usuario ya existe → 409
   - Email inválido → 400
   - Token inválido → 401

### Conceptos clave:
- **Status codes**: Le dicen al cliente qué tipo de error ocurrió
- **Consistencia**: Mismo código para el mismo tipo de error

### Respuestas a las preguntas:

#### ¿Cuándo usar 400 vs 409?
**Respuesta:**
- **400 Bad Request**: Datos inválidos o mal formateados (email sin @, password muy corto)
- **409 Conflict**: El request es válido pero viola una regla de negocio (email ya existe, username duplicado)
- **Regla simple**: Si el problema es con los DATOS → 400. Si el problema es con el ESTADO del recurso → 409

#### ¿Cuándo usar 401 vs 403?
**Respuesta:**
- **401 Unauthorized**: No estás autenticado (no tienes token, token inválido)
- **403 Forbidden**: Estás autenticado pero no tienes permiso (usuario normal intentando acceder a admin)
- **Regla simple**: 401 = "¿Quién eres?", 403 = "No puedes hacer eso"

#### ¿Cuándo usar 500?
**Respuesta:**
- **500 Internal Server Error**: Algo falló en el servidor que NO es culpa del cliente
- Ejemplos: Base de datos desconectada, error en código del servidor, servicio externo caído
- **NUNCA** usar 500 para errores que el cliente puede corregir (datos inválidos → 400)

---

## 📖 FASE 4: Errores Personalizados (Clases de Error) (45 min)

### ¿Qué aprenderás?
- Crear tipos de error específicos
- Por qué es mejor que `throw new Error()`

### Tareas:
1. **Crear clase base `AppError`:**
   ```javascript
   class AppError extends Error {
     constructor(message, statusCode) {
       super(message);
       this.statusCode = statusCode;
     }
   }
   ```

2. **Crear errores específicos:**
   - `ValidationError` (400)
   - `ConflictError` (409)
   - `NotFoundError` (404)
   - `UnauthorizedError` (401)

3. **Usar en tu servicio:**
   ```javascript
   // Antes: throw new Error('User already exists')
   // Después: throw new ConflictError('User already exists')
   ```

### Conceptos clave:
- **Herencia**: Las clases de error extienden de Error
- **Type safety**: Sabes qué tipo de error es
- **Reutilización**: Mismo error en diferentes lugares

### Respuestas a las preguntas:

#### ¿Por qué crear clases de error en lugar de solo `throw new Error()`?
**Respuesta:**
- **Claridad**: `throw new ConflictError()` es más claro que `throw new Error('User exists')`
- **Código HTTP automático**: La clase sabe que ConflictError = 409, no tienes que recordarlo
- **Filtrado**: Puedes hacer `if (err instanceof ConflictError)` en el error handler
- **Consistencia**: Todos los ConflictError se manejan igual

#### ¿Cómo funciona la herencia aquí?
**Respuesta:**
```javascript
class AppError extends Error {
  // AppError ES UN Error, pero con propiedades extra
  constructor(message, statusCode) {
    super(message);  // Llama al constructor de Error
    this.statusCode = statusCode;  // Agrega propiedad nueva
  }
}

class ConflictError extends AppError {
  // ConflictError ES UN AppError (y por tanto ES UN Error)
  constructor(message) {
    super(message, 409);  // Siempre usa statusCode 409
  }
}
```

---

## 📖 FASE 5: Manejar Errores de Prisma (30 min)

### ¿Qué aprenderás?
- Cómo Prisma lanza errores
- Cómo convertir errores de Prisma a errores amigables

### Tareas:
1. **Entender errores de Prisma:**
   - P2002: Unique constraint (email ya existe)
   - P2025: Record not found
   - P2003: Foreign key violation

2. **Convertir en el error handler:**
   ```javascript
   if (err.code === 'P2002') {
     return new ConflictError('Email already exists');
   }
   ```

### Conceptos clave:
- **Error codes**: Prisma usa códigos específicos
- **Traducción**: Convertir errores técnicos a mensajes de usuario

### Respuestas a las preguntas:

#### ¿Qué son los códigos P2002, P2025, etc.?
**Respuesta:**
- Son códigos de error específicos de Prisma
- Cada código representa un tipo de error de base de datos
- **P2002**: Violación de constraint único (dos registros con mismo valor único)
- **P2025**: Registro no encontrado cuando intentas actualizar/eliminar
- **P2003**: Violación de foreign key (referencias a registro que no existe)
- **P2014**: Relación requerida faltante

#### ¿Por qué convertir errores de Prisma?
**Respuesta:**
- Los errores de Prisma son técnicos: `PrismaClientKnownRequestError: Unique constraint failed`
- Los usuarios no entienden eso
- Necesitas mensajes amigables: "Este email ya está registrado"
- Además, Prisma no sabe el código HTTP correcto (409 vs 400)

---

## 📖 FASE 6: Propagación de Errores (30 min)

### ¿Qué aprenderás?
- Cómo dejar que los errores "suban" en el código
- Cuándo capturar y cuándo dejar pasar

### Tareas:
1. **Entender el flujo:**
   ```
   Controller → Service → Database
        ↑           ↑          ↑
        └───────────┴──────────┘
              (errores suben)
   ```

2. **Regla simple:**
   - **Service**: Lanza errores, NO los captura (a menos que puedas manejarlos)
   - **Controller**: NO captura errores, deja que lleguen al middleware
   - **Middleware**: Captura TODO y responde

3. **Refactorizar tu código:**
   - Quitar try-catch del controller
   - Quitar try-catch innecesario del service

### Conceptos clave:
- **Error propagation**: Los errores suben en la pila de llamadas
- **Centralización**: Un solo lugar maneja todos los errores

### Respuestas a las preguntas:

#### ¿Por qué NO capturar errores en el controller?
**Respuesta:**
- Si capturas en el controller, tienes que manejar el error ahí mismo
- Cada controller tendría código duplicado de manejo de errores
- Si olvidas capturar en un controller, el error se "pierde"
- **Mejor**: Dejar que el error suba hasta el middleware centralizado

#### ¿Cuándo SÍ capturar errores?
**Respuesta:**
- Cuando puedes **manejarlo completamente** sin que llegue al cliente
- Ejemplo: Reintentar una operación, usar un valor por defecto
- En la mayoría de casos, NO captures - deja que suba

#### ¿Cómo funciona la propagación?
**Respuesta:**
```javascript
// Service lanza error
async function registerUser() {
  throw new ConflictError('User exists');  // Error se lanza
}

// Controller NO captura, error sube
async function register(req, res) {
  const user = await registerUser();  // Error sube desde aquí
  // Este código nunca se ejecuta
}

// Middleware captura TODO
function errorHandler(err, req, res, next) {
  // Aquí llega el error y se responde
}
```

---

## 📖 FASE 7: Request ID para Tracing (20 min)

### ¿Qué aprenderás?
- Cómo rastrear errores en producción
- Por qué necesitas un ID único por request

### Tareas:
1. **Crear middleware de Request ID:**
   - Generar UUID único por request
   - Agregarlo a los logs
   - Incluirlo en la respuesta

2. **Usar en logs:**
   ```javascript
   logger.error({ requestId: req.id, err }, 'Error occurred');
   ```

### Conceptos clave:
- **Tracing**: Seguir un request a través de los logs
- **Debugging**: Encontrar errores específicos en producción

### Respuestas a las preguntas:

#### ¿Por qué necesito un Request ID?
**Respuesta:**
- En producción, tienes miles de requests por segundo
- Si un usuario reporta un error, ¿cómo encuentras SU request específico en los logs?
- Con Request ID: Usuario te dice "mi request ID es abc-123", buscas en logs y encuentras TODO lo que pasó

#### ¿Cómo funciona el tracing?
**Respuesta:**
```
1. Request llega → Se genera Request ID: "abc-123"
2. Request ID se agrega a req.id
3. Cada log incluye el Request ID
4. Si hay error, se incluye en la respuesta
5. Usuario reporta error con Request ID
6. Buscas "abc-123" en logs → Encuentras todo el flujo
```

---

## 📖 FASE 8: Estructura de Respuesta Consistente (15 min)

### ¿Qué aprenderás?
- Formato estándar para todas las respuestas de error
- Por qué la consistencia es importante

### Tareas:
1. **Definir formato:**
   ```json
   {
     "error": {
       "code": "CONFLICT",
       "message": "User already exists"
     },
     "requestId": "uuid-here"
   }
   ```

2. **Aplicar en error handler**

### Conceptos clave:
- **Consistencia**: Mismo formato siempre
- **Machine-readable**: Códigos que las apps pueden leer
- **Human-readable**: Mensajes que los humanos entienden

### Respuestas a las preguntas:

#### ¿Por qué un formato consistente?
**Respuesta:**
- **Frontend**: Puede manejar errores de forma predecible
- **Debugging**: Siempre sabes dónde buscar la información
- **Documentación**: Más fácil documentar un formato que muchos formatos diferentes

#### ¿Qué es "machine-readable" vs "human-readable"?
**Respuesta:**
- **Machine-readable (code)**: `"code": "CONFLICT"` - La app puede hacer `if (error.code === 'CONFLICT')`
- **Human-readable (message)**: `"message": "User already exists"` - El humano entiende qué pasó
- Necesitas ambos: código para lógica, mensaje para mostrar al usuario

---

## 🎯 Resumen del Flujo Completo

```
1. Request llega
   ↓
2. Controller llama Service
   ↓
3. Service lanza error (ej: ConflictError)
   ↓
4. Error sube hasta el Error Handler Middleware
   ↓
5. Error Handler:
   - Loggea el error (con request ID)
   - Determina código HTTP
   - Formatea respuesta
   ↓
6. Cliente recibe respuesta estructurada
```

### Ejemplo Completo:

**Request:**
```http
POST /api/register
{ "email": "test@test.com", "password": "123" }
```

**Flujo:**
1. Controller recibe request
2. Llama `registerUser('test@test.com', '123')`
3. Service encuentra que email ya existe
4. Service lanza `throw new ConflictError('User already exists')`
5. Error sube al error handler
6. Error handler:
   - Loggea: `{ requestId: 'abc-123', error: ConflictError, ... }`
   - Determina: statusCode = 409
   - Formatea respuesta
7. Cliente recibe:
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "User already exists"
  },
  "requestId": "abc-123"
}
```

---

## 📝 Orden Recomendado de Implementación

1. ✅ **Fase 1**: Entender el problema (solo lectura)
2. ✅ **Fase 2**: Mejorar error handler básico
3. ✅ **Fase 3**: Aprender códigos HTTP
4. ✅ **Fase 4**: Crear clases de error
5. ✅ **Fase 5**: Manejar errores de Prisma
6. ✅ **Fase 6**: Refactorizar propagación
7. ✅ **Fase 7**: Agregar Request ID
8. ✅ **Fase 8**: Estandarizar respuestas

---

## 💡 Tips de Aprendizaje

- **No te apresures**: Una fase a la vez
- **Experimenta**: Prueba qué pasa si cambias algo
- **Lee los logs**: Entiende qué información te dan
- **Prueba errores**: Intenta crear errores a propósito para ver cómo se manejan

---

## ❓ Preguntas para Reflexionar (con Respuestas)

### Después de la Fase 1:
- **¿Entiendo por qué hice este cambio?**
  - Sí, porque el código actual no da información útil al usuario sobre qué salió mal
  
- **¿Qué problema resuelve?**
  - Resuelve que los usuarios reciban mensajes genéricos como "Bad request" sin saber qué corregir

- **¿Cómo mejoraría esto en producción?**
  - Los usuarios podrían reportar errores con más contexto, y los desarrolladores podrían debuggear más fácilmente

### Después de la Fase 2:
- **¿Entiendo por qué usar logger?**
  - Sí, porque permite buscar y filtrar errores en producción, mientras console.error solo muestra en consola

- **¿Qué problema resuelve?**
  - Resuelve la dificultad de encontrar errores específicos en producción cuando hay miles de requests

### Después de la Fase 3:
- **¿Entiendo los códigos HTTP?**
  - Sí, cada código tiene un significado específico que ayuda al cliente a entender qué tipo de error ocurrió

- **¿Qué problema resuelve?**
  - Resuelve que el cliente sepa si el error es su culpa (400) o del servidor (500), y puede reaccionar apropiadamente

### Después de la Fase 4:
- **¿Entiendo las clases de error?**
  - Sí, permiten crear tipos específicos de error con comportamiento predefinido

- **¿Qué problema resuelve?**
  - Resuelve tener que recordar qué código HTTP usar para cada tipo de error, y hace el código más claro

### Después de la Fase 5:
- **¿Entiendo los errores de Prisma?**
  - Sí, Prisma tiene códigos específicos que necesitan ser traducidos a mensajes amigables

- **¿Qué problema resuelve?**
  - Resuelve que los usuarios vean errores técnicos de base de datos en lugar de mensajes comprensibles

### Después de la Fase 6:
- **¿Entiendo la propagación?**
  - Sí, los errores suben naturalmente en la pila de llamadas hasta encontrar un manejador

- **¿Qué problema resuelve?**
  - Resuelve tener código duplicado de manejo de errores en cada controller, centralizando la lógica

### Después de la Fase 7:
- **¿Entiendo el Request ID?**
  - Sí, permite rastrear un request específico a través de todos los logs

- **¿Qué problema resuelve?**
  - Resuelve la dificultad de encontrar qué pasó con un request específico cuando hay miles de logs

### Después de la Fase 8:
- **¿Entiendo la consistencia?**
  - Sí, un formato estándar hace que el código del cliente sea más simple y predecible

- **¿Qué problema resuelve?**
  - Resuelve que el frontend tenga que manejar múltiples formatos de error diferentes

---

## 🚀 ¿Listo para empezar?

Empieza con la **Fase 1** y avanza paso a paso. Cuando termines una fase, avísame y pasamos a la siguiente.

**Recuerda**: No hay prisa. Es mejor entender bien cada concepto antes de pasar al siguiente.
