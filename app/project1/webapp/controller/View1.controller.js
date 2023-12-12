sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/date/UI5Date",
    "sap/ui/model/json/JSONModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, UI5Date, MessageToast, MessageBox) {
    "use strict";
    var questionID = 1;
    var deleteID = 0;
    return Controller.extend("project1.controller.View1", {
      onInit: function () {
        this._wizard = this.byId("CreateProductWizard");
        this._oNavContainer = this.byId("wizardNavContainer");
        this._oWizardContentPage = this.byId("wizardContentPage");

        this.model = new JSONModel();
        this.model.setData({
          productNameState: "Error",
          productWeightState: "Error",
        });
        this.getView().setModel(this.model);
        this.model.setProperty("/productType", "Mobile");
        this.model.setProperty("/availabilityType", "In Store");
        this.model.setProperty("/navApiEnabled", true);
        this.model.setProperty("/productVAT", false);
        this.model.setProperty("/measurement", "");
        this._setEmptyValue("/productManufacturer");
        this._setEmptyValue("/productDescription");
        this._setEmptyValue("/size");
        this._setEmptyValue("/productPrice");
        this._setEmptyValue("/manufacturingDate");
        this._setEmptyValue("/discountGroup");
      },
      setProductType: function (evt) {
        var productType = evt.getSource().getTitle();
        this.model.setProperty("/productType", productType);
        this.byId("ProductStepChosenType").setText(
          "Chosen product type: " + productType
        );
        this._wizard.validateStep(this.byId("ProductTypeStep"));
      },

      setProductTypeFromSegmented: function (evt) {
        var productType = evt.getParameters().item.getText();
        this.model.setProperty("/productType", productType);
        this._wizard.validateStep(this.byId("ProductTypeStep"));
      },

      additionalInfoValidation: function () {
        var name = this.byId("ProductName").getValue();
        var weight = parseInt(this.byId("ProductWeight").getValue());

        if (isNaN(weight)) {
          this._wizard.setCurrentStep(this.byId("ProductInfoStep"));
          this.model.setProperty("/productWeightState", "Error");
        } else {
          this.model.setProperty("/productWeightState", "None");
        }

        if (name.length < 6) {
          this._wizard.setCurrentStep(this.byId("ProductInfoStep"));
          this.model.setProperty("/productNameState", "Error");
        } else {
          this.model.setProperty("/productNameState", "None");
        }

        if (name.length < 6 || isNaN(weight)) {
          this._wizard.invalidateStep(this.byId("ProductInfoStep"));
        } else {
          this._wizard.validateStep(this.byId("ProductInfoStep"));
        }
      },

      optionalStepActivation: function () {
        MessageToast.show("This event is fired on activate of Step3.");
      },

      optionalStepCompletion: function () {
        MessageToast.show(
          "This event is fired on complete of Step3. You can use it to gather the information, and lock the input data."
        );
      },

      pricingActivate: function () {
        this.model.setProperty("/navApiEnabled", true);
      },

      pricingComplete: function () {
        this.model.setProperty("/navApiEnabled", false);
      },

      scrollFrom4to2: function () {
        this._wizard.goToStep(this.byId("ProductInfoStep"));
      },

      goFrom4to3: function () {
        if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
          this._wizard.previousStep();
        }
      },

      goFrom4to5: function () {
        if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
          this._wizard.nextStep();
        }
      },

      wizardCompletedHandler: function () {
        this._oNavContainer.to(this.byId("wizardReviewPage"));
      },

      backToWizardContent: function () {
        this._oNavContainer.backToPage(this._oWizardContentPage.getId());
      },

      editStepOne: function () {
        this._handleNavigationToStep(0);
      },

      editStepTwo: function () {
        this._handleNavigationToStep(1);
      },

      editStepThree: function () {
        this._handleNavigationToStep(2);
      },

      editStepFour: function () {
        this._handleNavigationToStep(3);
      },

      _handleNavigationToStep: function (iStepNumber) {
        var fnAfterNavigate = function () {
          this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
          this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
        }.bind(this);

        this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
        this.backToWizardContent();
      },

      _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
        MessageBox[sMessageBoxType](sMessage, {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.YES) {
              this._handleNavigationToStep(0);
              this._wizard.discardProgress(this._wizard.getSteps()[0]);
            }
          }.bind(this),
        });
      },

      _setEmptyValue: function (sPath) {
        this.model.setProperty(sPath, "n/a");
      },

      handleWizardCancel: function () {
        this._handleMessageBoxOpen(
          "Are you sure you want to cancel your report?",
          "warning"
        );
      },

      handleWizardSubmit: function () {
        this._handleMessageBoxOpen(
          "Are you sure you want to submit your report?",
          "confirm"
        );
      },

      productWeighStateFormatter: function (val) {
        return isNaN(val) ? "Error" : "None";
      },

      discardProgress: function () {
        this._wizard.discardProgress(this.byId("ProductTypeStep"));

        var clearContent = function (content) {
          for (var i = 0; i < content.length; i++) {
            if (content[i].setValue) {
              content[i].setValue("");
            }

            if (content[i].getContent) {
              clearContent(content[i].getContent());
            }
          }
        };

        this.model.setProperty("/productWeightState", "Error");
        this.model.setProperty("/productNameState", "Error");
        clearContent(this._wizard.getSteps());
      },

      //Add questions
      addQuestions: function () {
        var form = this.getView().byId("SimpleForm1");
        var prevquestionID = questionID;
        questionID = questionID + 1;

        form.addContent(
          new sap.m.Label({
            text: "Question " + questionID,
          })
        );

        form.addContent(
          new sap.m.Input({
            // id : this.getView().createId("idExtensionInput1"),
            text: "text",
            enabled: true,
            placeholder: "Enter question no. " + questionID,
            width: "500px",
          })
        );

        form.addContent(
          new sap.m.Button({
            id: this.getView().createId("addAnswerBtn" + questionID),
            icon: "sap-icon://add",
            type: "Accept",
            width: "5%",
          })
        );
        this.getView()
          .byId("container-project1---View1--addAnswerBtn" + questionID)
          .attachPress(this.addOptions, this);

        this.getView()
          .byId("container-project1---View1--addAnswerBtn" + prevquestionID)
          .destroy();
      },

      //Add options for questions
      addOptions: function () {
        var form = this.getView().byId("SimpleForm1");
        deleteID = deleteID + 1;

        form.addContent(
          new sap.m.Label({
            text: "Option",
          })
        );

        form.addContent(
          new sap.m.Input({
            id: this.getView().createId("answerInpField" + deleteID),
            text: "text",
            enabled: true,
            width: "40%",
            placeholder: "Enter option..",
          })
        );

        form.addContent(
          new sap.m.Button({
            id: this.getView().createId("deleteOptionBtn" + deleteID),
            icon: "sap-icon://delete",
            type: "Reject",
            width: "5%",
          })
        );

        this.getView()
          .byId("container-project1---View1--deleteOptionBtn" + deleteID)
          .attachPress(this.delOptions, this);
      },

      //Delete Options
      delOptions: function (oEvent) {
        var inputFieldID = oEvent
          .getSource()
          .getParent()
          .getFields()[0]
          .getId();
        this.getView().byId(inputFieldID).destroy();

        var deleteBtn = oEvent.getSource().getParent().getFields()[0].getId();
        this.getView().byId(deleteBtn).destroy();
      },
    });
  }
);
