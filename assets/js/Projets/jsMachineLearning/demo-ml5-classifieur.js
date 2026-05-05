/**
 * Image Classifier — MachineLearningPF
 * Application professionnelle de classification d'images avec ML5.js & MobileNet
 * @author Expert ML
 */

(function () {
    'use strict';

    // État de l'application
    const state = {
        model: null,
        modelReady: false,
        imageLoaded: false,
        currentSource: null, // 'file' | 'webcam' | 'sample'
        webcamStream: null,
    };

    // Éléments DOM
    const DOM = {
        dropZone: document.getElementById('dropZone'),
        fileInput: document.getElementById('fileInput'),
        btnUpload: document.getElementById('btnUpload'),
        btnWebcam: document.getElementById('btnWebcam'),
        btnReset: document.getElementById('btnReset'),
        imagePreview: document.getElementById('imagePreview'),
        previewContainer: document.getElementById('previewContainer'),
        statusMessage: document.getElementById('statusMessage'),
        statsRow: document.getElementById('statsRow'),
        resultsContainer: document.getElementById('resultsContainer'),
        resultsList: document.getElementById('resultsList'),
        inferenceTime: document.getElementById('inferenceTime'),
        samplesGrid: document.getElementById('samplesGrid'),
        webcamModal: document.getElementById('webcamModal'),
        webcamVideo: document.getElementById('webcamVideo'),
        btnCapture: document.getElementById('btnCapture'),
        btnCloseWebcam: document.getElementById('btnCloseWebcam'),
    };

    // Dictionnaire de traduction EN -> FR (libellés MobileNet / ImageNet)
    const TRADUCTIONS = {
        'banana': 'banane', 'bananas': 'bananes',
        'orange': 'orange', 'oranges': 'oranges',
        'strawberry': 'fraise', 'strawberries': 'fraises',
        'lemon': 'citron', 'lemons': 'citrons',
        'apple': 'pomme', 'apples': 'pommes',
        'grape': 'raisin', 'grapes': 'raisins',
        'peach': 'pêche', 'peaches': 'pêches',
        'apricot': 'abricot', 'apricots': 'abricots',
        'raspberry': 'framboise', 'raspberries': 'framboises',
        'cherry': 'cerise', 'cherries': 'cerises',
        'watermelon': 'pastèque', 'watermelons': 'pastèques',
        'pineapple': 'ananas', 'pineapples': 'ananas',
        'coconut': 'noix de coco', 'coconuts': 'noix de coco',
        'avocado': 'avocat', 'avocados': 'avocats',
        'tomato': 'tomate', 'tomatoes': 'tomates',
        'carrot': 'carotte', 'carrots': 'carottes',
        'broccoli': 'brocoli', 'cauliflower': 'chou-fleur',
        'potato': 'pomme de terre', 'potatoes': 'pommes de terre',
        'lion': 'lion', 'lions': 'lions',
        'tiger': 'tigre', 'tigers': 'tigres',
        'horse': 'cheval', 'horses': 'chevaux',
        'elephant': 'éléphant', 'elephants': 'éléphants',
        'zebra': 'zèbre', 'zebras': 'zèbres',
        'giraffe': 'girafe', 'giraffes': 'girafes',
        'bear': 'ours', 'bears': 'ours',
        'wolf': 'loup', 'wolves': 'loups',
        'fox': 'renard', 'foxes': 'renards',
        'dog': 'chien', 'dogs': 'chiens',
        'cat': 'chat', 'cats': 'chats',
        'tabby': 'chat tigré', 'tabby cat': 'chat tigré',
        'golden retriever': 'retriever doré', 'labrador': 'labrador',
        'poodle': 'caniche', 'poodles': 'caniches',
        'dalmatian': 'dalmatien', 'chihuahua': 'chihuahua',
        'flamingo': 'flamant', 'flamingos': 'flamants',
        'peacock': 'paon', 'peacocks': 'paons',
        'parrot': 'perroquet', 'parrots': 'perroquets',
        'eagle': 'aigle', 'eagles': 'aigles',
        'owl': 'hibou', 'owls': 'hiboux',
        'hedgehog': 'hérisson', 'hedgehogs': 'hérissons',
        'squirrel': 'écureuil', 'squirrels': 'écureuils',
        'rabbit': 'lapin', 'rabbits': 'lapins',
        'hamster': 'hamster', 'hamsters': 'hamsters',
        'lemur': 'lémurien', 'lemurs': 'lémuriens',
        'gorilla': 'gorille', 'gorillas': 'gorilles',
        'chimpanzee': 'chimpanzé', 'chimpanzees': 'chimpanzés',
        'monkey': 'singe', 'monkeys': 'singes',
        'hippopotamus': 'hippopotame', 'hippopotamuses': 'hippopotames',
        'kangaroo': 'kangourou', 'kangaroos': 'kangourous',
        'rhinoceros': 'rhinocéros', 'rhino': 'rhinocéros',
        'camel': 'chameau', 'camels': 'chameaux',
        'cow': 'vache', 'cows': 'vaches',
        'pig': 'cochon', 'pigs': 'cochons',
        'sheep': 'mouton', 'sheeps': 'moutons',
        'goat': 'chèvre', 'goats': 'chèvres',
        'duck': 'canard', 'ducks': 'canards',
        'penguin': 'pingouin', 'penguins': 'pingouins',
        'frog': 'grenouille', 'frogs': 'grenouilles',
        'turtle': 'tortue', 'turtles': 'tortues',
        'crocodile': 'crocodile', 'crocodiles': 'crocodiles',
        'snake': 'serpent', 'snakes': 'serpents',
        'lizard': 'lézard', 'lizards': 'lézards',
        'fish': 'poisson', 'fishes': 'poissons',
        'shark': 'requin', 'sharks': 'requins',
        'dolphin': 'dauphin', 'dolphins': 'dauphins',
        'whale': 'baleine', 'whales': 'baleines',
        'octopus': 'poulpe', 'octopuses': 'poulpes',
        'jellyfish': 'méduse', 'jellyfishes': 'méduses',
        'crab': 'crabe', 'crabs': 'crabes',
        'lobster': 'homard', 'lobsters': 'homards',
        'ant': 'fourmi', 'ants': 'fourmis',
        'bee': 'abeille', 'bees': 'abeilles',
        'butterfly': 'papillon', 'butterflies': 'papillons',
        'spider': 'araignée', 'spiders': 'araignées',
        'scorpion': 'scorpion', 'scorpions': 'scorpions',
        'cockroach': 'cafard', 'cockroaches': 'cafards',
        'car': 'voiture', 'cars': 'voitures',
        'automobile': 'automobile', 'automobiles': 'automobiles',
        'truck': 'camion', 'trucks': 'camions',
        'bus': 'bus', 'buses': 'bus',
        'minibus': 'minibus', 'minibuses': 'minibus',
        'bicycle': 'vélo', 'bicycles': 'vélos',
        'motorcycle': 'moto', 'motorcycles': 'motos',
        'airplane': 'avion', 'airplanes': 'avions',
        'boat': 'bateau', 'boats': 'bateaux',
        'train': 'train', 'trains': 'trains',
        'teddy': 'peluche', 'teddy bear': 'ours en peluche',
        'book': 'livre', 'books': 'livres',
        'clock': 'horloge', 'clocks': 'horloges',
        'bottle': 'bouteille', 'bottles': 'bouteilles',
        'cup': 'tasse', 'cups': 'tasses',
        'chair': 'chaise', 'chairs': 'chaises',
        'couch': 'canapé', 'couches': 'canapés',
        'bed': 'lit', 'beds': 'lits',
        'table': 'table', 'tables': 'tables',
        'keyboard': 'clavier', 'keyboards': 'claviers',
        'computer': 'ordinateur', 'computers': 'ordinateurs',
        'monitor': 'écran', 'monitors': 'écrans',
        'mouse': 'souris', 'mice': 'souris',
        'telephone': 'téléphone', 'telephones': 'téléphones',
        'television': 'télévision', 'televisions': 'télévisions',
        'refrigerator': 'réfrigérateur', 'refrigerators': 'réfrigérateurs',
        'oven': 'four', 'ovens': 'fours',
        'microwave': 'micro-ondes', 'microwaves': 'micro-ondes',
        'toaster': 'grille-pain', 'toasters': 'grille-pain',
        'sink': 'évier', 'sinks': 'éviers',
        'toilet': 'toilettes', 'toilets': 'toilettes',
        'bathtub': 'baignoire', 'bathtubs': 'baignoires',
        'umbrella': 'parapluie', 'umbrellas': 'parapluies',
        'backpack': 'sac à dos', 'backpacks': 'sacs à dos',
        'handbag': 'sac à main', 'handbags': 'sacs à main',
        'tie': 'cravate', 'ties': 'cravates',
        'suit': 'costume', 'suits': 'costumes',
        'gown': 'robe', 'gowns': 'robes',
        'sneaker': 'basket', 'sneakers': 'baskets',
        'hat': 'chapeau', 'hats': 'chapeaux',
        'helmet': 'casque', 'helmets': 'casques',
        'guitar': 'guitare', 'guitars': 'guitares',
        'piano': 'piano', 'pianos': 'pianos',
        'drum': 'tambour', 'drums': 'tambours',
        'camera': 'appareil photo', 'cameras': 'appareils photo',
        'cell phone': 'téléphone portable', 'mobile phone': 'téléphone portable',
        'laptop': 'ordinateur portable', 'laptops': 'ordinateurs portables',
        'remote': 'télécommande', 'remotes': 'télécommandes',
        'remote control': 'télécommande',
        'sports car': 'voiture de sport', 'convertible': 'cabriolet',
        'fire engine': 'camion de pompiers', 'fire truck': 'camion de pompiers',
        'ambulance': 'ambulance', 'ambulances': 'ambulances',
        'school bus': 'bus scolaire', 'school buses': 'bus scolaires',
        'pickup truck': 'pick-up', 'pickup': 'pick-up',
        'suv': 'véhicule tout-terrain', 'suvs': 'véhicules tout-terrain',
        'minivan': 'monospace', 'minivans': 'monospaces',
        'limousine': 'limousine', 'limousines': 'limousines',
        'taxi': 'taxi', 'taxis': 'taxis',
        'bulbul': 'bulbul', 'hummingbird': 'colibri',
        'magpie': 'pie', 'magpies': 'pies',
        'ostrich': 'autruche', 'ostriches': 'autruches',
        'crane': 'grue', 'cranes': 'grues',
        'brambling': 'pinson', 'chickadee': 'mésange',
        'jelly bean': 'bonbon', 'doughnut': 'beignet',
        'bagel': 'bagel', 'bagels': 'bagels',
        'pretzel': 'bretzel', 'pretzels': 'bretzels',
        'cheeseburger': 'cheeseburger', 'cheeseburgers': 'cheeseburgers',
        'hotdog': 'hot-dog', 'hotdogs': 'hot-dogs',
        'pizza': 'pizza', 'pizzas': 'pizzas',
        'burrito': 'burrito', 'burritos': 'burritos',
        'espresso': 'expresso', 'coffee': 'café',
        'wine bottle': 'bouteille de vin', 'beer bottle': 'bouteille de bière',
        // Animaux & oiseaux ImageNet
        'tench': 'tanche', 'goldfish': 'poisson rouge', 'great white shark': 'grand requin blanc',
        'tiger shark': 'requin tigre', 'hammerhead': 'requin-marteau', 'stingray': 'raie',
        'cock': 'coq', 'hen': 'poule', 'robin': 'rouge-gorge', 'jay': 'geai',
        'water ouzel': 'cinclus', 'kite': 'milan', 'bald eagle': 'aigle à tête blanche',
        'vulture': 'vautour', 'European fire salamander': 'salamandre tachetée',
        'bullfrog': 'grenouille taureau', 'tree frog': 'rainette',
        'loggerhead': 'tortue caouanne', 'leatherback turtle': 'tortue luth',
        'box turtle': 'tortue-boîte', 'common iguana': 'iguane commun',
        'frilled lizard': 'lézard à collerette', 'African crocodile': 'crocodile africain',
        'American alligator': 'alligator américain', 'boa constrictor': 'boa constricteur',
        'rock python': 'python des roches', 'Indian cobra': 'cobra indien',
        'harvestman': 'faucheux', 'black widow': 'veuve noire', 'tarantula': 'tarentule',
        'centipede': 'mille-pattes', 'quail': 'caille', 'partridge': 'perdrix',
        'African grey': 'perroquet gris', 'macaw': 'ara', 'lorikeet': 'lori',
        'hummingbird': 'colibri', 'toucan': 'toucan', 'drake': 'canard mâle',
        'goose': 'oie', 'black swan': 'cygne noir', 'platypus': 'ornithorynque',
        'wallaby': 'wallaby', 'koala': 'koala', 'wombat': 'wombat',
        'sea anemone': 'anémone de mer', 'brain coral': 'corail cerveau',
        'snail': 'escargot', 'slug': 'limace', 'Dungeness crab': 'crabe dormeur',
        'king crab': 'crabe royal', 'American lobster': 'homard américain',
        'crayfish': 'écrevisse', 'hermit crab': 'bernard-l\'ermite',
        'white stork': 'cigogne blanche', 'spoonbill': 'spatule',
        'little blue heron': 'aigrette bleue', 'bittern': 'butor',
        'bustard': 'outarde', 'pelican': 'pélican', 'king penguin': 'manchot royal',
        'albatross': 'albatros', 'grey whale': 'baleine grise',
        'killer whale': 'orque', 'dugong': 'dugong', 'sea lion': 'lion de mer',
        'golden retriever': 'retriever doré', 'Labrador retriever': 'labrador retriever',
        'German shepherd': 'berger allemand', 'French bulldog': 'bouledogue français',
        'Great Dane': 'dogue allemand', 'Saint Bernard': 'saint-bernard',
        'Siberian husky': 'husky sibérien', 'pug': 'carlin', 'Newfoundland': 'terre-neuve',
        'timber wolf': 'loup', 'red fox': 'renard roux', 'Arctic fox': 'renard arctique',
        'tiger cat': 'chat tigré', 'Persian cat': 'chat persan', 'Siamese cat': 'chat siamois',
        'cougar': 'puma', 'lynx': 'lynx', 'leopard': 'léopard', 'snow leopard': 'léopard des neiges',
        'jaguar': 'jaguar', 'cheetah': 'guépard', 'brown bear': 'ours brun',
        'American black bear': 'ours noir américain', 'ice bear': 'ours polaire',
        'mongoose': 'mangouste', 'meerkat': 'suricate', 'ladybug': 'coccinelle',
        'grasshopper': 'sauterelle', 'cricket': 'grillon', 'mantis': 'mante',
        'dragonfly': 'libellule', 'starfish': 'étoile de mer', 'sea urchin': 'oursin',
        'sea cucumber': 'concombre de mer', 'wood rabbit': 'lapin de garenne',
        'hare': 'lièvre', 'porcupine': 'porc-épic', 'beaver': 'castor',
        'guinea pig': 'cochon d\'Inde', 'zebra': 'zèbre', 'hog': 'cochon',
        'wild boar': 'sanglier', 'warthog': 'phacochère', 'ox': 'bœuf',
        'water buffalo': 'buffle d\'eau', 'bison': 'bison', 'ram': 'bélier',
        'gazelle': 'gazelle', 'Arabian camel': 'chameau d\'Arabie',
        'llama': 'lama', 'weasel': 'belette', 'otter': 'loutre',
        'skunk': 'moufette', 'badger': 'blaireau', 'armadillo': 'tatou',
        'three-toed sloth': 'paresseux', 'orangutan': 'orang-outan',
        'gibbon': 'gibbon', 'baboon': 'babouin', 'macaque': 'macaque',
        'spider monkey': 'atèle', 'Indian elephant': 'éléphant d\'Inde',
        'African elephant': 'éléphant d\'Afrique', 'lesser panda': 'panda roux',
        'giant panda': 'panda géant', 'eel': 'anguille', 'sturgeon': 'esturgeon',
        'academic gown': 'toge', 'accordion': 'accordéon',
        'acoustic guitar': 'guitare acoustique', 'aircraft carrier': 'porte-avions',
        'airliner': 'avion de ligne', 'altar': 'autel', 'amphibian': 'véhicule amphibie',
        'analog clock': 'horloge analogique', 'apron': 'tablier', 'ashcan': 'poubelle',
        'barbell': 'barre d\'haltères', 'barrel': 'barrique', 'baseball': 'baseball',
        'basketball': 'basketball', 'bassoon': 'basson', 'bath towel': 'serviette de bain',
        'beach wagon': 'break', 'beaker': 'bécher', 'bell cote': 'clocher',
        'bicycle-built-for-two': 'tandem', 'binoculars': 'jumelles',
        'birdhouse': 'nichoir', 'bobsled': 'bobsleigh', 'bow tie': 'nœud papillon',
        'broom': 'balai', 'bucket': 'seau', 'bullet train': 'train à grande vitesse',
        'candle': 'bougie', 'cannon': 'canon', 'canoe': 'canoë',
        'can opener': 'ouvre-boîte', 'carousel': 'carrousel',
        'cellular telephone': 'téléphone portable', 'chain': 'chaîne',
        'chain saw': 'tronçonneuse', 'chest': 'coffre', 'chime': 'carillon',
        'Christmas stocking': 'bas de Noël', 'church': 'église', 'cinema': 'cinéma',
        'cleaver': 'hachoir', 'cloak': 'cape', 'clog': 'sabot',
        'computer keyboard': 'clavier d\'ordinateur', 'convertible': 'cabriolet',
        'corkscrew': 'tire-bouchon', 'cowboy boot': 'botte de cowboy',
        'cowboy hat': 'chapeau de cowboy', 'cradle': 'berceau',
        'crib': 'berceau', 'cuirass': 'cuirasse', 'desk': 'bureau',
        'desktop computer': 'ordinateur de bureau', 'diaper': 'couche',
        'digital clock': 'réveil numérique', 'digital watch': 'montre numérique',
        'dining table': 'table à manger', 'dishwasher': 'lave-vaisselle',
        'drumstick': 'baguette', 'dumbbell': 'haltère', 'electric fan': 'ventilateur',
        'electric guitar': 'guitare électrique', 'envelope': 'enveloppe',
        'espresso maker': 'machine à expresso', 'file': 'lime',
        'fireboat': 'bateau-pompe', 'flute': 'flûte',
        'folding chair': 'chaise pliante', 'football helmet': 'casque de football',
        'forklift': 'chariot élévateur', 'fountain': 'fontaine',
        'fountain pen': 'stylo plume', 'French horn': 'cor d\'harmonie',
        'frying pan': 'poêle à frire', 'fur coat': 'manteau en fourrure',
        'garbage truck': 'camion à ordures', 'gasmask': 'masque à gaz',
        'gas pump': 'pompe à essence', 'goblet': 'gobelet',
        'golf ball': 'balle de golf', 'golfcart': 'voiturette de golf',
        'gong': 'gong', 'grand piano': 'piano à queue', 'greenhouse': 'serre',
        'grille': 'grille', 'grocery store': 'épicerie', 'hammer': 'marteau',
        'hamper': 'panier à linge', 'harmonica': 'harmonica', 'harp': 'harpe',
        'harvester': 'moissonneuse-batteuse', 'hatchet': 'hachette',
        'holster': 'étui', 'honeycomb': 'rayon de miel', 'hook': 'crochet',
        'hourglass': 'sablier', 'iron': 'fer à repasser',
        'jack-o\'-lantern': 'citrouille sculptée', 'jeep': 'jeep',
        'jigsaw puzzle': 'puzzle', 'joystick': 'manette', 'kimono': 'kimono',
        'lab coat': 'blouse de laboratoire', 'ladle': 'louche',
        'lampshade': 'abat-jour', 'lawn mower': 'tondeuse',
        'letter opener': 'ouvre-lettre', 'library': 'bibliothèque',
        'lifeboat': 'canot de sauvetage', 'lighter': 'briquet',
        'liner': 'paquebot', 'lipstick': 'rouge à lèvres', 'Loafer': 'mocassin',
        'loudspeaker': 'haut-parleur', 'loupe': 'loupe',
        'magnetic compass': 'boussole', 'mailbag': 'sac postal',
        'mailbox': 'boîte aux lettres', 'manhole cover': 'regard d\'égout',
        'maraca': 'maraca', 'marimba': 'marimba', 'mask': 'masque',
        'maypole': 'mât de mai', 'maze': 'labyrinthe',
        'measuring cup': 'verre doseur', 'microphone': 'microphone',
        'military uniform': 'uniforme militaire', 'miniskirt': 'jupe courte',
        'missile': 'missile', 'mitten': 'mitaine', 'mixing bowl': 'saladier',
        'mobile home': 'mobile home', 'Model T': 'Ford T', 'modem': 'modem',
        'monastery': 'monastère', 'moped': 'cyclomoteur', 'mortar': 'mortier',
        'mortarboard': 'toque universitaire', 'mosque': 'mosquée',
        'mosquito net': 'moustiquaire', 'motor scooter': 'scooter',
        'mountain bike': 'VTT', 'mountain tent': 'tente de montagne',
        'mousetrap': 'souricière', 'moving van': 'camion de déménagement',
        'nail': 'clou', 'necklace': 'collier', 'notebook': 'carnet',
        'obelisk': 'obélisque', 'oboe': 'hautbois', 'ocarina': 'ocarina',
        'odometer': 'compteur kilométrique', 'oil filter': 'filtre à huile',
        'organ': 'orgue', 'overskirt': 'surjupe', 'oxygen mask': 'masque à oxygène',
        'paddle': 'pagaie', 'padlock': 'cadenas', 'paintbrush': 'pinceau',
        'pajama': 'pyjama', 'palace': 'palais', 'panpipe': 'flûte de Pan',
        'paper towel': 'essuie-tout', 'parachute': 'parachute',
        'park bench': 'banc public', 'parking meter': 'parcomètre',
        'passenger car': 'voiture particulière', 'patio': 'terrasse',
        'pedestal': 'piédestal', 'pencil sharpener': 'taille-crayon',
        'perfume': 'parfum', 'pick': 'pioche', 'picket fence': 'palissade',
        'pier': 'jetée', 'piggy bank': 'tirelire', 'pill bottle': 'flacon de pilules',
        'pillow': 'oreiller', 'ping-pong ball': 'balle de ping-pong',
        'pinwheel': 'moulinet', 'pirate': 'pirate', 'pitcher': 'carafe',
        'plane': 'avion', 'planetarium': 'planétarium',
        'plastic bag': 'sac en plastique', 'plow': 'charrue',
        'plunger': 'ventouse', 'pole': 'poteau', 'police van': 'fourgon de police',
        'poncho': 'poncho', 'pool table': 'table de billard',
        'pop bottle': 'bouteille de soda', 'pot': 'casserole',
        'potter\'s wheel': 'tour de potier', 'power drill': 'perceuse',
        'prayer rug': 'tapis de prière', 'printer': 'imprimante',
        'prison': 'prison', 'projector': 'projecteur', 'puck': 'palet',
        'punching bag': 'sac de boxe', 'purse': 'sac à main',
        'quilt': 'édredon', 'racer': 'voiture de course',
        'racket': 'raquette', 'radiator': 'radiateur', 'radio': 'radio',
        'rain barrel': 'récupérateur d\'eau', 'reel': 'bobine',
        'reflex camera': 'appareil reflex', 'restaurant': 'restaurant',
        'revolver': 'revolver', 'rifle': 'fusil',
        'rocking chair': 'berceuse', 'rotisserie': 'rôtisserie',
        'rubber eraser': 'gomme', 'rugby ball': 'ballon de rugby',
        'running shoe': 'chaussure de course', 'safe': 'coffre-fort',
        'safety pin': 'épingle de sûreté', 'saltshaker': 'salière',
        'sandal': 'sandale', 'sax': 'saxophone', 'scale': 'balance',
        'schooner': 'goélette', 'scoreboard': 'tableau d\'affichage',
        'screen': 'écran', 'screw': 'vis', 'screwdriver': 'tournevis',
        'seat belt': 'ceinture de sécurité', 'sewing machine': 'machine à coudre',
        'shield': 'bouclier', 'shovel': 'pelle', 'shower cap': 'bonnet de douche',
        'shower curtain': 'rideau de douche', 'ski': 'ski', 'ski mask': 'cagoule',
        'sleeping bag': 'sac de couchage', 'slot': 'fente',
        'snorkel': 'tubas', 'snowmobile': 'motoneige', 'snowplow': 'chasse-neige',
        'soap dispenser': 'distributeur de savon', 'soccer ball': 'ballon de football',
        'sock': 'chaussette', 'sombrero': 'sombrero', 'soup bowl': 'bol à soupe',
        'spatula': 'spatule', 'speedboat': 'vedette', 'spider web': 'toile d\'araignée',
        'sports car': 'voiture de sport', 'spotlight': 'projecteur',
        'stage': 'scène', 'steam locomotive': 'locomotive à vapeur',
        'stethoscope': 'stéthoscope', 'stole': 'écharpe',
        'stone wall': 'mur en pierre', 'stopwatch': 'chronomètre',
        'stove': 'cuisinière', 'strainer': 'passoire', 'streetcar': 'tramway',
        'stretcher': 'brancard', 'studio couch': 'canapé convertisseur',
        'submarine': 'sous-marin', 'sundial': 'cadran solaire',
        'sunglasses': 'lunettes de soleil', 'sunscreen': 'crème solaire',
        'swab': 'écouvillon', 'sweatshirt': 'sweat',
        'swimming trunks': 'maillot de bain', 'swing': 'balançoire',
        'switch': 'interrupteur', 'syringe': 'seringue',
        'table lamp': 'lampe de table', 'tank': 'char d\'assaut',
        'tape player': 'magnétophone', 'teapot': 'théière',
        'tennis ball': 'balle de tennis', 'thatch': 'chaume',
        'theater curtain': 'rideau de théâtre', 'thimble': 'dé à coudre',
        'thresher': 'batteuse', 'throne': 'trône', 'tile roof': 'toit en tuiles',
        'tobacco shop': 'bureau de tabac', 'toilet seat': 'siège de toilette',
        'torch': 'torche', 'totem pole': 'mât totémique',
        'tow truck': 'dépannage', 'toyshop': 'magasin de jouets',
        'tractor': 'tracteur', 'trailer truck': 'poids lourd',
        'tray': 'plateau', 'trench coat': 'trench', 'tricycle': 'tricycle',
        'tripod': 'trépied', 'triumphal arch': 'arc de triomphe',
        'trolleybus': 'trolleybus', 'trombone': 'trombone', 'tub': 'baignoire',
        'turnstile': 'tourniquet', 'umbrella': 'parapluie',
        'unicycle': 'monocycle', 'vacuum': 'aspirateur', 'vase': 'vase',
        'vault': 'voûte', 'velvet': 'velours',
        'vending machine': 'distributeur automatique', 'violin': 'violon',
        'volleyball': 'volleyball', 'waffle iron': 'gaufrier',
        'wall clock': 'horloge murale', 'wallet': 'portefeuille',
        'wardrobe': 'armoire', 'warplane': 'avion de chasse',
        'washbasin': 'lavabo', 'washer': 'lave-linge',
        'water bottle': 'bouteille d\'eau', 'water jug': 'cruche d\'eau',
        'water tower': 'château d\'eau', 'whistle': 'sifflet', 'wig': 'perruque',
        'window screen': 'moustiquaire de fenêtre', 'window shade': 'store',
        'Windsor tie': 'cravate Windsor', 'wok': 'wok',
        'wooden spoon': 'cuillère en bois', 'wool': 'laine',
        'street sign': 'panneau routier', 'traffic light': 'feu tricolore',
        'menu': 'menu', 'plate': 'assiette', 'guacamole': 'guacamole',
        'French loaf': 'baguette', 'mashed potato': 'purée de pommes de terre',
        'head cabbage': 'chou', 'zucchini': 'courgette', 'bell pepper': 'poivron',
        'mushroom': 'champignon', 'Granny Smith': 'pomme Granny Smith',
        'fig': 'figue', 'jackfruit': 'jaque', 'pomegranate': 'grenade',
        'daisy': 'marguerite', 'corn': 'maïs', 'acorn': 'gland',
        'toilet tissue': 'papier toilette',
    };

    function traduire(label) {
        const key = label.toLowerCase().trim();
        if (TRADUCTIONS[key]) return TRADUCTIONS[key];
        // Tentative avec des variantes (pluriel, avec virgule)
        const keyClean = key.split(',')[0].trim();
        if (TRADUCTIONS[keyClean]) return TRADUCTIONS[keyClean];
        return label.charAt(0).toUpperCase() + label.slice(1).replace(/,/g, ', ');
    }

    // Images de test (HTTPS — fonctionnent sans dossier local)
    const SAMPLE_IMAGES = [
        '../../../assets/img/offline-gallery-placeholder.svg',
        '../../../assets/img/offline-gallery-placeholder.svg',
        '../../../assets/img/offline-gallery-placeholder.svg',
        '../../../assets/img/offline-gallery-placeholder.svg',
        '../../../assets/img/offline-gallery-placeholder.svg',
        '../../../assets/img/offline-gallery-placeholder.svg',
        '../../../assets/img/offline-gallery-placeholder.svg',
        '../../../assets/img/offline-gallery-placeholder.svg',
    ];

    // Initialisation du modèle ML5
    function initModel() {
        setStatus('loading', 'Chargement du modèle MobileNet...');

        ml5.imageClassifier('MobileNet')
            .then((model) => {
                state.model = model;
                state.modelReady = true;
                setStatus('loading', 'Modèle prêt. Chargez une image.');
                tryClassify();
            })
            .catch((err) => {
                console.error(err);
                setStatus('error', 'Erreur : impossible de charger le modèle. Vérifiez votre connexion.');
            });
    }

    // Mise à jour du statut
    function setStatus(type, message) {
        DOM.statusMessage.className = `status-message ${type}`;
        DOM.statusMessage.innerHTML = type === 'loading'
            ? `<div class="loading-inline"><div class="spinner"></div><span>${message}</span></div>`
            : message;
    }

    // Charger une image depuis une source
    function loadImage(source, type = 'file') {
        state.currentSource = type;
        state.imageLoaded = false;
        DOM.dropZone.style.display = 'none';
        DOM.previewContainer.style.display = 'block';
        setStatus('loading', 'Chargement de l\'image...');
        if (typeof source === 'string' && source.startsWith('http')) {
            DOM.imagePreview.crossOrigin = 'anonymous';
        } else {
            DOM.imagePreview.removeAttribute('crossorigin');
        }
        DOM.imagePreview.src = source;
    }

    // Tenter la classification si tout est prêt
    function tryClassify() {
        if (state.modelReady && state.imageLoaded) {
            classify();
        }
    }

    // Classification principale
    function classify() {
        if (!state.model || !DOM.imagePreview.src) return;

        const start = performance.now();

        state.model.classify(DOM.imagePreview, 5)
            .then((results) => {
                const elapsed = Math.round(performance.now() - start);
                renderResults(results, elapsed);
                setStatus('success', `Classification terminée en ${elapsed} ms`);
                DOM.statsRow.style.display = 'flex';
                DOM.resultsContainer.style.display = 'block';
                DOM.inferenceTime.textContent = `${elapsed} ms`;
            })
            .catch((err) => {
                console.error(err);
                setStatus('error', 'Erreur lors de la classification.');
            });
    }

    // Rendu des résultats (Top 5)
    function renderResults(results, inferenceMs) {
        DOM.resultsList.innerHTML = results
            .map((r, i) => {
                const pct = (r.confidence * 100).toFixed(1);
                const isTop = i === 0;
                const label = traduire(r.label);
                return `
                    <div class="result-item ${isTop ? 'top' : ''}">
                        <span class="rank">${i + 1}</span>
                        <div style="flex: 1;">
                            <div class="label">${label}</div>
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${pct}%"></div>
                            </div>
                        </div>
                        <span class="confidence">${pct} %</span>
                    </div>
                `;
            })
            .join('');
    }

    // Réinitialisation
    function reset() {
        state.imageLoaded = false;
        state.currentSource = null;
        DOM.imagePreview.removeAttribute('crossorigin');
        DOM.imagePreview.src = '';
        DOM.dropZone.style.display = 'block';
        DOM.previewContainer.style.display = 'none';
        DOM.resultsContainer.style.display = 'none';
        DOM.statsRow.style.display = 'none';
        DOM.resultsList.innerHTML = '';
        setStatus('loading', 'Chargez une image pour classifier.');
    }

    // Webcam
    async function openWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            state.webcamStream = stream;
            DOM.webcamVideo.srcObject = stream;
            DOM.webcamModal.classList.add('active');
        } catch (err) {
            setStatus('error', 'Accès à la webcam refusé.');
        }
    }

    function closeWebcam() {
        if (state.webcamStream) {
            state.webcamStream.getTracks().forEach(t => t.stop());
            state.webcamStream = null;
        }
        DOM.webcamModal.classList.remove('active');
    }

    function captureFromWebcam() {
        const canvas = document.createElement('canvas');
        canvas.width = DOM.webcamVideo.videoWidth;
        canvas.height = DOM.webcamVideo.videoHeight;
        canvas.getContext('2d').drawImage(DOM.webcamVideo, 0, 0);
        loadImage(canvas.toDataURL('image/jpeg'), 'webcam');
        closeWebcam();
    }

    // Drag & Drop
    function setupDragDrop() {
        DOM.dropZone.addEventListener('click', () => DOM.fileInput.click());

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((evt) => {
            DOM.dropZone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach((evt) => {
            DOM.dropZone.addEventListener(evt, () => DOM.dropZone.classList.add('dragover'));
        });

        ['dragleave', 'drop'].forEach((evt) => {
            DOM.dropZone.addEventListener(evt, () => DOM.dropZone.classList.remove('dragover'));
        });

        DOM.dropZone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => loadImage(ev.target.result, 'file');
                reader.readAsDataURL(file);
            }
        });
    }

    // File input
    function setupFileInput() {
        DOM.btnUpload.addEventListener('click', () => DOM.fileInput.click());

        DOM.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file || !file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (ev) => loadImage(ev.target.result, 'file');
            reader.readAsDataURL(file);
            DOM.fileInput.value = '';
        });
    }

    // Samples
    function setupSamples() {
        SAMPLE_IMAGES.forEach((src) => {
            const img = document.createElement('img');
            img.className = 'sample-thumb';
            img.crossOrigin = 'anonymous';
            img.loading = 'lazy';
            img.src = src;
            img.alt = 'Exemple';
            img.onclick = () => loadImage(src, 'sample');
            DOM.samplesGrid.appendChild(img);
        });
    }

    // Image load handler — classification déclenchée quand l'image est prête
    function setupImageLoad() {
        DOM.imagePreview.addEventListener('load', () => {
            state.imageLoaded = true;
            setStatus('loading', 'Classification en cours...');
            tryClassify();
        });
    }

    // Event listeners
    function bindEvents() {
        DOM.btnReset.addEventListener('click', reset);
        DOM.btnWebcam.addEventListener('click', openWebcam);
        DOM.btnCapture.addEventListener('click', captureFromWebcam);
        DOM.btnCloseWebcam.addEventListener('click', closeWebcam);
    }

    // Bootstrap
    function init() {
        setupDragDrop();
        setupFileInput();
        setupSamples();
        setupImageLoad();
        bindEvents();
        initModel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
