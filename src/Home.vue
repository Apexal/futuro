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
    const _this = this;
    $('.calendar').fullCalendar({
      eventSources: ['/api/activities/events', '/api/reflections/events'],
      dayClick: (date) => {
        var dateString = date.format('YYYY-MM-DD');
        this.$router.push({ name: 'day', params: { date: dateString }});
      },
      viewRender: function (view, element) {
        const colors = ['#ff9999', '#ffe6e6', '#ffffb3', '#d6f5d6', '#47d147'];

        _this.$http.get(`/api/ratings?start=${view.start.format('YYYY-MM-DD')}&end=${view.end.format('YYYY-MM-DD')}`).then(response => {
          response.body.ratings.forEach((r) => {
            $(`td.fc-day[data-date="${moment(r.date).format('YYYY-MM-DD')}"]`).css('background-color', colors[r.value - 1]);
          });
        }, response => {
          alert('Error! ' + response.body.error);
        });
        
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
