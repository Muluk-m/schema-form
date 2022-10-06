/* eslint-disable jsx-a11y/alt-text */
import { defineComponent } from 'vue';
import { createNamespace } from '@v3sf/shared';
import mobileSimulatorSvg from '../../svg/mobile-simulator.svg';
import './styles.scss';

const [name, bem] = createNamespace('MobileSimulator');

export const MobileSimulator = defineComponent({
  name,
  setup: (_, { slots }) => {
    return () => (
      <div class={name}>
        <div class={bem('content')}>
          <div
            class={bem('body')}
            style={{
              minWidth: 0,
            }}
          >
            <div
              class={bem('wrapper')}
              style={{
                position: 'relative',
                minHeight: 1000,
              }}
            >
              <img
                src={mobileSimulatorSvg}
                style={{
                  display: 'block',
                  margin: '20px 0',
                  width: 460,
                  height: '946.667px',
                  boxShadow: '0 0 20px #0000004d',
                  borderRadius: '50px',
                  backfaceVisibility: 'hidden',
                }}
              />
              <div
                class={bem('body-content')}
                style={{
                  position: 'absolute',
                  width: '414px',
                  height: '736px',
                  top: '126.667px',
                  left: '23.3333px',
                  overflow: 'hidden',
                }}
              >
                {slots?.default?.()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
