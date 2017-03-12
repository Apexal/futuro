<template>
  <div id="person">
    <div class="row">
      <span class="right status">{{ people.length }} total</span>
      <h1>People</h1>
      <hr>
    </div>

    <div class="row">
      <div class="person four columns" v-for="p in people">
        <small class="status right" :title="p.name.first + '\'s unique identifier.'">({{ p.name.unique }})</small>
        <h4 class="name"><router-link class="mobile-prev-arrow" :to="'/people/' + p.name.unique">
          <span :title="p.name.first + ' ' + p.name.last" v-if="p.name.nickname">{{ p.name.nickname }}</span>
          <span v-else>{{ p.name.first }} {{ p.name.last }}</span>
        </router-link></h4>
        <p>{{ p.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'people',
  data () {
    return {
      people: []
    }
  },
  computed: {

  },
  methods: {
    fetchData: function() {
      this.$http.get('/api/people')
        .then(response => {
          this.people = response.body.people;
        }, response => {
          alert('Error fetching people! ' + response.body.err);
        });
    }
  },
  mounted: function() {
    
  },
  created: function() {
    // Before the element is rendered get the proper data
    this.fetchData();
  },
  watch: {
    '$route' (to, from) {
      this.fetchData();
    }
  }
}
</script>

<style scoped>
.nickname {
  font-size: 0.7em;
}
</style>