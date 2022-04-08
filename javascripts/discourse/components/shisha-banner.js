import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
  @discourseComputed()
  shouldShow() {
    return (
      window.location.pathname === "/" ||
      window.location.pathname === "/categories"
    );
  },
});
