<template>
  <div id="home">
    <div class="row">
      <h1 id="title">Futuro</h1><p id="slogan">For what is to be.</p>
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

<style scoped>
#title { 
  font-size: 6em;
  text-align: center;
  text-shadow: 0 0 4px;
  padding-top: 30px;

  margin-bottom: 0;
  padding-bottom: 0;
}

#slogan {
  text-align: center;
  color: grey;
}
</style>
