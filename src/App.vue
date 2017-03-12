<template>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
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