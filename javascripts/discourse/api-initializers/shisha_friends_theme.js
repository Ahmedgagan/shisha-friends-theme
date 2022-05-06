import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  api.modifyClass("component:category-drop", {
    selectKitOptions: {
      filterable: true,
      none: "category.all",
      caretDownIcon: "angle-right",
      caretUpIcon: "angle-down",
      fullWidthOnMobile: true,
      noSubcategories: false,
      subCategory: false,
      clearable: false,
      hideParentCategory: "hideParentCategory",
      countSubcategories: false,
      autoInsertNoneItem: false,
      displayCategoryDescription: "displayCategoryDescription",
      headerComponent: "category-drop/category-drop-header",
      parentCategory: false,
    },
  });

  api.modifyClass("component:tag-drop", {
    selectKitOptions: {
      allowAny: false,
      caretDownIcon: "angle-right",
      caretUpIcon: "angle-down",
      fullWidthOnMobile: true,
      filterable: true,
      headerComponent: "tag-drop/tag-drop-header",
      autoInsertNoneItem: false,
    },
  });
});
