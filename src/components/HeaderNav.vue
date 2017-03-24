<template lang="pug">
header
  b-navbar(toggleable, type="inverse", variant="primary", fixed="top")
    b-nav-toggle(target="nav-collapse")
    b-link.navbar-brand(to="#")
      span Futuro

    b-collapse#nav-collapse(is-nav)
      b-nav(is-nav-bar)
        b-nav-item(to="/") Home
        b-nav-item(to="#/days/2017-03-03") Today
        b-nav-item Reflections
        b-nav-item People
</template>

<script>
export default {
  name: 'header-nav'
}
</script>

<style scoped>

</style>
