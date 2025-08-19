<template>
    <div>
        <Header></Header>
        <paperDetail></paperDetail>
    </div>

</template>

<script>
import Header from '../components/header.vue'
import paperDetail from '../components/paperDetail.vue'
export default {
    name: 'App',
    components: {
        Header,
        paperDetail
    }
}
</script>

<style>
/* body {
    background-color: #F2F3F5;
       background-color: red !important;
} */
</style>
