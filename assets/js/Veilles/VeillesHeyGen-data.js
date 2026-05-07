/**
 * Veille HeyGen — structure portfolio BTS SIO (8 parties)
 * appendHtml : tableau tarifs + exemples API Video Agent dans « Fonctionnement technique, tarifs et API (COMMENT ?) »
 */
window.VEILLE_DATA = {
  modules: [
    {
      id: 'hg-m1',
      title: '1 · Présentation rapide de la veille',
      lessons: [
        {
          id: 'hg-l1',
          title: '1 · Présentation rapide de la veille',
          hero: '../../assets/img/HeygenIMG.jpg',
          lead: 'HeyGen est une plateforme d’intelligence artificielle spécialisée dans la création de vidéos à partir de texte. Elle permet de générer des contenus vidéo avec des avatars numériques, des voix synthétiques et des traductions automatiques, sans tourner une vidéo classique.',
          body: [
            'Cette veille est intéressante car elle montre comment l’IA transforme la production audiovisuelle : au lieu de mobiliser du matériel, du temps de montage et des compétences avancées en vidéo, HeyGen propose une solution plus rapide, plus accessible et plus simple à prendre en main.',
            'C’est donc un outil qui illustre bien l’évolution actuelle des usages numériques.'
          ],
          bullets: [
            'Objet : vidéo générique à partir de texte + avatar + voix.',
            'Angle portfolio : IA générative, médias, démarche de veille.',
            'À croiser avec les sources du panneau Ressources (site officiel, help center).'
          ]
        }
      ]
    },
    {
      id: 'hg-m2',
      title: '2 · Éditeur, publics cibles et communauté (QUI ?)',
      lessons: [
        {
          id: 'hg-l2',
          title: '2 · Éditeur, publics cibles et communauté (QUI ?)',
          hero: '../../assets/img/HeygenIMG.jpg',
          lead: 'HeyGen est édité par la société **HeyGen** (startup américaine spécialisée dans la **vidéo par IA**). Sur la page officielle « About », le fondateur cité est **Joshua Xu** ; l’entreprise dispose de bureaux notamment à **Los Angeles**, **San Francisco**, **Palo Alto** et **Toronto**, et annonce des financements auprès de fonds reconnus (Benchmark, Conviction, Thrive Capital, Bond, selon leur communication).',
          body: [
            'Autour du produit : équipes HeyGen (développement et sécurité des contenus), clients entreprises et créateurs, monde éducatif, et utilisateurs qui partagent retours — la **marque et la roadmap** restent pilotées par **HeyGen** en tant qu’éditeur.',
            'Pour la veille : comparer toujours avec les **annonces sur heygen.com** et la presse spécialisée lors des levées de fonds ou des évolutions produit.'
          ],
          bullets: [
            'Éditeur : société **HeyGen** · fondateur documenté : **Joshua Xu**.',
            'Siège / présence US et Canada ; suivre le blog et la page About officiels.',
            'Relier à votre cas d’usage : communication, formation, projet web.'
          ]
        }
      ]
    },
    {
      id: 'hg-m3',
      title: '3 · Contexte récent et évolution du produit (QUAND ?)',
      lessons: [
        {
          id: 'hg-l3',
          title: '3 · Contexte récent et évolution du produit (QUAND ?)',
          hero: '../../assets/img/HeygenIMG.jpg',
          lead: 'HeyGen s’inscrit dans la période récente de forte progression des IA génératives, avec un essor marqué depuis 2022. La plateforme a évolué rapidement : avatars plus réalistes, voix synthétique plus naturelle, traduction vidéo automatisée.',
          body: [
            'Cette évolution rapide montre que HeyGen est un outil actif et toujours en développement — un point essentiel dans l’IA, où les solutions doivent être régulièrement améliorées pour rester compétitives.',
            'Pour une veille technologique, il faut donc surveiller les mises à jour, les nouvelles fonctionnalités et les usages qui émergent autour de l’outil.'
          ],
          bullets: [
            'Temporalité : contexte post-2022, rythme de release élevé.',
            'Méthode : blog produit, changelog, reverification avant oral.',
            'Ne pas figer une démo sans date de référence.'
          ]
        }
      ]
    },
    {
      id: 'hg-m4',
      title: '4 · Fonctionnement technique, tarifs et API (COMMENT ?)',
      lessons: [
        {
          id: 'hg-l4',
          title: '4 · Fonctionnement technique, tarifs et API (COMMENT ?)',
          hero: '../../assets/img/HeygenIMG.jpg',
          lead: 'HeyGen fonctionne en combinant plusieurs briques d’IA : l’utilisateur saisit un texte, choisit un avatar, une voix et un format ; la plateforme génère un contenu visuel et sonore cohérent.',
          body: [
            'Le principe repose notamment sur la synthèse vocale, la génération d’avatars animés, le traitement automatique du langage, ainsi que la traduction et le doublage pour adapter la vidéo à plusieurs langues.',
            'Pour mener une veille, on peut croiser le site officiel, des démonstrations (ex. YouTube), les réseaux sociaux pour les retours d’usage, les articles spécialisés en IA, et des alertes (ex. alertes Google) pour les actualités sur le sujet.',
            'Cette approche permet de suivre à la fois l’évolution technique de l’outil et son usage réel dans différents contextes. Les tarifs indicatifs et un exemple d’appel à l’API Video Agent sont donnés ci-dessous — à confirmer sur heygen.com avant toute décision.'
          ],
          bullets: [
            'Chaîne de valeur : texte → avatar → voix → export / diffusion.',
            'Veille : sources multiples (officiel, communauté, presse spécialisée).',
            'Intégration possible via API pour les projets techniques (voir encarts).'
          ],
          appendHtml: `
<div class="veille-lesson-rich">
  <p class="veille-code-hint mb-1">Tarifs indicatifs (à confirmer sur heygen.com)</p>
  <div class="veille-heygen-table-wrap"><table class="veille-heygen-table"><thead><tr><th>Offre</th><th>Prix indicatif</th><th>Usage</th><th>Remarques</th></tr></thead><tbody>
    <tr><td>Free</td><td>0 $</td><td>Test</td><td>Limites fortes</td></tr>
    <tr><td>Creator</td><td>≈ 29 $/mois</td><td>Solo</td><td>Selon période</td></tr>
    <tr><td>Pro</td><td>≈ 99 $/mois</td><td>Intensif</td><td>Options avancées</td></tr>
    <tr><td>Business</td><td>≈ 149 $+</td><td>Équipes</td><td>Collab., gouvernance</td></tr>
    <tr><td>Enterprise</td><td>Sur devis</td><td>Grand compte</td><td>Support, contrats</td></tr>
  </tbody></table></div>
  <p class="veille-code-hint mt-4 mb-1">Video Agent API — exemples (clé fictive)</p>
  <pre class="veille-heygen-pre"><code>curl -X POST "https://api.heygen.com/v1/video_agent/generate" \\
  -H "X-API-KEY: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt":"Une vidéo de 30 secondes qui présente mon projet"}'</code></pre>
  <pre class="veille-heygen-pre"><code>import requests

api_key = "YOUR_API_KEY"
url = "https://api.heygen.com/v1/video_agent/generate"
headers = {"X-API-KEY": api_key, "Content-Type": "application/json"}
payload = {"prompt": "Vidéo de présentation professionnelle"}
r = requests.post(url, headers=headers, json=payload)
print(r.json())</code></pre>
  <p class="small text-muted mt-2">Ne jamais committer de clé réelle ; stocker les secrets hors dépôt (variables d’environnement, gestionnaire de secrets).</p>
</div>`
        }
      ]
    },
    {
      id: 'hg-m5',
      title: '5 · Intérêt métier et usage responsable (POURQUOI ?)',
      lessons: [
        {
          id: 'hg-l5',
          title: '5 · Intérêt métier et usage responsable (POURQUOI ?)',
          hero: '../../assets/img/HeygenIMG.jpg',
          lead: 'L’intérêt principal de HeyGen est de simplifier et d’accélérer la création vidéo : là où une production classique demande tournage, montage et parfois plusieurs intervenants, l’IA permet de partir d’un simple script.',
          body: [
            'Les enjeux incluent le gain de temps, la réduction des coûts techniques, l’accessibilité pour les débutants, la communication multilingue, et la possibilité de produire des contenus plus régulièrement.',
            'Pour un étudiant en BTS SIO, HeyGen illustre un usage professionnel concret de l’IA et aide à développer une culture numérique actuelle, y compris dans des projets web, de communication ou de formation.',
            'La veille invite aussi à garder un esprit critique sur la qualité des contenus, la vérification et l’éthique.'
          ],
          bullets: [
            'Productivité et démocratisation de la vidéo.',
            'Liens avec compétences métiers et projets du diplôme.',
            'Responsabilité : vérifier avant diffusion publique.',
            'Deepfakes & impersonation : avec des avatars hyperréalistes et la traduction labiale, le risque de contenus trompeurs augmente (arnaque au président, fausses interviews, harcèlement par mimicry). Cadres : signature de contenu (C2PA), mentions légales, modération plateforme, sensibilisation utilisateurs.',
            'Concurrence & « effet HeyGen » : plusieurs éditeurs proposent avatar + TTS + pipeline vidéo orienté entreprise — à citer en veille pour situer le marché.'
          ],
          appendHtml: `
<div class="veille-lesson-rich mt-2">
  <h3 class="h6 text-white mb-2">Risques liés aux deepfakes et à la confiance</h3>
  <ul class="veille-objectives-list mb-4">
    <li><strong>Usurpation</strong> — faire dire ou faire faire à un avatar des propos jamais tenus par la personne réelle.</li>
    <li><strong>Fraude</strong> — faux messages vidéo « internes » pour obtenir des virements ou des identifiants.</li>
    <li><strong>Désinformation</strong> — campagnes massives à faible coût de production.</li>
    <li><strong>Réponses possibles</strong> — filigranes / provenance (ex. initiatives type <a href="https://c2pa.org/" target="_blank" rel="noopener noreferrer">C2PA</a>), politiques éditoriales HeyGen, traçabilité API, sensibilisation des équipes communication.</li>
  </ul>
  <h3 class="h6 text-white mb-2">Acteurs proches sur le créneau « vidéo IA / avatar » (exemples concrets)</h3>
  <p class="small text-muted mb-2">Marché en rapprochement fonctionnel ; tarifs et offres à recouper sur les sites officiels au moment de la soutenance.</p>
  <div class="veille-heygen-table-wrap mb-0"><table class="veille-heygen-table"><thead><tr><th>Solution</th><th>Positionnement court</th></tr></thead><tbody>
    <tr><td><strong>Synthesia</strong></td><td>Avatar vidéo B2B, forte présence formation &amp; corporate.</td></tr>
    <tr><td><strong>D-ID</strong></td><td>Talking heads / Creative Reality Studio, API orientée « face animée ».</td></tr>
    <tr><td><strong>Colossyan</strong></td><td>Vidéos pédagogiques avec avatars et scénarios prêts à l’emploi.</td></tr>
    <tr><td><strong>Arcads</strong></td><td>Génération vidéo marketing / UGC synthétique (positionnement ads).</td></tr>
    <tr><td><strong>Runway</strong></td><td>Génération et montage vidéo par IA (Gen série), angle créatif plutôt que seulement avatar parlant.</td></tr>
  </tbody></table></div>
</div>`
        }
      ]
    },
    {
      id: 'hg-m6',
      title: '6 · Problématique',
      lessons: [
        {
          id: 'hg-l6',
          title: '6 · Problématique',
          hero: '../../assets/img/HeygenIMG.jpg',
          lead: 'Comment HeyGen modifie-t-il la création de vidéos grâce à l’intelligence artificielle, et quels sont les avantages de cet outil pour un usage scolaire, professionnel ou numérique ?',
          body: [
            'Cette problématique relie la dimension technique (automatisation du pipeline vidéo), l’impact sur les usages et l’intérêt concret pour différents publics.',
            'Elle permet de structurer le dossier et l’oral autour de promesses produit, limites et bonnes pratiques.'
          ],
          bullets: [
            'Innovation vidéo vs chaîne de production classique.',
            'Publics : école, entreprise, création numérique.',
            'Critère de réussite : argumenter avec exemples sourcés.'
          ]
        }
      ]
    },
    {
      id: 'hg-m7',
      title: '7 · Réponse à la problématique',
      lessons: [
        {
          id: 'hg-l7',
          title: '7 · Réponse à la problématique',
          hero: '../../assets/img/HeygenIMG.jpg',
          lead: 'HeyGen modifie la création vidéo en automatisant une grande partie du processus : au lieu de filmer, monter et synchroniser manuellement, on peut rédiger un texte et laisser l’outil générer le contenu.',
          body: [
            'La production devient plus rapide et l’accès à la vidéo plus simple, même sans maîtriser la prise de vue ou le montage avancé.',
            'En contexte professionnel, l’outil peut servir pour des vidéos explicatives, des messages internes, des formations ou du marketing sans lourds moyens ; en contexte scolaire, pour dynamiser une présentation ou un support de révision.',
            'Ce n’est pas une solution « parfaite » : la qualité dépend du texte, du choix voix/avatar et du contexte — il reste indispensable de relire, vérifier et adapter avant diffusion.',
            'Pour un profil informatique, la technologie montre comment l’IA s’intègre dans des usages concrets et comment les outils évoluent vers plus d’automatisation, de personnalisation et d’accessibilité.'
          ],
          bullets: [
            'Automatisation ≠ absence de contrôle humain.',
            'Usage métier documenté par cas ou démo courte.',
            'Limites assumées dans la synthèse.'
          ]
        }
      ]
    },
    {
      id: 'hg-m8',
      title: '8 · Conclusion',
      lessons: [
        {
          id: 'hg-l8',
          title: '8 · Conclusion',
          hero: '../../assets/img/HeygenIMG.jpg',
          lead: 'HeyGen est représentatif de l’évolution actuelle de l’IA dans la vidéo : produire plus vite, avec moins de contraintes techniques, tout en restant vigilant sur la qualité et l’usage responsable.',
          body: [
            'Pour un étudiant en BTS SIO, cette veille met en lumière un outil innovant, concret et exploitable dans des projets de communication ou de formation.',
            'À l’avenir, ce type de solution devrait encore progresser (avatars, voix, fonctionnalités). Les sources suivantes — conservées dans la page sous l’onglet Ressources — restent les références pour prolonger la veille : heygen.com, Help Center, blog produit, politique de modération, conformité AI Act (UE), customer stories et littérature scientifique type arXiv cs.CV.'
          ],
          bullets: [
            'Synthèse : IA vidéo accessible mais à encadrer.',
            'Poursuite : suivre releases et cadre légal (RGPD, AI Act).',
            'Ressources : panneau latéral « Ressources » sur cette page pour les liens officiels.'
          ]
        }
      ]
    }
  ]
};
