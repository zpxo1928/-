$(function () {
  $(".navbar-toggler").on("click", function (e) {
    $(".tm-header").toggleClass("show");
    e.stopPropagation();
  });

  $("html").click(function (e) {
    var header = document.getElementById("tm-header");

    if (!header.contains(e.target)) {
      $(".tm-header").removeClass("show");
    }
  });

  $("#tm-nav .nav-link").click(function (e) {
    $(".tm-header").removeClass("show");
  });
});

const list = document.querySelector('.list');
const sliceStr = document.querySelector('.tm-pt-30')
const sendBtn = document.querySelector('.tm-search-button')
const sendInput = document.querySelector('.tm-search-input')
const citySelect = document.querySelector('.citySelect')
//console.log(sendInput);


//初始化
function init() {
  getTourList();
}
init();


//取得列表
function getTourList() {
  axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$format=JSON", {
    headers: getAuthorizationHeader()
  })
    .then(function (response) {
      console.log(response.data);

      //畫面渲染
      let thisData = response.data;

      let str = "";

      thisData.forEach(function (item) {

        if (item.Picture.PictureUrl1 == undefined) {
          return;
        }

        let sliceDesStr = `${item.Description}`.slice(0, 63);

        str += `
              <article class="col-12 col-md-6 tm-post">
                    <hr class="tm-hr-primary">
                    <a href="index-page.html?id=${item.ScenicSpotID}" class="effect-lily tm-post-link tm-pt-60">
                        <div class="tm-post-link-inner">
                            <img src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}" class="img-fluid">                            
                        </div>
                        <span class="position-absolute tm-new-badge">Hot</span>
                        <h2 class="tm-pt-30 tm-color-primary tm-post-title">${item.ScenicSpotName}</h2>
                    </a>                    
                    <p class="tm-pt-30">`
          + sliceDesStr + `<span>．．．</span>` +
          `<a href="index-page.html?id=${item.ScenicSpotID}" class ="moreBtn">
                     more</a>`+
          `</p>
                    <div class="d-flex justify-content-between tm-pt-45">
                        <span class="tm-color-primary">景點地址 : ${item.Address}</span>
                        <span class="tm-color-primary"></span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between">
                        <span>開放時間 : ${item.OpenTime}</span>
                        <span></span>
                    </div>
                </article>`



      });

      list.innerHTML = str;


    }).catch(function (error) {
      console.log(error.response.data);
    });
}


//TDX驗證
function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  let AppID = '877ecc21fa62494d9196202469cf34e7';
  let AppKey = 'STgKa387ViTA2HoyS9uli9w9M_0';
  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString };
}

/*
//地區篩選監聽
citySelect.addEventListener('change', function (e) {
  e.preventDefault();

  const city = citySelect.value;
  console.log(city);

  
  if (city == "") {
      alert('請選擇地區');
      return;
  }
  

  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${city}?$format=JSON&`,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      console.log(response.data)



      //畫面渲染
      const thisData = response.data;
      let str = "";

      thisData.forEach(function (item) {

        if (item.Picture.PictureUrl1 == undefined) {
            return;
        }

        let sliceDesStr = `${item.DescriptionDetail}`.slice(0, 63);
        //console.log(item);      





        str += `<article class="col-12 col-md-6 tm-post">
              <hr class="tm-hr-primary">
              <a href="page.html?id=${item.ScenicSpotID}" class="effect-lily tm-post-link tm-pt-60">
                  <div class="tm-post-link-inner">
                      <img src="${item.Picture.PictureUrl1}" alt="${item.DescriptionDetail}" class="img-fluid">                            
                  </div>
                  <span class="position-absolute tm-new-badge">Hot</span>
                  <h2 class="tm-pt-30 tm-color-primary tm-post-title">${item.ScenicSpotName}</h2>
              </a>                    
              <p class="tm-pt-30">`
          + sliceDesStr + `<span>．．．</span>`
          + `<a href="page.html?id=${item.ScenicSpotID}" class ="moreBtn">more</a>` +
          `</p>
              <div class="d-flex justify-content-between tm-pt-45">
                  <span class="tm-color-primary">景點地址 : ${item.City} / ${item.Address} </span>
                  <span class="tm-color-primary"></span>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                  <span>開放時間 : ${item.OpenTime}</span>
                  <span></span>
              </div>
          </article>`
        
                      //計算類別數量
                      if (item.Class1 == undefined) {
                          
                          return;
                      }
                      else if (tourCategory[item.Class1] == undefined) {
                          tourCategory[item.Class1] = 1;
                      } else {
                          tourCategory[item.Class1] += 1;
                      }


      })

      //renderCategory();
      list.innerHTML = str;

    })
    .catch(function (error) {
      console.log(error);
    });

})
*/

//關鍵字搜尋監聽
sendBtn.addEventListener('click', function (e) {
  e.preventDefault();
   

  const keywords = sendInput.value;
  const city = citySelect.value;
  console.log(city); 

  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${city}?$filter=contains(ScenicSpotName,'${keywords}')&$format=JSON`,
    {
      headers: getAuthorizationHeader()
    })
    .then(function(response){
     //畫面渲染
     const thisData = response.data;
     let str = "";

     thisData.forEach(function (item) {

       /*if (item.Picture.PictureUrl1 == undefined) {
           return;
       }*/

       let sliceDesStr = `${item.DescriptionDetail}`.slice(0, 63);
       //console.log(item);      





       str += `<article class="col-12 col-md-6 tm-post">
             <hr class="tm-hr-primary">
             <a href="index-page.html?id=${item.ScenicSpotID}" class="effect-lily tm-post-link tm-pt-60">
                 <div class="tm-post-link-inner">
                     <img src="${item.Picture.PictureUrl1}" alt="${item.DescriptionDetail}" class="img-fluid">                            
                 </div>
                 <span class="position-absolute tm-new-badge">Hot</span>
                 <h2 class="tm-pt-30 tm-color-primary tm-post-title">${item.ScenicSpotName}</h2>
             </a>                    
             <p class="tm-pt-30">`
         + sliceDesStr + `<span>．．．</span>`
         + `<a href="index-page.html?id=${item.ScenicSpotID}" class ="moreBtn">more</a>` +
         `</p>
             <div class="d-flex justify-content-between tm-pt-45">
                 <span class="tm-color-primary">景點地址 : ${item.City} / ${item.Address} </span>
                 <span class="tm-color-primary"></span>
             </div>
             <hr>
             <div class="d-flex justify-content-between">
                 <span>開放時間 : ${item.OpenTime}</span>
                 <span></span>
             </div>
         </article>`
       /*
                     //計算類別數量
                     if (item.Class1 == undefined) {
                         
                         return;
                     }
                     else if (tourCategory[item.Class1] == undefined) {
                         tourCategory[item.Class1] = 1;
                     } else {
                         tourCategory[item.Class1] += 1;
                     }*/


     })

     //renderCategory();
     list.innerHTML = str;

   })
   .catch(function (error) {
     console.log(error);
   });
})
