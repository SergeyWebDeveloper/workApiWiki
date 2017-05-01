(function () {

    let container=document.getElementById('search__wrapper');
    let btn=document.querySelector('.button');
    btn.addEventListener('click', requestHttp);

    function requestHttp(e) {
        e.preventDefault();
        let inputText=document.querySelector('.input');
        if(inputText.value.trim().length==0){
            container.innerText='Задан пустой запрос!';
            return false;
        }
        let url='https://ru.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=15&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch='+inputText.value+'&origin=*'
        let currentPageItem='https://ru.wikipedia.org/?curid=';
        let http=new XMLHttpRequest();
        http.open('GET', url, true);
        http.send();
        container.innerText='Загрузка данных...';
        inputText.parentNode.classList='control is-loading';
        btn.setAttribute('disabled','true');
        http.onreadystatechange=function () {
            if(this.readyState!=4){
                return;
            } else if(http.status!=200){
                console.log(this.status + ': ' + this.statusText);
            } else {
                inputText.parentNode.classList='';
                btn.removeAttribute('disabled');
                container.innerText='';
                dataAPI();
            }
        };
        //обработка данных
        function dataAPI() {
            let counter=1;
            let dataAll=JSON.parse(http.responseText);
            let obj=dataAll.query.pages;
            for(let key in obj){
                let img='';
                if(obj[key].hasOwnProperty('thumbnail')){
                    img='<a href="'+currentPageItem+''+obj[key].pageid+'" target="_blank">' +
                            '<img src="'+obj[key].thumbnail.source+'" alt="'+ obj[key].title +'">' +
                        '</a>';
                }
                setTimeout(function () {
                    let div = document.createElement('div');
                    div.classList='search__item columns';
                    div.innerHTML='<div class="column is-12 box">'
                        + img +
                        '<p><a href= '+currentPageItem+''+obj[key].pageid+' target="_blank">'+obj[key].title+'</a></p>' +
                        '<p>'+obj[key].extract+'</p>' +
                        '</div>';
                    div.classList.add('animate');
                    container.appendChild(div);
                },counter*150);
                counter++;
            }
        }
    }
}());