

$(document).ready(function () {
        
    $('#editCandidateBtn').click(function () {  
        
        let candtId = $(this).attr('candtId');

        if(candtId == 'nil'){
            
            $('#newCandidateEditModal').modal('show');
        }else{
            
            $.ajax({
                url: "/candidate/details/"+candtId,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({id: candtId}),
                success: function(result){   
    
                    $('#newCandidateEditModal').modal('show');
                    $('#candtEditManifesto').val(result.manifesto);
                    $('#candtEditPhone').val(result.phone);
                    $('#candtEditMail').val(result.email);
                    if(!result.photo){                    
                        $('#userPhotoPrev').attr('src','/images/candidates/profile_avatar.png');
                    }else{                    
                        $('#userPhotoPrev').attr('src','/images/candidates/'+result.photo);
                    }
                    
    
                }
            });
        }


    });


    $('#editProfileBtn').click(function () {
        let userId = '';

        $.ajax({
            url: "/details",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({id: userId}),
            success: function(result){
                
                $('#profileEditModal').modal('show'); 
                $('#userEditName').val(result.name);
                $('#userEditDept').val(result.dept);
                $('#userEditPhone').val(result.phone);
                $('#userEditMail').val(result.email);
                $('#userEditDob').val(result.dob);
                if(!result.photo){                    
                    $('#userPhotoPrev').attr('src','/images/users/profile_avatar.png');
                }else{                    
                    $('#userPhotoPrev').attr('src','/images/users/'+result.photo);
                }

            }
        });


    });

        //Photo Preview
    function readURL(input, prevImg) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            var file = input.files[0];
            var fd = new FormData();
            var url = URL.createObjectURL(file);

            reader.onload = function (e) {
                $(prevImg).attr('src', e.target.result);
            }

            reader.readAsDataURL(file);
        }
    }

    $("#userPhotoInp").change(function(){
        readURL(this, '#userPhotoPrev');
    });

    $("#candtPhotoInp").change(function(){
        readURL(this, '#candtPhotoPrev');
    });
    

});

