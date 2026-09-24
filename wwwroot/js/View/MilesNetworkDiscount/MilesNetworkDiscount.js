ns('Mitosiz.Site.MilesNetworkDiscount.Index')
Mitosiz.Site.MilesNetworkDiscount.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.clsNumberPagination();
        base.Function.clsUpdateDataClick();
        base.Function.clsDeleteDataClick();
        base.Function.GetMilesNetworkDiscountForAdmin();
        base.Control.btnSearch().click(base.Event.btnSearchClick);
        base.Control.btnClear().click(base.Event.btnClearClick);
        base.Control.btnCreateDiscount().click(base.Event.btnCreateDiscountClick);
        base.Control.btnUpdateModal().click(base.Event.btnUpdateModalClick);
        base.Control.btnCreateModal().click(base.Event.btnCreateModalClick);
        base.Ajax.AjaxGetComissionPeriodForComission.submit();
        base.Control.txtNames().autocomplete({
            source: function (request, response) {
                $.ajax({
                    type: 'POST',
                    url: Mitosiz.Site.MilesNetworkDiscount.Actions.GetDropDownPatrons,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        NamePatron: request.term
                    }),
                    async: false,
                    success: function (data) {
                        var results = $.map(data.data, function (tag) {
                            return {
                                label: tag.namePatron,
                                value: tag.userId
                            };
                        });
                        response(results);
                    },
                    error: function (jqXHR, t, exception) {
                        console.log("Error");
                    }
                });
            },
            minLength: 0,
            maxResults: 6,
            select: function (event, ui) {
                base.Control.hiddenUserId().val(ui.item.value);
                base.Control.txtNames().val(ui.item.label);
                return false;
            }
        });
    };
    base.Parameters = {
        currentPage: 1,
        totalPages: 1,
        sizePagination: 10,
        milesNetworkDiscountId: 0
    };
    base.Control = {
        divPagination: function () { return $('#pagination'); },
        tbodyTable: function () { return $('#tbodyTable'); },
        txtNamesFilter: function () { return $('#txtNamesFilter'); },
        btnSearch: function () { return $('#btnSearch'); },
        btnClear: function () { return $('#btnClear'); },
        txtNames: function () { return $('#txtNames'); },
        hiddenUserId: function () { return $('#hiddenUserId'); },
        slcPeriod: function () { return $('#slcPeriod'); },
        txtDiscountMiles: function () { return $('#txtDiscountMiles'); },
        modalUpdate: function () { return $('#modalUpdate'); },
        btnUpdateModal: function () { return $('#btnUpdateModal'); },
        btnCreateModal: function () { return $('#btnCreateModal'); },
        btnCreateDiscount: function () { return $('#btnCreateDiscount'); },

    };
    base.Event = {
        AjaxGetMilesNetworkDiscountForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.FillData(data.data.milesNetworkDiscountForAdmin);
                }
            }
        },
        AjaxGetComissionPeriodForComissionSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcPeriod().empty();
                    base.Control.slcPeriod().append($('<option>', {
                        value: 0,
                        text: "Seleccione"
                    }));
                    $.each(data.data, function (key, value) {
                        base.Control.slcPeriod().append($('<option>', {
                            value: value.commissionPeriodId,
                            text: value.periodName
                        }));
                    });
                    base.Control.slcPeriod().selectpicker('refresh');
                }
            }
        },
        AjaxDetailMilesNetworkDiscountForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.txtNames().val(data.data.names);
                    base.Control.hiddenUserId().val(data.data.userId);
                    base.Control.slcPeriod().val(data.data.commissionPeriodId);
                    base.Control.slcPeriod().selectpicker('refresh');
                    base.Control.txtDiscountMiles().val(data.data.miles);
                    base.Control.modalUpdate().modal('show');
                }
            }
        },
        AjaxInsertMilesNetworkDiscountForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "Descuento Ingresado !!", "success")
                    base.Control.modalUpdate().modal('hide');
                    base.Function.GetMilesNetworkDiscountForAdmin();
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                }
            }
        },
        AjaxUpdateMilesNetworkDiscountForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "Descuento Actualizado !!", "success")
                    base.Control.modalUpdate().modal('hide');
                    base.Function.GetMilesNetworkDiscountForAdmin();
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                }
            }
        },
        AjaxDeleteMilesNetworkDiscountForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "Descuento Eliminado !!", "success")
                    base.Control.modalUpdate().modal('hide');
                    base.Function.GetMilesNetworkDiscountForAdmin();
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                }
            }
        },
        btnSearchClick: function () {
            base.Parameters.currentPage = 1;
            base.Function.GetMilesNetworkDiscountForAdmin();
        },
        btnClearClick: function () {
            base.Function.ClearFilters();
            base.Parameters.currentPage = 1;
            base.Function.GetMilesNetworkDiscountForAdmin();
        },
        btnUpdateModalClick: function () {
            base.Ajax.AjaxUpdateMilesNetworkDiscountForAdmin.data = {
                milesNetworkDiscountId: base.Parameters.milesNetworkDiscountId,
                userId: base.Control.hiddenUserId().val(),
                commissionPeriodId: base.Control.slcPeriod().val(),
                miles: base.Control.txtDiscountMiles().val(),
            };
            base.Ajax.AjaxUpdateMilesNetworkDiscountForAdmin.submit();
        },
        btnCreateModalClick: function () {
            base.Ajax.AjaxInsertMilesNetworkDiscountForAdmin.data = {
                userId: base.Control.hiddenUserId().val(),
                commissionPeriodId: base.Control.slcPeriod().val(),
                miles: base.Control.txtDiscountMiles().val(),
            };
            base.Ajax.AjaxInsertMilesNetworkDiscountForAdmin.submit();
        },
        btnCreateDiscountClick: function () {
            base.Control.txtNames().val("");
            base.Control.txtDiscountMiles().val("0");
            base.Control.hiddenUserId().val(0);
            base.Control.slcPeriod().val("0");
            base.Control.slcPeriod().selectpicker('refresh');

            base.Control.btnUpdateModal().hide();
            base.Control.btnCreateModal().show();
            base.Control.modalUpdate().modal('show');
        },
    };
    base.Ajax = {
        AjaxGetMilesNetworkDiscountForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.MilesNetworkDiscount.Actions.GetMilesNetworkDiscountForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetMilesNetworkDiscountForAdminSuccess
        }),
        AjaxDetailMilesNetworkDiscountForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.MilesNetworkDiscount.Actions.DetailMilesNetworkDiscountForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxDetailMilesNetworkDiscountForAdminSuccess
        }),
        AjaxInsertMilesNetworkDiscountForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.MilesNetworkDiscount.Actions.InsertMilesNetworkDiscountForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxInsertMilesNetworkDiscountForAdminSuccess
        }),
        AjaxUpdateMilesNetworkDiscountForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.MilesNetworkDiscount.Actions.UpdateMilesNetworkDiscountForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxUpdateMilesNetworkDiscountForAdminSuccess
        }),
        AjaxDeleteMilesNetworkDiscountForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.MilesNetworkDiscount.Actions.DeleteMilesNetworkDiscountForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxDeleteMilesNetworkDiscountForAdminSuccess
        }),
        AjaxGetDropDownPatrons: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.MilesNetworkDiscount.Actions.GetDropDownPatrons,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDropDownPatronsSuccess
        }),
        AjaxGetComissionPeriodForComission: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.MilesNetworkDiscount.Actions.GetComissionPeriodForComission,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetComissionPeriodForComissionSuccess
        }),
    };
    base.Function = {
        UpdatePagination: function () {
            base.Control.divPagination().empty();
            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPages <= 5) {
                for (var i = 1; i <= base.Parameters.totalPages; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link" href="#">' + i + '</a></li>');
                }
            } else {
                var startPage = Math.max(1, base.Parameters.currentPage - 2);
                var endPage = Math.min(base.Parameters.totalPages, base.Parameters.currentPage + 2);

                if (base.Parameters.currentPage >= base.Parameters.totalPages - 2) {
                    startPage = base.Parameters.totalPages - 4;
                }

                if (startPage > 1) {
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link" href="#">1</a></li>');
                    if (startPage > 2) {
                        if (base.Parameters.currentPage != base.Parameters.totalPages) {
                            endPage--;
                        }
                        startPage++;
                        var valueHidden = startPage - 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link" href="#">..</a></li>');
                    }
                }

                for (var i = startPage; i <= endPage; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link" href="#">' + i + '</a></li>');
                }

                if (endPage < base.Parameters.totalPages) {
                    if (endPage < base.Parameters.totalPages - 1) {
                        var valueHidden = endPage + 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link" href="#">..</a></li>');
                    }
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link" href="#">' + base.Parameters.totalPages + '</a></li>');
                }
            }

            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="next">»</a></li>');
        },
        clsNumberPagination: function () {
            var parentElement = $(document);
            parentElement.on('click', '.page-link', function () {
                var page = $(this).text();
                if (page === '«') {
                    if (base.Parameters.currentPage > 1) {
                        base.Parameters.currentPage--;
                    }
                } else if (page === '»') {
                    if (base.Parameters.currentPage < base.Parameters.totalPages) {
                        base.Parameters.currentPage++;
                    }
                } else if (page === '..') {
                    base.Parameters.currentPage = parseInt($(this).attr('value-hidden'));
                } else {
                    base.Parameters.currentPage = parseInt(page);
                }
                base.Function.GetMilesNetworkDiscountForAdmin();
            });
        },
        GetMilesNetworkDiscountForAdmin: function () {
            base.Ajax.AjaxGetMilesNetworkDiscountForAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                userName: base.Control.txtNamesFilter().val()
            };
            base.Ajax.AjaxGetMilesNetworkDiscountForAdmin.submit();
        },
        FillData: function (listData) {
            base.Control.tbodyTable().empty();
            listData.forEach(function (data) {
                base.Control.tbodyTable().append('<tr style="text-align: center;">' +
                    '<td>' +
                    '<div class="dropdown">' +
                    '<button type="button" class="btn btn-success light sharp" data-bs-toggle="dropdown">' +
                    '<svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">' +
                    '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
                    '<rect x="0" y="0" width="24" height="24" /><circle fill="#000000" cx="5" cy="12" r="2" /><circle fill="#000000" cx="12" cy="12" r="2" /><circle fill="#000000" cx="19" cy="12" r="2" />' +
                    '</g>' +
                    '</svg>' +
                    '</button>' +
                    '<div class="dropdown-menu">' +
                    '<a class="dropdown-item updateData" value="' + data.milesNetworkDiscountId + '" href="#">Actualizar</a>' +
                    '<a class="dropdown-item deleteData" value="' + data.milesNetworkDiscountId + '" href="#">Eliminar</a>' +
                    '</div>' +
                    '</div></td>' +
                    '<td><strong>' + data.milesNetworkDiscountId + '</strong></td>' +
                    '<td>' + data.names + '</td>' +
                    '<td>' + data.periodName + '</td>' +
                    '<td>' + data.miles + '</td>' +
                    '<td>' + data.currentMiles + '</td>' +
                    '</tr>');
            });
            base.Function.UpdatePagination();
        },
        ClearFilters: function () {
            base.Control.txtNamesFilter().val("");
        },
        clsUpdateDataClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.updateData', function () {
                base.Control.btnUpdateModal().show();
                base.Control.btnCreateModal().hide();
                var milesNetworkDiscountId = $(this).attr('value');
                base.Parameters.milesNetworkDiscountId = milesNetworkDiscountId;
                base.Ajax.AjaxDetailMilesNetworkDiscountForAdmin.data = {
                    milesNetworkDiscountId: milesNetworkDiscountId
                };
                base.Ajax.AjaxDetailMilesNetworkDiscountForAdmin.submit();
            });
        },
        clsDeleteDataClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.deleteData', function () {
                var milesNetworkDiscountId = $(this).attr('value');
                base.Ajax.AjaxDeleteMilesNetworkDiscountForAdmin.data = {
                    milesNetworkDiscountId: milesNetworkDiscountId
                };
                base.Ajax.AjaxDeleteMilesNetworkDiscountForAdmin.submit();
            });
        },
    };
}