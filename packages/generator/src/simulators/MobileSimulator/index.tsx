import { defineComponent } from 'vue'

export const MobileSimulator = defineComponent({
  name: 'V3sfMobileSimulator',

  setup(_, { slots }) {
    return () => (
      <div class="v3sf-MobileSimulator">
        <div class="v3sf-MobileSimulator__content">
          <div class="v3sf-MobileSimulator__body">
            <div class="v3sf-MobileSimulator__frame">
              <div class="v3sf-MobileSimulator__notch" />
              <div class="v3sf-MobileSimulator__screen">{slots.default?.()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
