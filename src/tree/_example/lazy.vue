<template>
  <t-space direction="vertical">
    <h3 class="title">数据延迟加载</h3>
    <p class="tips">默认为点击加载数据。</p>
    <p class="tips">
      valueMode 默认为 'onlyLeaf'。选中父节点时，子节点由于未加载，无法更新和获取选中状态，导致无法更新父节点的状态。
    </p>
    <p class="tips">所以使用延迟加载时，推荐 valueMode 设置为 'all' 或者 'parentFirst'。</p>
    <t-form label-width="150">
      <t-form-item label="可选">
        <t-switch v-model="checkable" />
      </t-form-item>
      <t-form-item label="严格模式">
        <t-switch v-model="checkStrictly" />
      </t-form-item>
    </t-form>
    <t-tree
      ref="tree"
      :data="items"
      hover
      expand-all
      :checkable="checkable"
      :check-strictly="checkStrictly"
      :load="load"
      value-mode="all"
      @load="onLoad"
    />
  </t-space>
</template>

<script setup>
import { ref } from 'vue';

const items = [
  {
    label: '1',
    value: '1',
    children: true,
  },
  {
    label: '2',
    value: '2',
    children: true,
  },
];

const checkable = ref(true);
const checkStrictly = ref(false);

const onLoad = (state) => {
  console.log('on load:', state);
};

const load = (node) =>
  new Promise((resolve) => {
    setTimeout(() => {
      let nodes = [];
      if (node.level < 2) {
        nodes = [
          {
            label: `${node.label}.1`,
            value: `${node.value}.1`,
            children: true,
          },
          {
            label: `${node.label}.2`,
            value: `${node.value}.2`,
            children: true,
          },
        ];
      }
      resolve(nodes);
    }, 1000);
  });
</script>
