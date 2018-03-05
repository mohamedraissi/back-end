$(document).ready(function(){
    $("#todo, #inprogress, #completed").sortable({
        connectWith: ".connectList",
        update: function( event, ui ) {
            var todo = $( "#todo" ).sortable( "toArray" );
            var inprogress = $( "#inprogress" ).sortable( "toArray" );
            var completed = $( "#completed" ).sortable( "toArray" );
            $('.output').html("ToDo: " + window.JSON.stringify(todo) + "<br/>" + "In Progress: " + window.JSON.stringify(inprogress) + "<br/>" + "Completed: " + window.JSON.stringify(completed));
        }
    }).disableSelection();
    $('.summernote').summernote({height:200});
    $('.dataTables-example').DataTable({
        "order": [[ 0, 'desc' ]] ,

        pageLength: 7,
        responsive: true,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy'},
            {extend: 'csv'},
            {extend: 'excel', title: 'ExampleFile'},
            {extend: 'pdf', title: 'ExampleFile'},

            {extend: 'print',
             customize: function (win){
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
            }
            }
        ],
       
        "language": {
            "url": "/lan/French.json"
        }

    });
    $('.delete-ville').click((e) => {
        $target=$(e.target);
        const id=$target.attr('data-id');
        console.log(id)
        $(".modal-footer form").attr("action", "/admin/delete/ville/"+id);
    });
    $('.delete-marker').click((e) => {
        $target=$(e.target);
        const id=$target.attr('data-id');
        console.log(id)
        $(".modal-footer form").attr("action", "/admin/delete/marker/"+id);
    });

    $('.delete-cat').click((e) => {
        $target=$(e.target);
        const id=$target.attr('data-id');
        console.log(id)
        $(".modal-footer form").attr("action", "/admin/delete/categorie/"+id);
    });
    $('.delete-adminS').click((e) => {
        $target=$(e.target);
        const id=$target.attr('data-id');
        console.log(id)
        $(".modal-footer form").attr("action", "/admin/delete/adminS/"+id);
    });
});
