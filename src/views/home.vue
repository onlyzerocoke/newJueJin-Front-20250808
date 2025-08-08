<template>
<div>
  <Header></Header>
  <Category></Category>
   <mainMobile></mainMobile>
   
</div>

</template>

<script>
import Header from '../components/header.vue'
import Category from '../components/categorization.vue'
import mainMobile from '../components/mainMobile.vue'
export default {
  name: 'App',
  components: {
    Header,
    Category,
    mainMobile
  }
}
</script>

<style>
body{
  background-color: #F2F3F5;
}


</style>
