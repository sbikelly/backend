


$(document).ready(function () {

    /*== begin change password ==*/
    
    //confirm Password
    $('#confirmUserNewPass').keyup(function(e) {
            
        e.preventDefault();           
        // set password variable
        var unpwd = $('#userNewPass').val();
        var cpswd = $(this).val();

        if(cpswd === unpwd){

            $('#confirmUserNewPassTxt').text('');
            // enable the change_password submit button 
            $("#changePassBtnS").prop('disabled', false);
        }else{

            $('#confirmUserNewPassTxt').text('Password not Matched...').addClass('text-danger');
            // enable the change_password submit button 
            $("#changePassBtnS").prop('disabled', true);
        }
    });

    /*== end change password*/

    
});


/*========Populate Department==========*/
function load_depts(Depts, sel){
    
    $(sel).empty(); // use $(sel+' option[value="+id+"]').remove() for a single option
    
    Depts.forEach( depts => { 
        $(sel).append($('<option>',{
            value: depts.name,
            text: depts.name
        }
        ));
        
    });

}

function get_faculty_depts(fclty, deptSel){

    var id = $(fclty).find(':selected').val();
    
    $.post("/faculty/depts",
    function(data){

        var fDepts = [];

        data.forEach(dept => {
            if(dept.f_id == id){
                fDepts.push(dept);
            }
        });

        load_depts(fDepts, deptSel);
        
    });
     
}

function load_faculties(sel){

    $.post('/faculty/details',
    function(data){

        data.forEach(faculties => {
            $(sel).append($('<option>',{
                value: faculties._id,
                text: faculties.name
            }
            ));
            
        });

    });

}
/*========End Populate Department==========*/

/* Post Edited User Data */
function edit_user_post(){

    var id = $('#editUserId').val();
    var name = $('#editUserName').val();
    var gender = $('#editUserGender').val();
    var dob = $('#editUserDob').val();
    var dept = $('#editUserDept').val();
    var phone = $('#editUserPhone').val();
    var email = $('#editUserMail').val();

    $.post('/user/update',{
        id, name, gender, dob, dept, phone, email            
    },
    function(data){
        $('#editUserModal').modal('hide');
        location.reload(true);
        alert('update Successful');
    });

}
