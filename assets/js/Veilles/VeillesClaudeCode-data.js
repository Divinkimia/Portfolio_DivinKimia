/**
 * Donnees du parcours veille Claude Code (modules / lecons)
 * Ecriture volontairement ASCII + sequences Unicode pour eviter les problemes d'accents.
 */
window.VEILLE_DATA = {
  modules: [
    {
      id: 'cc-m1',
      title: 'Module 1 · Claude Code et cowork : fondamentaux',
      lessons: [
        {
          id: 'cc-what',
          title: 'Qu\\u2019est-ce que Claude Code ?',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Claude Code est un assistant de d\\u00e9veloppement orient\\u00e9 terminal/IDE qui aide \\u00e0 explorer une base de code, proposer des modifications et ex\\u00e9cuter des actions de mani\\u00e8re encadr\\u00e9e.',
          body: [
            'Son int\\u00e9r\\u00eat principal est de r\\u00e9duire le temps pass\\u00e9 sur les t\\u00e2ches r\\u00e9p\\u00e9titives : navigation dans le projet, pr\\u00e9paration de correctifs, scripts de maintenance et synth\\u00e8ses techniques.',
            'Il fonctionne bien quand le contexte est clair : objectifs pr\\u00e9cis, contraintes du projet, conventions d\\u2019\\u00e9quipe et crit\\u00e8res de validation.',
            'Le point cl\\u00e9 de la veille : Claude Code n\\u2019est pas seulement un g\\u00e9n\\u00e9rateur de texte, c\\u2019est un outil de production logicielle assist\\u00e9e avec garde-fous.'
          ],
          bullets: [
            'Acc\\u00e9l\\u00e8re la phase d\\u2019ex\\u00e9cution technique.',
            'Conserve un pilotage humain sur les d\\u00e9cisions.',
            'Doit \\u00eatre int\\u00e9gr\\u00e9 dans une m\\u00e9thode de travail.'
          ]
        },
        {
          id: 'cc-cowork',
          title: 'Dimension cowork : collaboration en \\u00e9quipe',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'La logique cowork repose sur des projets partag\\u00e9s, des droits diff\\u00e9renci\\u00e9s et une capitalisation des bonnes pratiques au niveau de l\\u2019\\u00e9quipe.',
          body: [
            'En pratique, l\\u2019\\u00e9quipe peut mutualiser les contextes, les conventions de r\\u00e9ponse, les checklists techniques et les r\\u00e8gles de validation.',
            'Cette approche r\\u00e9duit les \\u00e9carts entre d\\u00e9veloppeurs et facilite l\\u2019onboarding des nouveaux profils.',
            'La collaboration n\\u2019est efficace que si les responsabilit\\u00e9s restent claires : qui valide, qui d\\u00e9ploie, qui audite.'
          ],
          bullets: [
            'Partage de contexte et de m\\u00e9thodes.',
            'R\\u00f4les de lecture/\\u00e9dition selon les droits.',
            'Mont\\u00e9e en comp\\u00e9tences collective.'
          ]
        }
      ]
    },
    {
      id: 'cc-m2',
      title: 'Module 2 · Avantages op\\u00e9rationnels',
      lessons: [
        {
          id: 'cc-productivity',
          title: 'Gains de productivit\\u00e9 et qualit\\u00e9',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Les gains sont visibles sur la vitesse d\\u2019ex\\u00e9cution, la documentation et la continuit\\u00e9 de contexte dans les projets complexes.',
          body: [
            'Claude Code peut proposer des bases de tests, de scripts et de refactorings. Le d\\u00e9veloppeur gagne du temps sur le premier jet et concentre son effort sur la qualit\\u00e9 finale.',
            'Dans les grosses bases, l\\u2019assistant aide \\u00e0 retrouver les zones impact\\u00e9es et \\u00e0 maintenir une vision globale quand plusieurs fichiers sont concern\\u00e9s.',
            'Le vrai levier de qualit\\u00e9 n\\u2019est pas la vitesse seule : il repose sur la combinaison IA + relecture + tests automatiques.'
          ],
          bullets: [
            'Moins de temps sur les t\\u00e2ches \\u00e0 faible valeur.',
            'Meilleure tra\\u00e7abilit\\u00e9 des modifications.',
            'Qualit\\u00e9 stable si la revue reste obligatoire.'
          ]
        },
        {
          id: 'cc-standard',
          title: 'Standardiser les pratiques d\\u2019\\u00e9quipe',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Un usage encadr\\u00e9 permet de transformer l\\u2019assistant en standard de production plut\\u00f4t qu\\u2019en outil utilis\\u00e9 de fa\\u00e7on isol\\u00e9e.',
          body: [
            'Les r\\u00e8gles partag\\u00e9es (prompts de r\\u00e9f\\u00e9rence, conventions de commit, r\\u00e8gles de permissions) r\\u00e9duisent la variabilit\\u00e9 entre membres.',
            'Les politiques peuvent \\u00eatre align\\u00e9es avec la CI/CD : tests obligatoires, blocage de certains patterns, contr\\u00f4les avant merge.',
            'Sur le long terme, l\\u2019\\u00e9quipe gagne en maintenabilit\\u00e9 et en lisibilit\\u00e9 des changements.'
          ],
          bullets: [
            'Harmonisation des m\\u00e9thodes.',
            'R\\u00e9duction des erreurs de process.',
            'Meilleure qualit\\u00e9 de livraison en continu.'
          ]
        }
      ]
    },
    {
      id: 'cc-m3',
      title: 'Module 3 · S\\u00e9curit\\u00e9 : avantages et risques',
      lessons: [
        {
          id: 'cc-security-plus',
          title: 'Atouts s\\u00e9curit\\u00e9 (architecture et permissions)',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'La documentation officielle met en avant des garde-fous : permissions explicites, sandboxing, restrictions de commandes et politiques administrables.',
          body: [
            'Le principe du moindre privil\\u00e8ge peut \\u00eatre appliqu\\u00e9 : l\\u2019assistant n\\u2019agit que dans les limites autoris\\u00e9es, avec confirmations pour les actions sensibles.',
            'Les environnements d\\u2019entreprise peuvent imposer des r\\u00e8gles non contournables (ex. blocage de commandes, domaines autoris\\u00e9s, settings g\\u00e9r\\u00e9s).',
            'Ces contr\\u00f4les sont utiles pour r\\u00e9duire la surface d\\u2019attaque lors d\\u2019usages \\u00e0 grande \\u00e9chelle.'
          ],
          bullets: [
            'Permissions fines par action.',
            'Sandbox et contr\\u00f4les r\\u00e9seau.',
            'Politiques centralis\\u00e9es en contexte pro.'
          ]
        },
        {
          id: 'cc-security-risks',
          title: 'Risques r\\u00e9els et erreurs fr\\u00e9quentes',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Les incidents viennent souvent d\\u2019une mauvaise gouvernance : permissions trop larges, gestion faible des secrets, absence de revue humaine.',
          body: [
            'Risques classiques : fuite de secrets, validation automatique sans contr\\u00f4le, ex\\u00e9cution de commandes non ma\\u00eetris\\u00e9es et confiance excessive dans la sortie IA.',
            'La mitigation passe par des pratiques d\\u00e9fensives : rotation des cl\\u00e9s, scans secrets en CI, journalisation, revue PR obligatoire.',
            'Dans une d\\u00e9marche de veille, il faut distinguer les protections natives de l\\u2019outil et la maturit\\u00e9 s\\u00e9curit\\u00e9 de l\\u2019organisation.'
          ],
          bullets: [
            'Ne jamais exposer de secrets dans Git.',
            'Limiter les droits au strict n\\u00e9cessaire.',
            'Conserver validation humaine avant production.'
          ],
          appendHtml:
            '<div class="veille-lesson-rich"><p><strong>Checklist s\\u00e9curit\\u00e9 :</strong></p><ul class="veille-objectives-list">' +
            '<li>Bloquer la lecture des fichiers sensibles (<code>.env</code>, secrets, credentials).</li>' +
            '<li>Activer des contr\\u00f4les de permissions stricts sur les commandes.</li>' +
            '<li>Tracer les actions critiques pour audit et post-mortem.</li>' +
            '</ul></div>'
        }
      ]
    },
    {
      id: 'cc-m4',
      title: 'Module 4 · Emploi : transformations du march\\u00e9',
      lessons: [
        {
          id: 'cc-jobs-trends',
          title: 'Tendances 2025-2030 (WEF)',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Le march\\u00e9 de l\\u2019emploi se transforme : progression des comp\\u00e9tences IA/data/cybers\\u00e9curit\\u00e9 et recul de certains r\\u00f4les administratifs r\\u00e9p\\u00e9titifs.',
          body: [
            'Le WEF met en avant une reconfiguration massive des t\\u00e2ches d\\u2019ici 2030 : automatisation partielle, nouveaux besoins de supervision et forte pression sur l\\u2019upskilling.',
            'La valeur \\u00e9conomique se d\\u00e9place vers les profils capables d\\u2019orchestrer des outils, de qualifier les r\\u00e9ponses et de relier la technique au besoin m\\u00e9tier.',
            'L\\u2019enjeu n\\u2019est donc pas seulement la suppression de postes, mais la vitesse de transition des comp\\u00e9tences.'
          ],
          bullets: [
            'Comp\\u00e9tences techno en forte hausse.',
            'Requalification continue indispensable.',
            'Diff\\u00e9renciation par l\\u2019expertise m\\u00e9tier.'
          ]
        },
        {
          id: 'cc-jobs-impact',
          title: 'Impact concret pour les d\\u00e9veloppeurs',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Le r\\u00f4le d\\u00e9veloppeur \\u00e9volue vers plus de supervision technique, de gouvernance et de validation.',
          body: [
            'Les profils juniors peuvent produire plus vite, mais doivent consolider leurs fondamentaux pour \\u00e9viter une d\\u00e9pendance \\u00e0 des solutions non comprises.',
            'Les profils confirm\\u00e9s montent en responsabilit\\u00e9 sur l\\u2019architecture, la s\\u00e9curit\\u00e9, les choix d\\u2019outillage et l\\u2019encadrement des pratiques.',
            'La comp\\u00e9tence critique devient la capacit\\u00e9 \\u00e0 \\u00e9valuer, expliquer et justifier techniquement.'
          ],
          bullets: [
            'Passage de \\u00ab produire \\u00bb \\u00e0 \\u00ab piloter + valider \\u00bb.',
            'Poids accru de la qualit\\u00e9 et de la s\\u00e9curit\\u00e9.',
            'Nouveaux r\\u00f4les autour de la gouvernance IA.'
          ]
        }
      ]
    },
    {
      id: 'cc-m5',
      title: 'Module 5 · \\u00c9ducation : impacts et cadre d\\u2019usage',
      lessons: [
        {
          id: 'cc-edu-effects',
          title: 'Effets sur l\\u2019apprentissage',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'L\\u2019IA peut acc\\u00e9l\\u00e9rer l\\u2019apprentissage pratique, mais impose de renforcer l\\u2019esprit critique et la compr\\u00e9hension conceptuelle.',
          body: [
            'Les \\u00e9tudiants gagnent en autonomie pour prototyper, tester et explorer des pistes techniques.',
            'Le risque p\\u00e9dagogique est la r\\u00e9ponse correcte sans raisonnement : d\\u2019o\\u00f9 l\\u2019importance d\\u2019\\u00e9valuations par justification, soutenance et revue de code.',
            'L\\u2019usage pertinent consiste \\u00e0 traiter l\\u2019IA comme un tuteur actif, pas comme une solution qui remplace l\\u2019apprentissage.'
          ],
          bullets: [
            'Renforcer les comp\\u00e9tences de v\\u00e9rification.',
            'Mesurer la compr\\u00e9hension, pas seulement le r\\u00e9sultat.',
            'Encadrer l\\u2019usage par des r\\u00e8gles explicites.'
          ]
        },
        {
          id: 'cc-edu-governance',
          title: 'Cadre UNESCO et recommandations',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'UNESCO recommande une approche centr\\u00e9e sur l\\u2019humain : protection des donn\\u00e9es, inclusion, \\u00e9quit\\u00e9 et formation des enseignants.',
          body: [
            'Le message principal est de r\\u00e9guler et former, plut\\u00f4t que laisser un d\\u00e9ploiement sans cadre p\\u00e9dagogique et \\u00e9thique.',
            'Les \\u00e9tablissements doivent d\\u00e9finir une charte d\\u2019usage IA : ce qui est autoris\\u00e9, ce qui doit \\u00eatre cit\\u00e9, et ce qui doit \\u00eatre interdit.',
            'La formation continue des enseignants est indispensable pour garder la ma\\u00eetrise des objectifs d\\u2019apprentissage.'
          ],
          bullets: [
            'Mettre en place une gouvernance p\\u00e9dagogique IA.',
            'Prot\\u00e9ger donn\\u00e9es personnelles et propri\\u00e9t\\u00e9 intellectuelle.',
            'Former enseignants et \\u00e9tudiants \\u00e0 l\\u2019usage critique.'
          ]
        },
        {
          id: 'cc-conclusion',
          title: 'Conclusion · bilan de veille',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Claude Code et le cowork IA offrent un fort potentiel de performance, mais exigent un cadre de s\\u00e9curit\\u00e9, de qualit\\u00e9 et de formation durable.',
          body: [
            'La valeur ne vient pas uniquement de l\\u2019outil : elle vient de la qualit\\u00e9 du cadre de travail, des politiques d\\u2019acc\\u00e8s et de la maturit\\u00e9 de l\\u2019\\u00e9quipe.',
            'Sur l\\u2019emploi comme en \\u00e9ducation, la comp\\u00e9tence gagnante est la combinaison : expertise technique, esprit critique et gouvernance responsable.',
            'La veille doit rester continue, avec mise \\u00e0 jour r\\u00e9guli\\u00e8re des sources officielles et des retours terrain.'
          ],
          bullets: [
            'Conserver l\\u2019humain dans la boucle de d\\u00e9cision.',
            'Industrialiser les bonnes pratiques d\\u00e8s maintenant.',
            'Piloter l\\u2019IA comme un levier, pas comme un pilote autonome.'
          ]
        }
      ]
    }
  ]
};