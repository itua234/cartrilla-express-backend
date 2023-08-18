<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Modernize Free</title>
  <link rel="shortcut icon" type="image/png" href="../assets/images/logos/favicon.png" />
  <link rel="stylesheet" href="../assets/css/styles.min.css" />
  <link rel="stylesheet" href="../assets/css/cartrilla.css" />
</head>

<body>
  <!--  Body Wrapper -->
  <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
    data-sidebar-position="fixed" data-header-position="fixed">
    <div
      class="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div class="d-flex align-items-center justify-content-center w-100">
        <div class="row justify-content-center w-100">
          <div class="col-md-8 col-lg-6 col-xxl-3">
            <div class="card mb-0">
              <div class="card-body">
                <a href="./index.html" class="text-nowrap logo-img text-center d-block py-3 w-100">
                  <img src="../assets/images/logos/dark-logo.svg" width="180" alt="">
                </a>
                <p class="text-center">Your Social Campaigns</p>
                <span class="message d-block" style="text-align:center"></span>
                <form action="/register" method="POST" id="register-form">
                  <div class="mb-3">
                    <label for="firstname" class="form-label">FirstName</label>
                    <input type="text" class="form-control" id="firstname" name="firstname">
                    <span class="error"></span>
                  </div>
                  <div class="mb-3">
                    <label for="lastname" class="form-label">LastName</label>
                    <input type="text" class="form-control" id="lastname" name="lastname">
                    <span class="error"></span>
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="email" name="email">
                    <span class="error"></span>
                  </div>
                  <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input type="number" class="form-control" id="phone" name="phone">
                    <span class="error"></span>
                  </div>
                  <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password">
                    <span class="error"></span>
                  </div>
                  <div class="mb-4">
                    <label for="password_confirmation" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="password_confirmation" name="password_confirmation">
                    <span class="error"></span>
                  </div>
                  <button type="submit" class="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Sign Up</button>
                  <div class="d-flex align-items-center justify-content-center">
                    <p class="fs-4 mb-0 fw-bold">Already have an Account?</p>
                    <a class="text-primary fw-bold ms-2" href="./authentication-login.html">Sign In</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script src="/assets/libs/jquery/dist/jquery.min.js"></script>
  <script src="../assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
  <script src="/assets/libs/axios/axios.js"></script>
  <script>
    $(function () {
      $('#register-form').on("submit", function (event) {
        event.preventDefault();
        const form = event.target;
        const url = form.action;
        const inputs = {
          firstname: $("#firstname").val(),
          lastname: $("#lastname").val(),
          email: $("#email").val(),
          phone: $("#phone").val(),
          password: $("#password").val(),
          password_confirmation: $("#password_confirmation").val()
        };
        $('.error').text('');
        $('.message').text('');
        const config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            //Authorization: `Bearer ${apiKey}`
          }
        };
        axios.post(url, inputs, config)
        .then(function(response){
          let message = response.data.message;
          $(".message").text(message)
          //alert(JSON.stringify(data));
          //window.location.href = "/dashboard";
          //window.location.assign("");
        })
        .catch(function(error){
          let errors = error.response.data.error;
          if(errors.firstname){
            document.getElementsByClassName('error')[0].innerHTML = errors.firstname;
          }
          if(errors.lastname){
            document.getElementsByClassName('error')[1].innerHTML = errors.lastname;
          }
          if(errors.email){
            document.getElementsByClassName('error')[2].innerHTML = errors.email;
          }
          if(errors.phone){
            document.getElementsByClassName('error')[3].innerHTML = errors.phone;
          }
          if(errors.password){
            document.getElementsByClassName('error')[4].innerHTML = errors.password;
          }
          if(errors.password_confirmation){
            document.getElementsByClassName('error')[5].innerHTML = errors.password_confirmation;
          }

        });
      });
    });
  </script>
</body>

</html>