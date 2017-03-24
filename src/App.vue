<template lang="pug">
  #app
    header-nav
    .container
      .row
        b-alert(state="danger", show)
          b Warning!
          span  Futuro is still in early stages of development and is unstable.
      router-view
</template>

<script>
import HeaderNav from './components/HeaderNav.vue'

export default {
  name: 'app',
  components: { HeaderNav }
}
</script>

<style>
body {
  padding-top: 70px;
}

.right { float: right; }
.left { float: left; }
.inline { display: inline-block; }


.reflection:not(.none) {
  padding: 20px;
  margin-bottom: 0;
  background-color: #FAFAFA;
}

.status {
  color: grey;
}
</style>
