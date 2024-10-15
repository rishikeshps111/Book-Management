// document.addEventListener('DOMContentLoaded', function () {
//     document.body.style.zoom = "100%";
// })

function OpenModel(options) {
    console.log(options)

    var settings = $.extend(
        {
            // These are the defaults.
            Data: "",
            Method: "GET",
            IsUrl: 1,
            Title: "Common Model",
            FormData: {},
            Functions: {
                Init: (response) => { },
                Success: (response) => { },
                Failure: (response) => { },
            },

        },
        options
    );

    var Data = settings.Data;
    var Method = settings.Method ?? "GET";
    var IsUrl = settings.IsUrl ?? 1;
    var Title = settings.Title ?? "Common Model";
    var FormData = settings.FormData ?? {};

    var Model = $("#AddbookModal");
    var ModelBody = Model.find("#CommonModelBody");


    if (!Data || Data == "") {
        IsUrl ?
            console.error(`AjaxApi url cannot be empty!`) :
            console.error(`Model Data cannot be empty!`);

        return false;
    }

    var Functions = settings.Functions;

    if (
        Functions.Init &&
        typeof Functions.Init !== "undefined" &&
        typeof Functions.Init === "function"
    ) {
        var InitSettings = delete settings.Functions;
        Functions.Init(InitSettings);
    }

    if (IsUrl) {
        AjaxApi({
            Url: Data,
            FormData: FormData,
            DataType: "JSON",
            Method: Method,
            Functions: {
                Success: (response) => {
                    var RespData = response.data.data;
                    ModelLabel.html(Title);


                    ModelBody.html(RespData);


                    if (
                        Functions.Success &&
                        typeof Functions.Success !== "undefined" &&
                        typeof Functions.Success === "function"
                    ) {
                        Functions.Success(response);
                    }
                },
            },
        })
    }
}


function AjaxApi(options) {

    var settings = $.extend(
        {
            // These are the defaults.
            Url: "",
            Method: "GET",
            FormData: {},
            DataType: "",
            Button: {
                Target: "",
                Default: "",
                OnClick: "",
                Success: "",
                Failure: "",
            },
            Functions: {
                Init: (response) => { },
                Success: (response) => { },
                Failure: (response) => { },
            },

        },
        options
    );

    var Url = settings.Url;
    var Method = settings.Method ?? "GET";
    var FormData = settings.FormData ?? {};
    var DataType = settings.DataType ?? "";
    var Button = settings.Button.Target ?? "";
    var DefaultButton = settings.Button.Default ?? "";
    var OnClickButton = settings.Button.OnClick ?? "";
    var SuccessButton = settings.Button.Success ?? DefaultButton ?? "Success!";
    var FailureButton = settings.Button.Failure ?? DefaultButton ?? "Try Again!";

    if (!Url || Url == "") {
        console.error(`AjaxApi url cannot be empty: ${Url}`)
        return false;
    }

    var Functions = settings.Functions;

    var ButtonId = "";

    if (Button != "") {
        Button.html(OnClickButton).attr("disabled", true);
        ButtonId = Button.attr("id");
    }

    if (
        Functions.Init &&
        typeof Functions.Init !== "undefined" &&
        typeof Functions.Init === "function"
    ) {
        var InitSettings = delete settings.Functions;
        Functions.Init(InitSettings);
    }


    axios({
        method: Method,
        url: Url,
        data: FormData,
    })
        .then(function (response) {
            if (Button != "") {
                Button.html(SuccessButton).attr("disabled", false);
            }

            if (
                Functions.Success &&
                typeof Functions.Success !== "undefined" &&
                typeof Functions.Success === "function"
            ) {
                Functions.Success(response);
            }
        })
        .catch(function (response) {

            console.log(response);

            if (Button != "") {
                Button.html(FailureButton).attr("disabled", false);
            }

            if (
                Functions.Failure &&
                typeof Functions.Failure !== "undefined" &&
                typeof Functions.Failure === "function"
            ) {
                Functions.Failure(response);
            }
        });

}



