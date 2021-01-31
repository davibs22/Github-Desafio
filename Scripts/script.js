let list = document.querySelector("#lista")

//Função ao clicar o botão de Pesquisar
function pesquisar () {

    let textoPesquisa = document.getElementById("texto").value

    list.innerHTML = '<div style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px;"><div class="spinner-border" style="width: 3rem; height: 3rem;" role="status"><span class="sr-only"></span></div></div>'

    //Comunicação com API do GitHub para obter os repositórios relacionados ao texto no campo de pesquisa
    fetch("https://api.github.com/search/repositories?q=" + textoPesquisa, {method: "GET"})
        .then(function(response){
            response.json().then(function(data){

            list.innerHTML = ""

            for (let index = 0; index < data.items.length; index++) {

                var avatar = data.items[index].owner.avatar_url
                var fullname = data.items[index].full_name
                var description = data.items[index].description

                list.innerHTML += '<div id="'+ index +'" class="card cardR col-sm-5" style="width: 18rem;" value="'+ fullname +'"><img src= ' + avatar + ' class="card-img-top" alt="..." style="margin-top: 10px;"><div class="card-body"><h5 class="card-title" style="min-height: 48px;">' + fullname + '</h5><p class="card-text" style="min-height: 168px;">' + description +'</p></div><ul class="list-group list-group-flush"><li class="list-group-item"><svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path></svg> Issues</li><li class="list-group-item"><img height="16" width="16" src="https://static.thenounproject.com/png/1873890-200.png" class="img-fluid" alt="..."> Contributor</li></ul><div class="card-body"><button type="button" class="btn btn-primary" id="btnmore" onclick="more('+ index +')">Ver mais</button></div></div>'

            }
            })
        })
}

//Função ao clicar o botão de Ver Mais
function more (i) {
    var FULLNAME = ""

    //Comunicação com API do GitHub para obter os Contributors e os Issues
    fetch("https://api.github.com/search/repositories?q=" + document.getElementById("texto").value, {method: "GET"})
        .then(function(response){
            response.json().then(function(data){

                FULLNAME = data.items[i].full_name

                fetch("https://api.github.com/repos/" + FULLNAME, {method: "GET"})
                    .then(function(response) {
                        response.json().then(function(data){

                            var avatarRepos = data.owner.avatar_url
                            var name = data.name
                            var login = data.owner.login
                            var description = data.description

                            fetch("https://api.github.com/repos/" + FULLNAME + "/contributors", {method: "GET"})
                                .then(function(response){
                                    response.json().then(function(data){

                                        list.innerHTML = '<div style="display: block;"><div class="cardRepos"><img src="'+ avatarRepos +'" style="height: 100px; width: 100px; border-radius: 5px;"/><div style="margin-left: 20px;"><h1>'+ name +'</h1><h5>'+ login +'</h5></div></div><div class="card" style="margin-top: 20px;"><div class="card-header">Descrição</div><div class="card-body"><p class="card-text">'+ description +'</p></div></div><div class="card" style="margin-top: 20px;"><div class="card-header">Contribuintes</div><div class="card-body" id="ContributorsCard"></div></div><div class="card" style="margin-top: 20px;"><div class="card-header">Problemas</div><div class="card-body"><div class="media" style="display: flex;"><div id ="IssuesCard" class="media-body" style="display: block;"></div></div></div></div></div>'
                                        
                                        var ContributorsCard = document.querySelector("#ContributorsCard")

                                        for (let index = 0; index < data.length; index++){
                                            ContributorsCard.innerHTML += '<div style="display: flex;"><div class="media" style="display: flex;"><img src="'+ data[index].avatar_url +'" style="height: 25px; width: 25px; border-radius: 50%;" class="mr-3"><div class="media-body" style="display: flex;"><h5 class="mt-0" style="margin-left: 10px;">'+ data[index].login +'</h5><span class="spanContri">'+ data[index].contributions +' Contribuições</span></div>'
                                        }

                                        fetch("https://api.github.com/repos/" + FULLNAME + "/issues",{method: "GET"})
                                            .then(function(response){
                                                response.json().then(function(data){
                                                    var IssuesCard = document.querySelector("#IssuesCard")
                                                    console.log(data)
                                                    for (let i = 0; i < data.length; i++){
                                                        IssuesCard.innerHTML += '<a href="'+ data[i].html_url +'" style="display: flex;"><svg width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path></svg><h6 class="mt-0" style="margin-left: 10px;">'+ data[i].title +'</h6><span class="span'+ data[i].state +'">'+ data[i].state +'</span></a>'
                                                    }
                                                })
                                            })
                                    })
                                })
                        
                        })
                    })

            })
        })
}