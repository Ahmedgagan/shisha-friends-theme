import { apiInitializer } from "discourse/lib/api";
import DecoratorHelper from "discourse/widgets/decorator-helper";
import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";
import PostCooked from "discourse/widgets/post-cooked";

function showReplyTab(attrs, siteSettings) {
  return (
    attrs.replyToUsername &&
    (!attrs.replyDirectlyAbove || !siteSettings.suppress_reply_directly_above)
  );
}

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

  const site = api.container.lookup("site:main");

  if (!site.mobileView) {
    api.reopenWidget("post-article", {
      html(attrs, state) {
        const rows = [
          h("span.tabLoc", {
            attributes: { "aria-hidden": true, tabindex: -1 },
          }),
        ];
        if (state.repliesAbove.length) {
          const replies = state.repliesAbove.map((p) => {
            return this.attach("embedded-post", p, {
              model: p.asPost,
              state: { above: true },
            });
          });
    
          rows.push(
            h(
              "div.row",
              h("section.embedded-posts.top.topic-body", [
                this.attach("button", {
                  title: "post.collapse",
                  icon: "chevron-down",
                  action: "toggleReplyAbove",
                  actionParam: "true",
                  className: "btn collapse-down",
                }),
                replies,
              ])
            )
          );
        }
    
        if (!attrs.deleted_at && attrs.notice) {
          rows.push(h("div.row", [this.attach("post-notice", attrs)]));
        }
    
        rows.push(
          h("div.row", [
            this.attach("post-body", attrs),
          ])
        );
        return rows;
      },
    });
  
    api.reopenWidget("post-meta-data", {
      html(attrs) {
        let postInfo = [];
    
        if (attrs.isWhisper) {
          postInfo.push(
            h(
              "div.post-info.whisper",
              {
                attributes: { title: I18n.t("post.whisper") },
              },
              iconNode("far-eye-slash")
            )
          );
        }
    
        if (attrs.via_email) {
          postInfo.push(this.attach("post-email-indicator", attrs));
        }
    
        if (attrs.locked) {
          postInfo.push(this.attach("post-locked-indicator", attrs));
        }
    
        if (attrs.version > 1 || attrs.wiki) {
          postInfo.push(this.attach("post-edits-indicator", attrs));
        }
    
        if (attrs.multiSelect) {
          postInfo.push(this.attach("select-post", attrs));
        }
    
        if (showReplyTab(attrs, this.siteSettings)) {
          postInfo.push(this.attach("reply-to-tab", attrs));
        }
    
        postInfo.push(this.attach("post-date", attrs));
    
        postInfo.push(
          h(
            "div.read-state",
            {
              className: attrs.read ? "read" : null,
              attributes: {
                title: I18n.t("post.unread"),
              },
            },
            iconNode("circle")
          )
        );
    
        let result = [];
        if (this.settings.displayPosterName) {
          result.push(this.attach("post-avatar", attrs));
          result.push(this.attach("poster-name", attrs));
        }
        result.push(h("div.post-infos", postInfo));
    
        return result;
      },
    });

    api.reopenWidget("embedded-post", {
      html(attrs, state) {
        attrs.embeddedPost = true;
        return [
          h("div.row", [
            h("div.topic-body", [
              h("div.topic-meta-data.embedded-reply", [
                this.attach("post-avatar", attrs),
                this.attach("poster-name", attrs),
                this.attach("post-link-arrow", {
                  above: state.above,
                  shareUrl: attrs.customShare,
                }),
              ]),
              new PostCooked(attrs, new DecoratorHelper(this), this.currentUser),
            ]),
          ]),
        ];
      },
    });
  }
});
