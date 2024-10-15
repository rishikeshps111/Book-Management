var CommonTableConfig = null;
var container = document.getElementById("CommonTable");
container.innerHTML = '';
if (document.getElementById("CommonTable")) {
    CommonTableConfig = new gridjs.Grid({
        pagination: {
            limit: 20,
        },
        sort: true,
        search: true,
        columns: [
            {
                name: "ID",
                hidden: true,
            },
            {
                id: "No",
                name: "No",
                width: "50px",
                formatter: (cell, row) => {
                    return gridjs.html(
                        '<b>' + cell + "</b>"
                    );
                },
            },
            {
                id: "Title",
                name: "Title",
                width: "100px",
            },
            {
                id: "Author",
                name: "Author",
                width: "100px",
            },
            {
                id: "Publication Year",
                name: "Publication Year",
                width: "100px",
            },
            {
                id: "Genre",
                name: "Genre",
                width: "100px",
            },
            {
                id: "Action",
                name: "Action",
                width: "50px",
                sort: false,
                formatter: (cell, row) => {
                    // console.log(row);
                    // alert(row.cells[0].data);
                    return gridjs.html(
                        `<div class="c-f-o-dropdown Rowctions" data-RowId='${row.cells[0].data}'>
                            <button class="c-f-o-dropdown-btn btn btn-primary"><i class="ri-more-fill align-middle"></i></button>
                            <div class="c-f-o-dropdown-content">
                              <a class="text-secondary EditRecord" href="#" data-bs-toggle="modal"
                                data-bs-target="#CommonModel"><i class="ri-pencil-line me-2"></i>Edit</a>
                              <a class="text-danger DeleteRecord" href="#"><i class="ri-delete-bin-line me-2"></i>Delete</a>
                            </div>
                         </div>`
                    );
                },
            },
        ],
        server: {
            url: '/list',
            then: (response) => {
                var data = response.data;
                // console.log(response.data)
                data = data.map((list, index) => [
                    list.id,
                    index + 1,
                    list.title,
                    list.author,
                    list.publication_year,
                    list.genre,
                ]);

                return data;
            },
        },
    }).render(document.getElementById("CommonTable"));
}

$("#AddDataModelToggle").click(function () {
    if (document.getElementById('AddBookForm')) {
        document.getElementById('AddBookForm').reset();
        document.getElementById('AddBookForm').addEventListener('submit', (Event) => {
            Event.preventDefault();
            const Form = Event.target;
            const Data = new FormData(Form);
            const FormAction = Form.getAttribute("action");
            const Method = Form.getAttribute("method") ?? "GET";
            console.log(Data)
            axios({
                method: Method,
                url: FormAction,
                data: Data,
            })
                .then(response => {
                    CommonTableConfig.forceRender();
                    $("#AddbookModal").modal("hide");
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Book Added successfully"
                    });
                })
                .catch(error => {
                });

        });
    }
});

$("body").on("click", ".EditRecord", function () {
    var RecordId = $(this).closest(".Rowctions").attr("data-RowId");

    axios.get(`/info/${RecordId}`)
        .then(function (response) {
            var book = response.data.data;
            // console.log(book)
            $('#book_id').val(book.id);
            $('#title').val(book.title);
            $('#author').val(book.author);
            $('#publication_year').val(book.publication_year);
            $('#genre').val(book.genre);

            $('#AddbookModal').modal('show');
        })
        .catch(function (error) {
            console.error('There was an error fetching the book details:', error);
        });

    if (document.getElementById('AddBookForm')) {
        document.getElementById('AddBookForm').addEventListener('submit', (Event) => {
            Event.preventDefault();
            const Form = Event.target;
            const Data = new FormData(Form);
            const FormAction = `edit/${RecordId}`;
            const Method = Form.getAttribute("method") ?? "GET";
            console.log(Data)
            axios({
                method: Method,
                url: FormAction,
                data: Data,
            })
                .then(response => {
                    CommonTableConfig.forceRender();
                    $("#AddbookModal").modal("hide");
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Book Edited successfully"
                    });
                })
                .catch(error => {
                });

        });
    }

});


$("body").on("click", ".DeleteRecord", function () {
    var RecordId = $(this).closest(".Rowctions").attr("data-RowId")
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonClass: 'btn btn-primary w-xs me-2 mt-2',
        cancelButtonClass: 'btn btn-danger w-xs mt-2',
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
        showCloseButton: true
    }).then(function (result) {

        if (result.value) {

            axios.post(`/delete/${RecordId}`)
                .then(response => {
                    CommonTableConfig.forceRender();
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Book has been deleted.',
                        icon: 'success',
                        confirmButtonClass: 'btn btn-primary w-xs mt-2',
                        buttonsStyling: false
                    });
                })
                .catch(error => {
                    console.error(error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was an issue deleting the user.',
                        icon: 'error',
                        confirmButtonClass: 'btn btn-primary w-xs mt-2',
                        buttonsStyling: false
                    });
                });

        }
    });
});

document.getElementById('filter_year').addEventListener('change', function () {

    CommonTableConfig.updateConfig({
        server: {
            url: `/list/${this.value}`,
            then: (response) => {
                var data = response.data;
            
                data = data.map((list, index) => [
                    list.id,
                    index + 1,
                    list.title,
                    list.author,
                    list.publication_year,
                    list.genre,
                ]);

                return data;
            },
        },
    }).forceRender();
});
