// Calculateur IMG pour l'application Coach
(function() {
    'use strict';

    // Classe Profil (reproduction de la logique C# en JavaScript)
    class Profil {
        constructor(sexe, poids, taille, age) {
            this.sexe = sexe;      // 0 pour une Femme et 1 pour un homme
            this.poids = poids;    // poids en Kg
            this.taille = taille;  // taille en cm
            this.age = age;        // âge en années
            this.img = 0;          // Indice de Masse Grasse
            this.message = '';     // Annonce du résultat

            // Calcul automatique de l'IMG et du message
            this.CalculIMG();
            this.ResultatIMG();
        }

        CalculIMG() {
            // Convertir la taille de cm en mètres
            const tailleEnMetres = this.taille / 100.0;
            
            // Calcul de l'IMG selon la formule exacte
            // IMG = (1,2 × Poids / Taille²) + (0,23 × Âge) - (10,83 × S) - 5,4
            this.img = (1.2 * this.poids / (tailleEnMetres * tailleEnMetres)) 
                     + (0.23 * this.age) 
                     - (10.83 * this.sexe) 
                     - 5.4;
        }

        ResultatIMG() {
            if (this.sexe === 1) { // Homme
                if (this.img < 15) {
                    this.message = "Trop maigre.";
                } else if (this.img >= 15 && this.img <= 20) {
                    this.message = "Parfait.";
                } else { // img > 20
                    this.message = "Surpoids.";
                }
            } else { // Femme (sexe === 0)
                if (this.img < 25) {
                    this.message = "Trop maigre.";
                } else if (this.img >= 25 && this.img <= 30) {
                    this.message = "Parfait.";
                } else { // img > 30
                    this.message = "Surpoids.";
                }
            }
        }

        get Img() {
            return this.img;
        }

        get Message() {
            return this.message;
        }
    }

    function init() {
        // Éléments du formulaire
        const inputPoids = document.getElementById('inputPoids');
        const inputTaille = document.getElementById('inputTaille');
        const inputAge = document.getElementById('inputAge');
        const radioItems = document.querySelectorAll('.img-radio-item');
        const btnCalculer = document.getElementById('btnCalculerIMG');
        const resultDisplay = document.getElementById('resultDisplay');
        const resultIMG = document.getElementById('resultIMG');
        const resultMessage = document.getElementById('resultMessage');
        const resultSmiley = document.getElementById('resultSmiley');

        // Gestion des radio buttons
        radioItems.forEach(item => {
            item.addEventListener('click', () => {
                radioItems.forEach(r => r.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Fonction de calcul et affichage
        function calculerIMG() {
            // Récupérer les valeurs saisies
            const poidsStr = inputPoids.value.trim();
            const tailleStr = inputTaille.value.trim();
            const ageStr = inputAge.value.trim();

            // Vérifier que tous les champs sont remplis
            if (!poidsStr || !tailleStr || !ageStr) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            // Convertir les valeurs en nombres
            const poids = parseFloat(poidsStr);
            const taille = parseFloat(tailleStr);
            const age = parseInt(ageStr);

            // Vérifier que les valeurs sont numériques
            if (isNaN(poids) || isNaN(taille) || isNaN(age)) {
                alert('Veuillez saisir des valeurs numériques valides');
                return;
            }

            // Vérifier que les valeurs sont positives
            if (poids <= 0 || taille <= 0 || age <= 0) {
                alert('Les valeurs doivent être positives');
                return;
            }

            // Déterminer le sexe (0 pour femme, 1 pour homme)
            const sexeActive = document.querySelector('.img-radio-item.active');
            const sexe = parseInt(sexeActive.getAttribute('data-sexe'));

            try {
                // Instancier un nouvel objet Profil
                const profil = new Profil(sexe, poids, taille, age);

                // Afficher le résultat
                afficherResultat(profil);
            } catch (error) {
                alert('Erreur lors du calcul : ' + error.message);
            }
        }

        // Fonction d'affichage du résultat
        function afficherResultat(profil) {
            // Afficher le résultat avec l'IMG et le message
            resultIMG.textContent = `Votre IMG : ${profil.Img.toFixed(2)}%`;
            resultMessage.textContent = profil.Message;

            // Afficher l'image associée selon le message
            if (profil.Message === "Trop maigre.") {
                resultSmiley.textContent = "😟";
            } else if (profil.Message === "Parfait.") {
                resultSmiley.textContent = "😊";
            } else if (profil.Message === "Surpoids.") {
                resultSmiley.textContent = "😔";
            }

            // Afficher le résultat avec animation
            resultDisplay.style.display = 'flex';
            resultDisplay.classList.add('show-result');
            
            // Scroll vers le résultat
            resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Événement sur le bouton calculer
        btnCalculer.addEventListener('click', calculerIMG);

        // Permettre le calcul avec la touche Entrée
        [inputPoids, inputTaille, inputAge].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    calculerIMG();
                }
            });
        });
    }

    // Initialisation au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
