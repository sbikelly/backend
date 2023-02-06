$(document).ready(function() {

    var votes = [];
    let jVotes = [];
    
    $(".ElectionResult").hide();
    $(".pBtnText").text("Report");

    $(".pBtn").click(function(){
        $(".ElectionResult").toggle();
        $(".myVote").toggle();
        $(".pBtnText").text("My Vote");
    });       
    

    //getting the candidate on each selection and inserting it in an array 
    $("input:radio").change(function() {

        let x = $(this).attr("id"); //getting the position's number
        let v = $(this).val(); //getting the position's value            
        votes[x] = v;

    });

    //submitting votes
    $("input:button").click(function() {

        votes.forEach(e => {
                           
            jVotes.push(e);
            
        });
        

        $.post("/voter/vote",
        {
          data: JSON.stringify(jVotes)
        },
        function(data,status){
            
            if(status == "success"){
                alert("Votes Submitted Successfully!!!");
                window.location.replace('/voter/index');
            }
        });

    });

    $("li.nav-item").click(function (e) { 
        //e.preventDefault();
        $("li.nav-item").removeClass("active");
        $(this).addClass("Active");
    });

    //confirm delete
    
    /*== begin change password ==*/

    let chkCount = {op:true, nmb:true, cl:true, lnt:true, cpwd: true };;

        $('#userOldPass').keyup(function(){
            
            var pass = $(this).val();
            $.post("/check/pass", {pass},
                function (data, textStatus, jqXHR) {
                    if(data == true){
                        $('#userOldPass').removeClass('notMatch').addClass('match');
                        chkCount.op = false;
                    }else{
                        $('#userOldPass').removeClass('match').addClass('notMatch');
                        chkCount.op = true;
                    }
                }
            );

            activate_btn();

        })

        
        //checking whether the entered password is strong enough
        function validate_pwd(pswd){
            
            //validate the length
            if ( pswd.length >= 8 ) {
                $('#userNewPass ').removeClass('notMatch').addClass('match');                
                $('#length').removeClass('invalid').addClass('valid');
                $('#length i').removeClass('fa fa-remove').addClass('fa fa-check');
                chkCount.lnt = false;                
            } else {
                $('#userNewPass ').removeClass('match').addClass('notMatch');                                
                $('#length').removeClass('valid').addClass('invalid');
                $('#length i').removeClass('fa fa-check').addClass('fa fa-remove');
                chkCount.lnt = true;
            }

            //validate capital letter
            if ( pswd.match(/[A-Z]/) ) {
                $('#userNewPass ').removeClass('notMatch').addClass('match');                
                $('#capital').removeClass('invalid').addClass('valid');                
                $('#capital i').removeClass('fa fa-remove').addClass('fa fa-check');
                chkCount.cl = false;
            } else {
                $('#userNewPass ').removeClass('match').addClass('notMatch');
                $('#capital').removeClass('valid').addClass('invalid');                
                $('#capital i').removeClass('fa fa-check').addClass('fa fa-remove');
                chkCount.cl = true;
            }

            //validate number
            if ( pswd.match(/\d/) ) {
                $('#userNewPass ').removeClass('notMatch').addClass('match');                
                $('#number').removeClass('invalid').addClass('valid');
                $('#number i').removeClass('fa fa-remove').addClass('fa fa-check');
                chkCount.nmb = false;
            } else {
                $('#userNewPass ').removeClass('match').addClass('notMatch');
                $('#number').removeClass('valid').addClass('invalid');
                $('#number i').removeClass('fa fa-check').addClass('fa fa-remove');
                chkCount.nmb = true;
            }

        }
        
        //check password event
        let unpwd = ''; // new password placeholder
        $('#userNewPass ').keyup(function(e) {
            
            e.preventDefault();
           
            // set password variable
            var pswd = $(this).val();
            unpwd = pswd;
            validate_pwd(pswd);
            activate_btn();

        }).focus(function() {
            $('#pswd_info').show();
        }).blur(function() {
            $('#pswd_info').hide();
        });

        
        //confirm Password
        $('#confirmUserNewPass').keyup(function(e) {
            
            e.preventDefault();           
            // set password variable
            var cpswd = $(this).val();

            if(cpswd === unpwd){
                chkCount.cpwd = false;
                $('#confirmUserNewPass').removeClass('notMatch').addClass('match');
                $('#confirmUserNewPassTxt').text('');
            }else{
                chkCount.cpwd = true;
                $('#confirmUserNewPass').removeClass('match').addClass('notMatch');
                $('#confirmUserNewPassTxt').text('Password not Matched').addClass('invalid');
            }

            activate_btn();

        });

        // change password submit button activation
        function activate_btn(){
            if(chkCount.op == false && chkCount.cl == false && chkCount.lnt == false 
                && chkCount.nmb == false && chkCount.cpwd == false){

                // enable the change_password submit button 
                $("#changePassBtn").prop('disabled', false);
            }else{
                $("#changePassBtn").prop('disabled', true);
            }
        }


        /*== end change password*/


        
});