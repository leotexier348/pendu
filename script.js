var NBDETOUR = 8;
let tabLettresUtilisees= [];


window.onload = function() {
    init();
};


function init() {

    tabLettresUtilisees = [];
    let mot = creer_mot_a_rechercher(); // Choisir un mot à deviner
    let tabMot = mot.split(''); // Convertir le mot en tableau de lettres
    let reveled = new Array(tabMot.length).fill(false); // Tableau pour garder trace des lettres devinées
    afficherPremiereEtDerniere(tabMot,reveled);
    let counterErreur = 0; // Compteur d'erreurs

    afficherEcran(tabMot, reveled, counterErreur); // Afficher l'écran initial

    console.log(tabLettresUtilisees);
}






// Fonction pour afficher l'écran de jeu
function afficherEcran(tabMot, reveled, counterErreur) {
    document.body.innerHTML = ""; // Réinitialiser le corps pour éviter les doublons

    // Afficher le titre
    afficherTitre("Jeu de devinette");

    // Afficher les lettres du mot caché
    afficherLettresDuMotCache(tabMot, reveled);

    // Afficher le nombre de tentatives restantes
    afficherNombreTentative(counterErreur);

    // Créer les lettres de l'alphabet
    creer_lettres_alphabet(tabMot, reveled, counterErreur); // Passer les paramètres nécessaires

    // Créer bouton recommencer
    creerBoutonReset( counterErreur );

    // listes lettres deja utilisées
    if(counterErreur > 0){
    creerListLettresUtilisees();
    }

}

// Fonction pour afficher le nombre de tentatives restantes
function afficherNombreTentative(counterErreur) {
    let compteur = document.createElement('h4');
    compteur.textContent = `Nombre de tentatives restantes : ${NBDETOUR - counterErreur}`;
    document.body.appendChild(compteur);
}

// Fonction pour afficher le titre
function afficherTitre(jeuDeDevinnette) {
    let titre = document.createElement('h1');
    titre.textContent = jeuDeDevinnette;
    document.body.appendChild(titre);
}

// Fonction pour choisir un mot aléatoire
function creer_mot_a_rechercher() {
    let indiceAleatoire = Math.floor(Math.random() * dico.length);
    return dico[indiceAleatoire];
}

// Fonction pour vérifier si la lettre est dans le mot
function rechercher_une_lettre(mot, lettre) {
    return mot.includes(lettre); // Vérifier si la lettre est présente dans le mot
}

// Fonction pour vérifier si le joueur a gagné
function verif_victoire(tabMot, reveled) {
    return tabMot.every((letter, index) => reveled[index]); // Vérifier si toutes les lettres sont devinées
}

// Fonction pour afficher les lettres du mot caché + premiere et derniere avec lettre identique
function afficherLettresDuMotCache(tabMot, reveled) {
    let motAffiche = tabMot.map((letter, index) => {
        return reveled[index] ? letter : "_"; // Afficher la lettre ou un underscore
    }).join(' ');

    let motElement = document.createElement('h2');
    motElement.textContent = motAffiche; // Mettre à jour le texte du mot affiché
    document.body.appendChild(motElement); // Ajouter l'élément au corps
}


function afficherPremiereEtDerniere(tabMot, reveled) {
    let lettre1 = tabMot[0];
    reveled[0] = true;

    let lettre2 = tabMot[tabMot.length - 1];
    reveled[reveled.length - 1] = true;

    if(!tabLettresUtilisees.includes(lettre1)){
        tabLettresUtilisees.push(lettre1,lettre2);
    }


    for (let i = 1; i < tabMot.length - 1; i++) {
        if (tabMot[i] === lettre1 || tabMot[i] === lettre2) {
            reveled[i] = true;
        }
    }
}




// Fonction pour créer les lettres de l'alphabet
function creer_lettres_alphabet(tabMot, reveled, counterErreur) {
    let alphabetSec = document.createElement('section');
    alphabetSec.id = 'alphabetSection';

    for (let i = 65; i <= 90; i++) {
        let letterDiv = document.createElement('div');
        let lettre = String.fromCharCode(i).toUpperCase(); // Convertir en majuscule pour correspondre au mot
        letterDiv.textContent = lettre;

        // Ajouter un écouteur d'événements
        letterDiv.addEventListener('click', function() {
            // Appeler la fonction de traitement de la lettre choisie
            traiterLettreChoisie(lettre, tabMot, reveled, counterErreur);

            console.log(tabLettresUtilisees);
        });

        alphabetSec.appendChild(letterDiv);
    }

    document.body.appendChild(alphabetSec);
}

// Fonction pour traiter la lettre choisie
function traiterLettreChoisie(lettre, tabMot, reveled, counterErreur) {
    if (rechercher_une_lettre(tabMot.join(''), lettre)) { // Vérifier si la lettre est correcte
        // Mettre à jour le tableau de lettres révélées
        tabMot.forEach((char, index) => {
            if (char === lettre) {
                reveled[index] = true;
            }
        });
    } else {

        counterErreur++; // Incrémenter le compteur d'erreurs
    }

    if(!tabLettresUtilisees.includes(lettre)){
        tabLettresUtilisees.push(lettre); // ajoute lette selectionnée à la liste des lettre utilisée
    }

    // Afficher l'écran avec les lettres mises à jour
    afficherEcran(tabMot, reveled, counterErreur);

    // Vérifier la victoire ou la défaite
    if (verif_victoire(tabMot, reveled)) {
        alert("Félicitations ! Vous avez deviné le mot : " + tabMot.join(''));
    } else if (counterErreur >= NBDETOUR ) {
        alert("Désolé, vous avez perdu ! Le mot était : " + tabMot.join(''));
        init();
    }


}

function creerBoutonReset(counterErreur){
    let reset = document.createElement('button');
    reset.id = 'recommencerBttn';
    reset.textContent = 'RECOMMENCER';
    reset.addEventListener('click', function(){
        if(counterErreur >= 1 ){
            init();
        }
    })
    document.body.appendChild(reset);
}

function creerListLettresUtilisees() {
    let titre = document.createElement('h4');
    titre.textContent = 'Lettres déjà utilisées';
    document.body.appendChild(titre);

    let listLettres = document.createElement("ul");
    document.body.appendChild(listLettres);

    // Vérification que le tableau `tabLettresUtilisees` existe et contient des éléments
    if (Array.isArray(tabLettresUtilisees) && tabLettresUtilisees.length > 0) {
        // Parcourir les lettres utilisées et les ajouter à la liste
        tabLettresUtilisees.forEach((lettre) => {
            let lettreTemp = document.createElement('li');
            lettreTemp.textContent = lettre;
            listLettres.appendChild(lettreTemp);
        });
    }
}

