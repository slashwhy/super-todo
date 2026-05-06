import { ref, watch, type Ref } from 'vue'

export function useAnimatedCounter(source: Ref<number>, duration = 600) {
  const displayed = ref(0)
  let frame: number | null = null

  watch(
    source,
    (newVal) => {
      if (frame) cancelAnimationFrame(frame)

      const start = displayed.value
      const diff = newVal - start
      const startTime = performance.now()

      function step(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4)
        displayed.value = Math.round(start + diff * eased)

        if (progress < 1) {
          frame = requestAnimationFrame(step)
        }
      }

      frame = requestAnimationFrame(step)
    },
    { immediate: true },
  )

  return displayed
}
