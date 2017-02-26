<template>
  <div id="home">
    <div class="row">
      <h1>Futuro</h1><small class="right">For what is to be.</small>
      <hr>
    </div>

    <div class="row">
      <div class="calendar">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted: function() {
    $('.calendar').fullCalendar({
      eventSources: ['/api/activities/events', '/api/reflections/events'],
      dayClick: (date) => {
        var dateString = date.format('YYYY-MM-DD');
        this.$router.push({ name: 'day', params: { date: dateString }});
      }
    });
  }
}
</script>

<style>
  
</style>
