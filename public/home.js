console.log("Uruchomiony home.js");


const bCreate = document.getElementById('create');
bCreate.addEventListener('click', function(e) {
    var createValue = document.getElementById('create-value').value;
    
    console.log('create button clicked ' + createValue);

    

});

const bJoin = document.getElementById('join');
bJoin.addEventListener('click', function(e) {
    var selectedVal = document.getElementById('join-value');
    var t = selectedVal.options[ selectedVal.selectedIndex ].text;
    console.log('join button clicked ' + t);
})