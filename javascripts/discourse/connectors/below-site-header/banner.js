export default {
  shouldRender(args, component) {
    return !component.site.mobileView;
  },
};
