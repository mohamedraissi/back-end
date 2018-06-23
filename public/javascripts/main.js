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
    $("#sc").change(function() {
        console.log($("#sc").val());
        if($("#sc").val()=='5a9a86bbac8e150da48477b0'){
    $(".select").after(
        " <div class='hr-line-dashed hebergement'></div><div class='form-group hebergement'> <label class='col-sm-2 control-label'>type d'hebergement</label><div class='col-sm-10'> hotel:<input type='radio' name='sc' id='adioButton' style='margin:10px;' value='1'>hotel:<input type='radio' name='sc' id='adioButton' style='margin:10px;' value='2'>maison d'hôte:<input type='radio' name='sc' id='adioButton' style='margin:10px;' value='3'></div></div><div class='hr-line-dashed hebergement'></div><div class='form-group  hebergement'><label class='col-sm-2 control-label'>Nombres des etoiles</label><div class='col-sm-10'><select name='nbr_e'  class='form-control'><option name='nbr-0' value='0'>0</option><option name='nbr-1' value='1'>1</option><option name='nbr-2' value='2'>2</option><option name='nbr-3' value='3'>3</option><option name='nbr-4' value='4'>4</option><option name='nbr-5' value='5'>5</option></select></div></div>"

        );
    }
    else{
        $('.hebergement').remove();
    }
});
});
