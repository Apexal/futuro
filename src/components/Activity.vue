<template>
  <li class="activity">
    <span @click="remove(activity)" class="summary">{{ activity.summary }}</span>
    <div class="description">
      {{ activity.description }}
    </div>
  </li>
</template>

<script>
export default {
  name: 'activity',
  props: ['activity'],
  methods: {
    remove: function(a) {
      this.$emit('remove', a);
    }
  }
};
</script>

<style scoped>
.activity .summary {
    cursor: pointer;
    font-size: 1.3em;
}

.activity .description {
    /* display: none; */
    font-style: italic;
    color: grey;
    width: 100%;
}
</style>