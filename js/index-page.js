function init() {
    getTourItem();
}
init();

function getTourItem() {
    const id = location.href.split("=")[1];
    //console.log(id)
    axios.get(`https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$format=JSON&$filter=contains(ScenicSpotID,'${id}')`, {
        headers: getAuthorizationHeader()
    })
        .then(function (response) {
            //console.log(response)
            const thisData = response.data[0];
            console.log(response.data[0]);
            document.querySelector('title').textContent = thisData.ScenicSpotName + `景點介紹－台ㄨㄢ好好玩旅遊景點導覽網站`;
            document.querySelector('.list').innerHTML =
                `<article class="col-12 tm-post">
                      <hr class="tm-hr-primary">                      
                          <div class="tm-post-link-inner">
                              <img src="${thisData.Picture.PictureUrl1}" alt="${thisData.Picture.PictureDescription1}" class="img-fluid">                            
                          </div>                          
                          <h2 class="tm-pt-30 tm-color-primary tm-post-title">${thisData.ScenicSpotName}</h2>                                          
                      <p class="tm-pt-30">
                      ${thisData.DescriptionDetail}                        
                      </p>
                      <p class="tm-pt-30">
                      交通方式 : ${thisData.TravelInfo} </p>
                      <div class="d-flex justify-content-between tm-pt-45">
                          <span class="tm-color-primary">活動地點 : ${thisData.Address}</span>
                          <span class="tm-color-primary"></span>
                      </div>
                      <hr>
                      <div class="d-flex justify-content-between">
                          <span>開放時間 : ${thisData.OpenTime}</span>                        
                      </div>
                      <div class="d-flex justify-content-between">                          
                      <span>聯絡電話 : ${thisData.Phone}</span> 
                      </div>
                      <div class="d-flex justify-content-between">                          
                      <span>收費方式 : ${thisData.TicketInfo}</span> 
                      </div>
                  </article>`

        }).catch(function (error) {
            console.log(error.response.data)
            console.log('no')
        })
}




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
