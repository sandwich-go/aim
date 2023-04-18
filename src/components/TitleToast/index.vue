<template>
  <div class="pmtToast">
    <div class="pmtToast__title">{{ title }}</div>
    <div class="pmtToast__body">{{ body }}</div>
    <!--    预留客户端错误提交sentry或自定义收集-->
    <!--    <el-button type="danger" style="position: absolute;top: 0;right:0" size="mini" icon="el-icon-message"></el-button>-->
  </div>
</template>

<script>
export default {
  name: 'TitleToast',
  props: {
    title: {
      required: true,
      type: String,
    },
    body: {
      required: true,
      type: String,
    },
    data: {
      type: String,
    },
  },
}
</script>
<style lang="scss">
.pmtToast {
  .pmtToast__title{
    font-weight: 500;
    padding-top: 9px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
  .pmtToast__body {
    font-size: 14px;
    color: whitesmoke;
    padding-top: 9px;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
}
</style>
