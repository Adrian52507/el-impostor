# 🎯 Guía de Sincronización de Animaciones y Sonidos

## 📋 Resumen

Ahora **TODAS las animaciones y sonidos dependen de UN ÚNICO objeto de configuración**: `ANIMATION_CONFIG`. Esto garantiza que **NADA se pueda desincronizar**.

## 🎬 Cómo Funciona

### Arquitectura de Timeline Centralizado

```
CLICK → Desaceleración (0.8s) → EXPLOSIÓN COMIENZA
                                    ↓
          ┌─────────────────────────────────────────┐
          │     TIMELINE UNIVERSAL (3.0s total)     │
          └─────────────────────────────────────────┘
               ↓              ↓                ↓
          Explosión    Sonido + Texto    Barrido Rojo
          de Caras     @0.8s             @0.95s
```

### Variables de Control

```typescript
const ANIMATION_CONFIG = {
  // Desaceleración
  slowdownDuration: 0.8,
  slowdownFactor: 0.65,
  
  // Explosión total
  explosionDuration: 3.0,        // ⏱️ Duración TOTAL de la explosión
  facesFadeDuration: 1.5,        // Cuánto tarda en desaparecer cada cara
  edgesFadeDuration: 1.5,        // Cuánto tarda en desaparecer los bordes (IDÉNTICO)
  
  // Texto y sonido
  textAppearanceDelay: 0.8,      // Cuándo aparece el texto DESPUÉS de explosión
  textAnimationDuration: 0.25,   // Cuánto tarda en animar el aparecer
  textRedSweepDelay: 0.95,       // Cuándo empieza el barrido rojo
  textRedSweepDuration: 0.5,     // Cuánto dura el barrido rojo
  
  // Audio
  audioPlayDelay: 0.8,           // Cuándo suena el audio
  
  // Velocidades
  facesExplosionSpeed: (index: number) => 4 + index * 0.5,
};
```

## 🔧 Cómo Hacer Cambios

### Ejemplo 1: Quiero que la explosión dure más

```typescript
// Antes: 3.0 segundos
explosionDuration: 3.0,

// Después: 4.5 segundos
explosionDuration: 4.5,
// ✅ TODO se ajustará automáticamente (más lento, más fluido)
```

### Ejemplo 2: Quiero que el sonido se retrasedemore más

```typescript
// Antes: Suena a los 0.8 segundos
audioPlayDelay: 0.8,

// Después: Suena a los 1.2 segundos
audioPlayDelay: 1.2,
// ✅ El texto también vendrá después automáticamente
```

### Ejemplo 3: Quiero que el texto aparezca DESPUÉS que el sonido

```typescript
// El sonido toca a los 0.8s
audioPlayDelay: 0.8,

// El texto aparece a los 1.0s
textAppearanceDelay: 1.0,
// ✅ El texto saldrá 0.2s después del sonido
```

### Ejemplo 4: Cambiar la velocidad de explosión

```typescript
// Caras más rápidas
facesExplosionSpeed: (index: number) => 6 + index * 0.7,  // Más rápido

// Caras más lentes
facesExplosionSpeed: (index: number) => 2 + index * 0.3,  // Más lento
```

## 🎨 Cómo se USA al Renderear

### En el Loop de Animación (useFrame)

```typescript
// Se actualiza en cada frame
timelineRef.current.elapsedTime += delta;  // Suma el tiempo del frame

// Se calcula el progreso (0 a 1)
timelineRef.current.progress = Math.min(
  timelineRef.current.elapsedTime / ANIMATION_CONFIG.explosionDuration,
  1.0
);

// Todas las animaciones USAN este timeline:
const faceFadeProgress = Math.min(
  timelineRef.current.elapsedTime / ANIMATION_CONFIG.facesFadeDuration,
  1.0
);

// Y así se aplican:
mesh.material.opacity = Math.max(0, 1 - faceFadeProgress * 1.5);
```

## ✅ Qué Está Sincronizado

| Elemento | Depende De | Garantizado |
|----------|-----------|-------------|
| Explosión de caras | `explosionDuration` | ✅ Perfecto |
| Desvanecimiento de caras | `facesFadeDuration` | ✅ Perfecto |
| Desvanecimiento de bordes | `edgesFadeDuration` | ✅ Perfecto |
| Sonido | `audioPlayDelay` | ✅ Perfecto |
| Aparición de texto | `textAppearanceDelay` | ✅ Perfecto |
| Animación de texto | `textAnimationDuration` | ✅ Perfecto |
| Barrido rojo | `textRedSweepDelay` + `textRedSweepDuration` | ✅ Perfecto |

## 🎯 Ventajas de Este Sistema

1. **NO hay hardcoding de tiempos** - Todo está centralizado
2. **Un cambio, todo se ajusta** - Modificas 1 número, todo cambia
3. **IMPOSIBLE desincronizar** - Todo usa el mismo timeline universal
4. **Fácil de debuggear** - Solo miras `ANIMATION_CONFIG`
5. **Escalable** - Si añades más animaciones, solo añades líneas a `ANIMATION_CONFIG`

## 🔴 Advertencia

⚠️ **NO modifiques `faceDataRef.current[index].time`** - Ya no se usa. 
El sistema ahora usa `timelineRef.current.elapsedTime` que es universal.

## 📝 Ajustes Recomendados

Si las animaciones se ven raras, prueba estos valores:

```typescript
// "Suave y lento" (estilo cinemático)
explosionDuration: 4.0,
facesFadeDuration: 2.0,
textAppearanceDelay: 1.5,
textRedSweepDelay: 2.0,

// "Rápido y punchy" (estilo video game)
explosionDuration: 1.5,
facesFadeDuration: 0.8,
textAppearanceDelay: 0.5,
textRedSweepDelay: 0.7,
```

¡Ahora todo está perfectamente sincronizado! 🎊
