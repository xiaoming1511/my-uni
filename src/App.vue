<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
@import "tailwindcss";

/* 额外添加：解决小程序内 base 样式冲突 */
view,
text {
  box-sizing: border-box;
}
</style>
