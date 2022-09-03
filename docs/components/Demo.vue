<!-- eslint-disable vue/no-v-html -->
<script lang="ts" setup>
import { ref, defineProps } from 'vue';
import { Schema, FormRef } from 'v3-schema-form';
import { Tabs, Tab, Button } from 'vant';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { createDataBySchema } from '../utils';
import 'highlight.js/styles/base16/zenburn.css';

const localMd = MarkdownIt({
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(lang, str).value;
    }

    return '';
  },
});

const props = defineProps<{
  schema: string;
  description: string;
  path: string;
}>();

const decodeSchema = decodeURIComponent(props.schema);
const parseSchema: Schema = JSON.parse(decodeSchema);
const decodeDescription = decodeURIComponent(props.description);
const data = ref(createDataBySchema(parseSchema));
const formRef = ref<FormRef>();
const active = ref('效果');
</script>

<template>
  <div class="v3sf-demo">
    <p v-html="localMd.render(decodeDescription)" />
    <Tabs v-model:active="active">
      <Tab title="效果" class="v3sf-demo__nav">
        <div class="v3sf-demo__view">
          <SchemaForm ref="formRef" v-model="data" :schema="parseSchema" debug />
          <div>
            <Button block round size="small" type="primary" @click="formRef?.validate(false)"
              >测试</Button
            >
          </div>
        </div>
      </Tab>
      <Tab title="Schema">
        <div
          class="v3sf-demo__code"
          v-html="
            localMd.render(`\`\`\`json
${decodeSchema}`)
          "
        />
      </Tab>
      <Tab title="Data">
        <div
          class="v3sf-demo__code"
          v-html="
            localMd.render(`\`\`\`json
${JSON.stringify(data, null, 2)}`)
          "
        />
      </Tab>
    </Tabs>
  </div>
</template>

<style lang="scss" scoped>
.v3sf-demo {
  width: 500px;

  &__view {
    padding: 5px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 5px;
  }

  &__code {
    padding: 5px 15px;
    background-color: var(--vp-code-block-bg);
    border-radius: 5px;
  }
}
</style>
