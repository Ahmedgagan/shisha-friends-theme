import { inject as service } from "@ember/service";
import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
  router: service(),

  @discourseComputed("router.currentRouteName")
  shouldShow(currentRouteName) {
    return currentRouteName.indexOf("discovery") > -1
  }
});
