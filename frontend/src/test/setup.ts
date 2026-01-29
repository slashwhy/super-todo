import { config } from '@vue/test-utils'

// Stub RouterLink and RouterView to avoid conflicts when tests provide their own router
config.global.stubs = {
  RouterLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  RouterView: true,
}
