/**
 * Veille OpenClaw — structure portfolio (9 parties)
 * appendHtml : blocs techniques (installation) dans la partie « COMMENT ? »
 */
window.VEILLE_DATA = {
  modules: [
    {
      id: 'oc-m1',
      title: '1 · Présentation rapide de la veille',
      lessons: [
        {
          id: 'oc-l1',
          title: '1 · Présentation rapide de la veille',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'OpenClaw est un projet d’intelligence artificielle open source qui permet de créer un assistant personnel sur ses propres appareils. L’intérêt principal est qu’il ne se limite pas à consommer une IA toute faite : on peut construire, personnaliser et améliorer son propre assistant selon ses besoins.',
          body: [
            'Cette veille technologique porte sur un outil moderne, évolutif et adapté à un profil informatique : il relie IA, automatisation, personnalisation et culture open source.',
            'Le fil directeur est clair : partir d’un projet public, comprendre son architecture, puis en déduire ce qu’il apporte comme assistant — et comment on peut l’étendre (outils, skills, intégrations).'
          ],
          bullets: [
            'Assistant personnel — pas seulement un chat générique.',
            'Approche technique + communautaire (GitHub, contributions).',
            'Alignée avec une présentation type oral / portfolio BTS SIO.'
          ]
        }
      ]
    },
    {
      id: 'oc-m2',
      title: '2 · QUI ?',
      lessons: [
        {
          id: 'oc-l2',
          title: '2 · QUI ?',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'OpenClaw est développé par une communauté open source active, avec un dépôt GitHub suivi et régulièrement mis à jour. Des contributeurs font évoluer le code, corrigent les bugs et ajoutent des fonctionnalités.',
          body: [
            'Les utilisateurs ont aussi un rôle central : tester, signaler des problèmes, proposer des améliorations ou développer des modules. Ce fonctionnement collaboratif fait évoluer le projet au-delà d’une feuille de route fermée.',
            'Pour cette veille, les sources principales ont été la documentation officielle (installation et usages), le dépôt GitHub pour suivre les évolutions, ainsi que des démonstrations et tutoriels pour comprendre la mise en œuvre concrète.'
          ],
          bullets: [
            'Communauté open source et contributions externes.',
            'Utilisateurs impliqués dans la qualité et la roadmap.',
            'Méthode : doc officielle + dépôt + médias de démonstration.'
          ]
        }
      ]
    },
    {
      id: 'oc-m3',
      title: '3 · QUAND ?',
      lessons: [
        {
          id: 'oc-l3',
          title: '3 · QUAND ?',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'OpenClaw est un projet récent et en évolution rapide : le dépôt montre une activité soutenue, avec des commits récents — ce qui indique une maintenance active.',
          body: [
            'La documentation d’installation est mise à jour régulièrement ; une actualisation fréquente est indispensable dans le domaine de l’IA, où une solution peut vite être dépassée sans maintenance.',
            'Pour une veille sérieuse : toujours noter la date de consultation et rejouer les commandes avant une soutenance.'
          ],
          bullets: [
            'Projet vivant — suivre releases et changelog.',
            'Doc officielle synchronisée avec les versions courantes.',
            'Temporalité explicitée dans la synthèse (trimestre / année).'
          ]
        }
      ]
    },
    {
      id: 'oc-m4',
      title: '4 · COMMENT ?',
      lessons: [
        {
          id: 'oc-l4',
          title: '4 · COMMENT ?',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'OpenClaw fonctionne comme un assistant IA personnel installable sur une machine ou un serveur. L’architecture est modulaire : une partie centrale gère sessions, outils, canaux et actions ; des composants ajoutent chat, voix, canvas ou gestion de tâches.',
          body: [
            'Un point fort est la capacité à créer son propre assistant : choix ou paramétrage du modèle de langage, ajout de compétences (« skills »), branchement d’outils et adaptation du comportement à un usage personnel ou professionnel.',
            'Le projet permet aussi une amélioration continue via configuration et extensions — automatismes, scripts, interactions avec d’autres services — ce qui correspond à une logique d’évolution dans le temps.',
            'Pour construire cette analyse, plusieurs sources ont été croisées : GitHub pour le code et les évolutions, la documentation pour les procédures, ainsi que des vidéos et articles pour illustrer les parcours d’installation.'
          ],
          bullets: [
            'Architecture modulaire — assistant montable et extensible.',
            'Skills et configuration pour faire grandir l’outil avec l’usage.',
            'Veille multi-sources : doc, dépôt, tutoriels vidéo.'
          ],
          appendHtml: `
<div class="veille-lesson-rich">
  <h3 class="h6 text-white mb-2 mt-3">Installation d’OpenClaw</h3>
  <p class="mb-3">La documentation recommande Node 24, ou au minimum Node 22.14+, sur macOS, Linux, Windows ou WSL2.</p>
  <p class="veille-code-hint mb-1">Méthode recommandée (script officiel)</p>
  <pre class="veille-heygen-pre"><code>curl -fsSL https://openclaw.ai/install.sh | bash</code></pre>
  <p class="small text-muted mb-2">Ce script détecte le système, installe les dépendances, installe OpenClaw puis lance l’onboarding.</p>
  <p class="veille-code-hint mb-1">Autre méthode avec npm</p>
  <pre class="veille-heygen-pre"><code>npm install -g openclaw@latest
openclaw onboard --install-daemon</code></pre>
  <p class="small text-muted mb-2">Adaptée lorsque Node.js est déjà présent sur la machine.</p>
  <p class="veille-code-hint mb-1">Installation depuis les sources</p>
  <pre class="veille-heygen-pre"><code>git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm build && pnpm ui:build
pnpm link --global
openclaw onboard --install-daemon</code></pre>
  <p class="small text-muted mb-3">Utile pour contribuer ou personnaliser en profondeur.</p>
  <p class="veille-code-hint mb-1">Vérifications après installation</p>
  <pre class="veille-heygen-pre"><code>openclaw --version
openclaw doctor
openclaw gateway status</code></pre>
</div>`
        }
      ]
    },
    {
      id: 'oc-m5',
      title: '5 · POURQUOI ?',
      lessons: [
        {
          id: 'oc-l5',
          title: '5 · POURQUOI ?',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'OpenClaw est intéressant parce qu’il rend l’IA à la fois plus accessible et plus personnalisable : on n’est pas réduit à une solution fermée unique ; on peut façonner un assistant aligné avec ses usages puis le faire évoluer.',
          body: [
            'L’enjeu principal est la personnalisation : partir d’un socle générique pour concevoir un outil plus spécialisé et mieux intégré à son environnement — automatisation, développement, gestion de tâches, communication ou organisation.',
            'Pour un étudiant en BTS SIO, la démarche fait travailler installation d’environnement, lecture de projet open source, usage d’outils modernes et réflexion sur l’intégration responsable de l’IA.',
            'La veille montre aussi le passage possible d’un « utilisateur » d’IA vers un acteur qui configure, adapte et améliore un assistant — une posture proche du développement et de la maintenance logicielle.'
          ],
          bullets: [
            'Personnalisation vs dépendance à un SaaS opaque.',
            'Usages variés — productivity, dev, communication.',
            'Compétences BTS : technique + méthode + analyse critique.'
          ]
        }
      ]
    },
    {
      id: 'oc-m6',
      title: '6 · Problématique',
      lessons: [
        {
          id: 'oc-l6',
          title: '6 · Problématique',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Comment OpenClaw permet-il de créer un assistant IA personnel, de le personnaliser et de l’améliorer progressivement grâce à une approche open source ?',
          body: [
            'La question relie directement la promesse du projet à une mise en œuvre concrète : ce n’est pas seulement « utiliser » une IA toute faite, mais comprendre comment la construire et la faire vivre dans la durée.',
            'Elle servira de fil pour structurer la synthèse et l’oral : socle technique, modularité, communauté, puis perspectives.'
          ],
          bullets: [
            'Création vs simple consommation d’un service.',
            'Personnalisation et évolution dans le temps.',
            'Cadre open source comme levier d’apprentissage.'
          ]
        }
      ]
    },
    {
      id: 'oc-m7',
      title: '7 · Réponse à la problématique',
      lessons: [
        {
          id: 'oc-l7',
          title: '7 · Réponse à la problématique',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'OpenClaw permet de créer un assistant personnel parce qu’il fournit une base technique ouverte, configurable avec un modèle de langage et adaptable au comportement souhaité — ce qui le rend plus flexible qu’une solution figée.',
          body: [
            'La modularité est un avantage décisif : l’assistant peut recevoir de nouveaux outils, skills et intégrations ; on peut commencer simple puis enrichir selon les besoins réels.',
            'Cette évolution montre que l’IA open source peut être traitée comme un projet vivant — avec tests, adaptation, maintenance et amélioration continue, compétences attendues en informatique.',
            'La communauté accélère cette progression par les contributions et les retours d’expérience ; c’est aussi une illustration du travail collaboratif dans le développement logiciel.',
            'Globalement, OpenClaw illustre une tendance vers des assistants plus personnels et maîtrisables — une analyse valorisante dans un portfolio car elle combine compréhension technique et veille active.'
          ],
          bullets: [
            'Socle ouvert + configuration du comportement.',
            'Roadmap personnelle via modules et extensions.',
            'Alignement avec une posture professionnelle (qualité, sécurité, évolution).'
          ]
        }
      ]
    },
    {
      id: 'oc-m8',
      title: '8 · Skills personnalisés et spécialisation',
      lessons: [
        {
          id: 'oc-l8',
          title: '8 · Skills personnalisés et spécialisation',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'Dans OpenClaw, les skills personnalisés servent à spécialiser l’assistant IA selon ce que l’on veut qu’il fasse : on peut lui ajouter des compétences concrètes pour qu’il soit plus utile et mieux adapté à un usage personnel ou à un projet professionnel.',
          body: [
            'Un skill encapsule une fonction : résumé de messages, lien avec GitHub, veille techno, recherche web ciblée, etc. L’assistant cesse d’être uniquement généraliste pour devenir orienté productivité et automatisation.',
            'Pour un portfolio BTS SIO, cette couche montre bien qu’une IA peut être configurée comme un véritable outil métier — pas seulement comme une conversation.'
          ],
          bullets: [
            'Skills = fonctions ajoutées pour des tâches précises.',
            'Passage d’un assistant générique à un assistant spécialisé.',
            'Voir aussi la documentation officielle sur la création et la configuration des skills.'
          ],
          appendHtml: `
<div class="veille-lesson-rich">
  <h3 class="h6 text-white mb-3">Exemples de skills personnalisés</h3>
  <p class="small text-muted mb-3">Illustrations possibles à adapter à votre contexte ; à croiser avec la documentation officielle.</p>
  <ol class="ps-3 mb-4" style="font-size: 0.92rem;">
    <li class="mb-3"><strong>Résumé d’e-mails</strong> — analyser une boîte mail et produire un résumé quotidien des messages importants pour gagner du temps.</li>
    <li class="mb-3"><strong>Gestion de tâches</strong> — transformer des messages en tâches, classer les priorités et envoyer des rappels (projet web, équipe, travail scolaire).</li>
    <li class="mb-3"><strong>GitHub</strong> — lister des dépôts, créer une issue, suivre les commits ou l’état d’un projet ; lien direct avec les pratiques de développement.</li>
    <li class="mb-3"><strong>Veille technologique</strong> — surveiller des mots-clés et produire un résumé sur une techno donnée.</li>
    <li class="mb-3"><strong>Recherche web ciblée</strong> — rechercher sur un sujet précis et trier les résultats les plus pertinents.</li>
    <li class="mb-3"><strong>Génération de contenu</strong> — rédiger, reformuler, corriger ou produire un plan pour présentations et portfolio.</li>
    <li class="mb-3"><strong>Support technique</strong> — guider un diagnostic, proposer des étapes de résolution ou une procédure d’installation.</li>
    <li class="mb-3"><strong>Sécurité</strong> — rappeler de bonnes pratiques ou aider à repérer des risques simples sur une configuration.</li>
  </ol>
  <h4 class="h6 text-white mb-2">Idées adaptées au BTS SIO</h4>
  <ul class="veille-objectives-list mb-4">
    <li>Skill pour résumer automatiquement des cours ou supports.</li>
    <li>Skill pour organiser les tâches d’un projet web.</li>
    <li>Skill pour suivre les commits ou l’activité GitHub.</li>
    <li>Skill pour automatiser une veille technologique.</li>
    <li>Skill pour rédiger ou reformuler un compte rendu.</li>
  </ul>
  <p class="veille-code-hint mb-2">Formulation pour l’oral</p>
  <blockquote class="border-start ps-3 mb-0" style="border-left: 3px solid rgba(0,180,255,0.55); font-size: 0.92rem;">
    « Avec OpenClaw, on peut créer des skills personnalisés, c’est-à-dire des fonctions ajoutées à l’assistant pour qu’il fasse des tâches précises. Par exemple, il peut résumer des e-mails, suivre un projet GitHub, faire une veille technologique ou aider à organiser des tâches. Cela permet de transformer une IA généraliste en assistant spécialisé, ce qui est très intéressant en informatique. »
  </blockquote>
  <p class="small text-muted mt-3 mb-0">Pour aller plus loin : docs.openclaw.ai (création et configuration des skills) · github.com/openclaw/openclaw · tutoriels et articles de votre recherche documentaire.</p>
</div>`
        }
      ]
    },
    {
      id: 'oc-m9',
      title: '9 · Conclusion',
      lessons: [
        {
          id: 'oc-l9',
          title: '9 · Conclusion',
          hero: '../../assets/img/offline-gallery-placeholder.svg',
          lead: 'OpenClaw dépasse l’usage passif d’une IA : il permet de créer son assistant, de le personnaliser et de l’améliorer dans la durée. Le projet reste actif, documenté et pensé pour évoluer avec ses utilisateurs.',
          body: [
            'Pour un profil BTS SIO, cette veille relie intelligence artificielle, installation technique, culture open source et personnalisation d’outils — des compétences directement transférables.',
            'À l’avenir, ce type de solution peut prendre encore plus de place là où les organisations cherchent des assistants adaptables, auditables et intégrés à leur SI.'
          ],
          bullets: [
            'Synthèse : projet pertinent pour création et évolution d’un assistant IA.',
            'Perspectives : poursuite de veille sur releases et réglementation.',
            'Sources principales : docs.openclaw.ai/install · github.com/openclaw/openclaw · tutoriels et démos cités dans la recherche documentaire.'
          ]
        }
      ]
    }
  ]
};
