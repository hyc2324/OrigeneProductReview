<template>
  <div id="Test">
    <h1>I am a test page</h1>
    <h2>author: {{ author }}</h2>
    <p>article: {{ articles }}</p>
    <p>111: {{ info.data[0] }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      author: "hyc",
      articles: [],
      info: null
    }
  },
  mounted () {
    axios
      .get('https://18.219.121.53:8080/product/review/list/all')
      .then(response => (this.info = response))
      .catch(function (error) { // 请求失败处理
        console.log(error);
      });
  }
}
</script>

<style>
</style>
