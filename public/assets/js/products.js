$(function () {
   const baseUrl = "http://172.20.10.2:8080/api/v1";

   function getSerial(index, page){
      var sum = (page - 1) * 10 + index;
      return sum;
   }

   function getRandomImage(images){
      var length = images.length;
      let random = Math.floor(Math.random() * length);
      return images[random]["url"];
   }

   function fetchAllStoreProducts(pageNumber){
      axios.get(`${baseUrl}/admin/products?q=all&page=${pageNumber}`)
      .then((res) => {
         let products = res.data.results;
         let pages = res.data.pages;
         $(".pagination-pages-count").text(pages);
         $(".pagination-form-select").html("");
         for(let i=1; i<=pages; i++){
            if(i == pageNumber){
               $(".pagination-form-select").append(`
                  <option value=${i} selected>${i}</option>
               `)
            }else{
               $(".pagination-form-select").append(`
                  <option value=${i}>${i}</option>
               `)
            }
         };

         $(".cr-all-products tbody").empty();
         products.forEach(function(product, index){
           $(".cr-all-products tbody").append(`
             <tr>
               <td class="border-bottom-0">
                 ${getSerial(index + 1, pageNumber)}
               </td>
               <td class="border-bottom-0 item">
                 <div class="thumb">
                   <img class="w-100" src="${getRandomImage(product.images)}" alt="" />
                 </div>
                 <h6 class="fw-semibold mb-0">${product.name}</h6>
               </td>
               <td class="border-bottom-0">
                   <span class="">${product.price} <span>NGN</span></span>    
               </td>
               <td class="border-bottom-0">
                 <p class="mb-0 fw-normal">${product.stock}</p>
               </td>
               <td class="border-bottom-0">
                 <span class="">${product.category.name}</span>
               </td>
               <td class="border-bottom-0">
                   <span class="">${product.sales}</span>
               </td>
               <td class="border-bottom-0 edit-product-item">
                 <a class="view-product" data-id="${product.uuid}">
                   <img src="/assets/images/icons/eye.svg" />
                 </a>
               </td>
               <td class="border-bottom-0 edit-product-item">
                 <a class="edit-product" data-id="${product.uuid}">
                   <img src="/assets/images/icons/file-edit.svg" />
                 </a>
               </td>
               <td class="border-bottom-0">
                 <a class="remove-product" data-id="${product.uuid}" data-target="delete-product-modal">
                   <img src="/assets/images/icons/trash.svg" />
                 </a>
               </td>
             </tr>  
           `);
         })
      });
   };
   fetchAllStoreProducts(1);

   /*function updatePaginationButtons(){
      for(let i=1; i<=5; i++){
         $(".pagination").append(`
           <li class="page-item"><a class="page-link-item">${i}</a></li>
         `)
      }
   };*/

   $(".pagination").on("click", ".page-link-item", function(event){
      event.preventDefault();
      const pageNumber = Number($(this).text());
      fetchAllStoreProducts(pageNumber);
   });

   $(".pagination-form-select").change(function(event){
      const selectedValue = Number($(this).val());
      fetchAllStoreProducts(selectedValue);
   });

   //open the sidebar and then populate the input fields with the product details to be updated
   $(document).ready(function(){
      $(document).on("click", ".edit-product", function(event){
         event.preventDefault();
         const id = $(this).data("id");
         axios.get(`${baseUrl}/product/${id}`)
         .then((res) => {
            let data = res.data.results;
            var btn = $("#create-product button[type='submit']");
            btn.data("id", data.uuid);
            btn.data("action", "update");
            $(".cr-sidebar form input[name='name']").val(data.name);
            $(".cr-sidebar form input[name='price']").val(data.price);
            $(".cr-sidebar form input[name='stock']").val(data.stock);
            $(".cr-sidebar form input[name='brand']").val(data.brand);
            $(".cr-sidebar form select[name='category_id']").val(data.category.id);
            $(".cr-sidebar form textarea[name='description']").val(data.description);
            $(".cr-sidebar").css("right", "0px");
         });
      });
   });

   
   $(document).ready(function(){
      $(document).on("click", ".view-product", function(event){
         event.preventDefault();
         const id = $(this).data("id");
         alert(id);
      });
   });

   $(document).ready(function(){
      //open the product delete modal
      $(document).on("click", ".remove-product", function(event){
         event.preventDefault();
         const modalId = $(this).data("target");
         const productId = $(this).data("id");
         $("#"+modalId+" .modal-footer button").data("id", productId);
         $("#"+modalId).addClass("show");
      });
      //close the product delete modal
      $(".close").on("click", function(event){
         event.preventDefault();
         var id = $(this).data("dismiss");
         $("#"+id).removeClass("show")
      });

      $("#delete-product-modal .modal-footer button").click(function(event){
         event.preventDefault();
         var btn = $(this);
         btn.text("Deleting....");
         let productId = btn.data("id");
         axios.delete(`${baseUrl}/product/${productId}`)
         .then((res) => {
            btn.attr("disabled", false);
            btn.text("Yes");
            fetchAllStoreProducts(1);
            btn.parent().parent().parent().removeClass("show");
         })
         .catch(function(error){
            //let errors = error.response.data.error;
            btn.attr("disabled", false);
            btn.text("Yes");
         });
      });
   });

   //fetch list of categories and then populate the select input field
   $(document).ready(function(){
      axios.get(`${baseUrl}/category`)
      .then((res) => {
         let categories = res.data.results;
         categories.forEach(function(category, index){
            $(".cr-sidebar form select[name='category_id']").append(`
               <option value=${category["id"]}>${category["name"]}</option>
            `)
         });
      });
   });

   //open the sidebar and then populate the input fields with the details of the new product to be added
   $(".cr-add-product-toggle").click(function(event){
      event.preventDefault();
      //var rightPosition = $(".cr-sidebar").css("right");
      $(".cr-sidebar").css("right", "0px");

      var btn = $("#create-product button[type='submit']");
      btn.data("id", "");
      btn.data("action", "create");
   });

   $(".cr-sidebar .close-icon").click(function(event){
      event.preventDefault();
      //var rightPosition = $(".cr-sidebar").css("right");
      $("#create-product")[0].reset();
      $('.error').text('');
      $('.message').text('');
      $(".cr-sidebar").css("right", "-290px");

      var btn = $("#create-product button[type='submit']");
      btn.data("id", "");
      btn.data("action", "");
   });

   //Validate price and stock input field (allow only numbers)
   $(document).ready(function(){
      $(".cr-sidebar form input[name='price']").on("input", function(event){
         var inputValue = $(this).val();
         var pattern = /^[0-9]+$/;
         if(!pattern.test(inputValue)){
            $(this).val(inputValue.replace(/^[0-9]+$/, ""));
         }
      });
      $(".cr-sidebar form input[name='stock']").on("input", function(event){
         var inputValue = $(this).val();
         var pattern = /^[0-9]+$/;
         if(!pattern.test(inputValue)){
            $(this).val(inputValue.replace(/^[0-9]+$/, ""));
         }
      });
   });

   function createProduct(url, formData){
      var btn = $("#create-product button[type='submit']");
      var btnSpan = $("#create-product button[type='submit'] span");
      const config = {
         headers: {
           Accept: "application/json",
           "Content-Type": "multipart/form-data",
           //Authorization: `Bearer ${apiKey}`
         }
      };
      axios.post(url, formData, config)
      .then(function(response){
         let message = response.data.message;
         $(".message").text(message);
         fetchAllStoreProducts(1);
         btn.attr("disabled", false);
         btnSpan.text("Submit");
      })
      .catch(function(error){
         let errors = error.response.data.error;
         if(errors.name){
            document.getElementsByClassName('error')[0].innerHTML = errors.name;
         }
         if(errors.price){
            document.getElementsByClassName('error')[1].innerHTML = errors.price;
         }
         if(errors.stock){
            document.getElementsByClassName('error')[2].innerHTML = errors.stock;
         }
         if(errors.brand){
            document.getElementsByClassName('error')[3].innerHTML = errors.brand;
         }
         if(errors.category_id){
            document.getElementsByClassName('error')[4].innerHTML = errors.category_id;
         }
         if(errors.description){
            document.getElementsByClassName('error')[5].innerHTML = errors.description;
         }
         if(errors.images){
            document.getElementsByClassName('error')[6].innerHTML = errors.images;
         }
         btn.attr("disabled", false);
         btnSpan.text("Submit");
      });
   }

   //Add new products to the store
   $('#create-product').on("submit", function (event) {
      event.preventDefault();
      var btn = $("#create-product button[type='submit']");
      btn.attr("disabled", true);
      $("#create-product button[type='submit'] span").text("Adding...");
      var form = event.target;
      var url = form.action;
      var images = $("#images").prop("files");

      var formData = new FormData(form);
      
      $('.error').text('');
      $('.message').text('');
      //var apiKey = '<%= apiKey %>';
      if(btn.data("action") == "update"){
         url = url+"/"+btn.data("id");
      }
      createProduct(url, formData);
   });

})