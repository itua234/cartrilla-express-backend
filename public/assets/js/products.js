$(function () {
   const baseUrl = "http://172.20.10.2:8080/api/v1";

   function getSerial(index, page){
      var sum = (page - 1) * 5 + index;
      return sum;
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

         var sn = 0;
         $(".cr-all-products").html("");
         products.forEach(function(product, index){
           $(".cr-all-products").append(`
             <tr>
               <td class="border-bottom-0">
                 ${getSerial(index + 1, pageNumber)}
               </td>
               <td class="border-bottom-0 item">
                 <div class="thumb">
                   <img class="w-100" src="${product.images[0]["url"]}" alt="" />
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
                 <a class="remove-product" data-id="${product.uuid}">
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
      //event.preventDefault();
      const selectedValue = Number($(this).val());
      fetchAllStoreProducts(selectedValue);
   });

   $(document).ready(function(){
      $(document).on("click", ".edit-product", function(event){
         event.preventDefault();
         const id = $(this).data("id");
         axios.get(`${baseUrl}/product/${id}`)
         .then((res) => {
            let data = res.data.results;
            $(".cr-sidebar form input[name='name']").val(data.name);
            $(".cr-sidebar form input[name='price']").val(data.price);
            $(".cr-sidebar form input[name='stock']").val(data.stock);
            $(".cr-sidebar form input[name='brand']").val(data.brand);
            $(".cr-sidebar form select[name='category']").val(data.category.id);
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
         $(".cr-modal").addClass("show");
      });
   });

   $(document).ready(function(){
      $(document).on("click", ".remove-product", function(event){
         event.preventDefault();
         const id = $(this).data("id");
         alert(id);
      });
   });

   $(document).ready(function(){
      axios.get(`${baseUrl}/category`)
      .then((res) => {
         let categories = res.data.results;
         categories.forEach(function(category, index){
            $(".cr-sidebar form select[name='category']").append(`
               <option value=${category["id"]}>${category["name"]}</option>
            `)
            $(".search-select").append(`
               <option value=${category["id"]}>${category["name"]}</option>
            `)
         });
      });
   });


   $(".cr-add-product-toggle").click(function(event){
      event.preventDefault();
      var leftPosition = $(".cr-sidebar").css("right");
      if(leftPosition == "-290px"){
         $(".cr-sidebar").css("right", "0px");
      }else{
         $(".cr-sidebar").css("right", "-290px");
      }
   });

})