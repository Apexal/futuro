<template>
  <div id="person">
    <div class="row">
      <h1>{{ person.name.first }} {{ person.name.last }}</h1>
      <hr>
    </div>

    <div class="row">
    </div>
  </div>
</template>

<script>
export default {
  name: 'person',
  data () {
    return {
      person: {
        name: {
          first: 'Loading',
          last: 'Person...'
        }
      }
    }
  },
  computed: {

  },
  methods: {
    fetchData: function() {
      this.$http.get('/api/people/' + this.$route.params.name).then(response => {
        if(response.body.person) this.person = response.body.person;
      }, response => {
        alert('Error fetching person! ' + response.body.err);
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

</style>
