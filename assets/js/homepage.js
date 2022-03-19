var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var languageButtonsEl = document.querySelector('#language-buttons')

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  
    fetch(apiUrl).then(function(response) {
      if (response.ok) {
        response.json().then(function(data){
          displayRepos(data.items, language);
        });
      } else {
        alert('Error: GitHub User Not Found');
      }
    });
  };

var getUserRepos = function(user){
    // format the github api
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
    // Request was successful 
      if (response.ok) {
        response.json().then(function(data) {
            displayRepos(data, user);
        });
    } else {
        alert("Error: GitHub User Not Found");
    }
    })
    .catch(function(error) {
    // Notice this '.catch()' getting chained onto the end of the '.then()' method
    alert("Unable to connect to GitHub");
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();
// get value from the input element
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
      alert("Please enter a GitHub username");
  }
    console.log(event);
};

var displayRepos = function(repos, searchTerm) {
// Check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
// Clearout old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
// loop over repos
for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;
  
    // create a container for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?=" + repoName);
    // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

// Append to Container
        repoEl.appendChild(titleEl);
// Create a status Element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

// Check if Current Repos has Issues or NOT
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + "issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
// Append to Container
        repoEl.appendChild(statusEl);

// Append Container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

var buttonClickHandler = function(event){
    var language = event.target.getAttribute("data-language");
    console.log(language);
    if (language) {
        getFeaturedRepos(language);
    
    //Clear old content
    repoContainerEl.textContent = "";
    }
}

languageButtonsEl.addEventListener("click", buttonClickHandler);

userFormEl.addEventListener("submit", formSubmitHandler);
