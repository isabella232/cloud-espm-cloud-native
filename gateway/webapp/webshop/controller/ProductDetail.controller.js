sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "com/sap/espm/shop/model/Formatter",
    "sap/ui/core/UIComponent",

    "sap/ui/core/routing/History",
  ],
  function (Controller, formatter, UIComponent, History) {
    "use strict";
    var bindingObject, bindingPath;
    return Controller.extend("com.sap.espm.shop.controller.ProductDetail", {
      formatter: formatter,
      sortReviewDesc: true,
      onInit: function () {
        var that = this;
        var oComponent = this.getOwnerComponent();
        var oModel = oComponent.getModel("Cart");
        this.getView().addEventDelegate({
          onAfterShow: function () {
            that
              .getView()
              .byId("btnProductHeader")
              .setText(formatter.onAddCountToCart(oModel));
          },
        });

        var oRouter = UIComponent.getRouterFor(this);
        oRouter
          .getRoute("ProductDetail")
          .attachPatternMatched(this._onObjectMatched, this);

        this._oReviewDialog = null;
      },
      _onObjectMatched: function (oEvent) {
        bindingObject = oEvent.getParameter("arguments").Productdetails;
        bindingPath = "/" + bindingObject;
        bindingObject = "customer>/products/data" + bindingPath;
        this.getView().bindElement(bindingObject);
        // this.byId("reviewTable").bindItems({
        //   path: bindingObject + "/CustomerReview",
        //   template: this.byId("reviewListItem"),
        // });
        // var oView = this.getView();
        // var oTable = oView.byId("reviewTable");

        // var oBinding = oTable.getBinding("items");

        // var sorters = new sap.ui.model.Sorter("CreationDate", true);
        // oBinding.sort(sorters);
      },

      onAfterRendering: function () {},
      onBeforeRendering: function () {},
      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = UIComponent.getRouterFor(this);
          oRouter.navTo("Home", true);
        }
      },

      onAddToCartPressed: function () {
        var oModel = this.getView().getModel("Cart");
        var model = this.getView().getModel("customer");
        var productContext = model.getProperty("/products/data" + bindingPath);
        formatter.onAddToCart(oModel, productContext);
        this.getView()
          .byId("btnProductHeader")
          .setText(formatter.onAddCountToCart(oModel));
      },
      onShoppingCartPressed: function () {
        var oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo("Shoppingcart");
      },
      _createDialog: function (sDialog) {
        var oDialog = sap.ui.xmlfragment(sDialog, this);
        jQuery.sap.syncStyleClass("sapUiSizeCompact", this._oView, oDialog);
        this.getView().addDependent(oDialog);
        return oDialog;
      },

      clearReviewDialogForm: function () {
        sap.ui.getCore().byId("ratingIndicator", "reviewDialog").setValue(0);
        sap.ui.getCore().byId("textArea", "reviewDialog").setValue("");
        sap.ui.getCore().byId("firstNameId", "reviewDialog").setValue("");
        sap.ui.getCore().byId("lastNameId", "reviewDialog").setValue("");
      },
      onTextAreaChanged: function () {
        sap.ui.getCore().byId("btnOK", "reviewDialog").setEnabled(false);
        var iRatingCount = sap.ui
          .getCore()
          .byId("ratingIndicator", "reviewDialog")
          .getValue();
        var sReviewComment = sap.ui
          .getCore()
          .byId("textArea", "reviewDialog")
          .getValue();
        if (iRatingCount > 0 && sReviewComment) {
          sap.ui.getCore().byId("btnOK", "reviewDialog").setEnabled(true);
        }
      },

      validateReviewForm: function () {
        var iRatingCount = sap.ui
          .getCore()
          .byId("ratingIndicator", "reviewDialog")
          .getValue();
        var sReviewComment = sap.ui
          .getCore()
          .byId("textArea", "reviewDialog")
          .getValue();
        var firstName = sap.ui
          .getCore()
          .byId("firstNameId", "reviewDialog")
          .getValue();
        var lastName = sap.ui
          .getCore()
          .byId("lastNameId", "reviewDialog")
          .getValue();

        if (
          iRatingCount > 0 &&
          sReviewComment !== "" &&
          firstName !== "" &&
          lastName !== ""
        ) {
          sap.ui.getCore().byId("btnOK", "reviewDialog").setEnabled(true);
        } else {
          sap.ui.getCore().byId("btnOK", "reviewDialog").setEnabled(false);
        }
      },
      onTableSettingsPressed: function () {
        var oBinding = this.byId("reviewTable").getBinding("items");
        var aSorters = [];
        var aDescending = this.sortReviewDesc;
        this.sortReviewDesc = !this.sortReviewDesc;

        aSorters.push(new sap.ui.model.Sorter("Rating", aDescending));
        oBinding.sort(aSorters);
      },
    });
  }
);
