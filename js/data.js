/* ---------- Données ---------- */
const PTS = {A:1, B:4, C:5, D:2};
const QUESTIONS = [
  {q:"Quand tu reçois de l'argent en cadeau, tu as le plus tendance à…", o:[
    "le dépenser tout de suite pour quelque chose que tu veux.",
    "l'épargner pour quelque chose dont tu as besoin.",
    "l'investir ou en faire don à une bonne cause.",
    "le répartir entre dépenses, épargne, investissement et dons."]},
  {q:"Quand tu fais des achats, tu as le plus tendance à…", o:[
    "acheter ce qui te plaît, sans te soucier du prix ni de la qualité.",
    "comparer les prix et la qualité, et chercher des promotions.",
    "éviter d'acheter sauf si c'est absolument nécessaire.",
    "avoir un budget et une liste de courses, et t'y tenir."]},
  {q:"Quand tu as un objectif financier, tu as le plus tendance à…", o:[
    "l'oublier ou abandonner si ça prend trop de temps ou d'efforts.",
    "travailler dur et épargner, même si cela implique des sacrifices.",
    "chercher conseils auprès d'experts ou de mentors et les suivre.",
    "planifier, suivre ta progression et te récompenser à chaque étape."]},
  {q:"Quand tu fais face à un défi financier, tu as le plus tendance à…", o:[
    "l'ignorer ou espérer que ça disparaisse, et dépenser comme d'habitude.",
    "réduire tes dépenses et chercher à augmenter tes revenus.",
    "demander de l'aide à ta famille, tes amis ou des professionnels.",
    "analyser la situation et trouver une solution réaliste et flexible."]},
  {q:"Quand tu penses à ton avenir financier, tu as le plus tendance à…", o:[
    "vivre dans l'instant et ne pas t'inquiéter du lendemain.",
    "avoir une vision claire et un plan détaillé pour tes objectifs.",
    "être optimiste et confiant, en pensant que tout ira pour le mieux.",
    "être prudent et préparé face à tous les risques ou opportunités."]}
];
const TYPES = [
  {min:5, max:9,  key:"spender",  name:"Spender",  text:"Tu vis pour l'instant présent et tu aimes te faire plaisir. Essaie de mettre un petit montant de côté à chaque fois : même peu, ça change tout."},
  {min:10,max:14, key:"balancer", name:"Balancer", text:"Tu cherches l'équilibre entre profiter d'aujourd'hui et préparer demain. Un budget simple t'aiderait à garder ce cap."},
  {min:15,max:19, key:"saver",    name:"Saver",    text:"Tu es prudent, discipliné et tu aimes avoir un filet de sécurité. Ton épargne est solide, tu peux commencer à la faire travailler."},
  {min:20,max:25, key:"investor", name:"Investor", text:"Tu planifies, tu t'informes et tu fais grandir ton argent. Garde un œil sur le risque pour que ta stratégie reste durable."}
];

/* ---------- Dessins (SVG main levée) ---------- */
const S = 'fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
const DRAW = {
spender:`<svg viewBox="0 0 200 170" aria-label="Sac de shopping et pièces"><defs><filter id="r"><feTurbulence baseFrequency=".03" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs><g filter="url(#r)" ${S}><path d="M50 60h90l10 90H40z" fill="#ffd6e0"/><path d="M75 60c0-30 50-30 50 0"/><circle cx="92" cy="95" r="4"/><circle cx="118" cy="95" r="4"/><path d="M90 118q15 12 30 0"/><circle cx="165" cy="35" r="16" fill="#ffe27a"/><text x="159" y="42" font-size="20" fill="currentColor" stroke="none">€</text><circle cx="30" cy="30" r="11" fill="#ffe27a"/><path d="M12 70l8-6M22 50l-10-2"/></g></svg>`,
balancer:`<svg viewBox="0 0 200 170" aria-label="Balance"><defs><filter id="r"><feTurbulence baseFrequency=".03" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs><g filter="url(#r)" ${S}><path d="M100 30v110M70 145h60"/><path d="M35 50h130"/><path d="M35 50l-20 50h40zM165 50l-20 50h40z" fill="#c9f0d8"/><path d="M15 100q20 22 40 0M145 100q20 22 40 0" fill="#ffe27a"/><circle cx="100" cy="30" r="7" fill="#ffd6e0"/></g></svg>`,
saver:`<svg viewBox="0 0 200 170" aria-label="Tirelire"><defs><filter id="r"><feTurbulence baseFrequency=".03" numOctaves="2" seed="8"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs><g filter="url(#r)" ${S}><ellipse cx="95" cy="100" rx="62" ry="44" fill="#ffc2d1"/><path d="M60 62l-6-18 20 10M150 88l18-4v22l-16-4"/><path d="M68 140v16h16v-10M112 146v12h16v-16"/><circle cx="125" cy="88" r="4" fill="currentColor"/><path d="M85 66h30"/><circle cx="100" cy="28" r="14" fill="#ffe27a"/><path d="M100 42v20"/></g></svg>`,
investor:`<svg viewBox="0 0 200 170" aria-label="Graphique en hausse"><defs><filter id="r"><feTurbulence baseFrequency=".03" numOctaves="2" seed="11"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></defs><g filter="url(#r)" ${S}><path d="M25 20v130h155"/><rect x="45" y="110" width="22" height="40" fill="#c9f0d8"/><rect x="80" y="85" width="22" height="65" fill="#c9f0d8"/><rect x="115" y="60" width="22" height="90" fill="#c9f0d8"/><path d="M40 95l38-28 30 14 52-52"/><path d="M162 22h-22M162 22v22"/><circle cx="165" cy="120" r="14" fill="#ffe27a"/><path d="M165 113v14"/></g></svg>`
};

/* ---------- Conseils ---------- */
const ADVICE = {
spender:{emoji:"🛍️",intro:"Les Spenders adorent utiliser leur argent. Ils dépensent souvent sur un coup de tête et ont du mal à tenir un budget. Parfois, ils s'endettent pour s'offrir ce qu'ils veulent. Ils profitent du moment plus que les Savers, mais peuvent accumuler du stress s'ils ne gèrent pas leur argent avec soin.",tips:[
 ["🐷","Épargne d'abord","Mets de côté une part de ton revenu pour l'épargne ou l'investissement avant de dépenser quoi que ce soit."],
 ["💵","Cash, pas crédit","Utilise du cash ou une carte de débit plutôt qu'une carte de crédit pour éviter de trop dépenser ou de payer des intérêts."],
 ["🚧","Pose une limite","Fixe-toi une limite mensuelle pour les dépenses non essentielles, et tiens-la."],
 ["🔍","Mène l'enquête","Passe en revue tes habitudes de dépense et repère où réduire les coûts ou trouver moins cher."],
 ["🎈","Fun gratuit","Trouve d'autres façons de te récompenser ou de t'amuser qui ne coûtent pas d'argent."]]},
balancer:{emoji:"⚖️",intro:"Les Balancers cherchent un équilibre sain entre les trois autres profils. Ils sont prudents avec leur argent mais aiment dépenser pour ce qu'ils aiment. Ils cherchent aussi à investir et à faire grandir leur argent. Ils ont souvent le meilleur de tous les mondes, mais il est parfois difficile de tenir ce juste milieu.",tips:[
 ["🧘","Relax","Profite de ton argent de temps en temps : offre-toi quelque chose dont tu as envie ou besoin."],
 ["🌱","Reste curieux","Sois prêt à découvrir de nouvelles façons de gagner plus. Renseigne-toi bien avant de dire « non »."],
 ["🤝","Bien entouré","Parle à des personnes de confiance pour avoir de l'aide, mais n'oublie pas de t'écouter aussi."],
 ["🏆","Fier de toi","Sois heureux quand ça marche, et fier de ton travail."]]},
saver:{emoji:"🐷",intro:"Les Savers sont très prudents avec leur argent. Ils n'aiment pas dépenser plus que nécessaire et cherchent toujours à réduire les coûts. Ils sont bons en budget et en épargne, mais peuvent passer à côté d'occasions de faire fructifier leur argent, car ils hésitent à prendre des risques.",tips:[
 ["🎨","Permets-toi","Dépenser un peu pour ce qui te rend heureux, c'est permis : loisirs, santé ou formation."],
 ["🎢","Budget souple","Ton budget ne doit pas être trop strict. Autorise-toi du fun et ajuste-le quand il le faut."],
 ["🎁","Partage","Pense à partager avec des personnes qui en ont plus besoin que toi : famille, amis ou associations."],
 ["🎉","Savoure","Sois fier de ce que tu as et profite de ton argent !"]]},
investor:{emoji:"📈",intro:"Les Investors veulent surtout faire grandir leur argent. Ils acceptent de prendre des risques pour obtenir un meilleur rendement. Cela peut les enrichir, mais ils risquent aussi de perdre de l'argent si tout ne se passe pas comme prévu.",tips:[
 ["🥚","Pas tous les œufs","Ne mets pas tout ton argent dans un seul investissement. Garde de quoi faire face aux urgences."],
 ["⚖️","Pèse le pour et le contre","Réfléchis à ce que tu peux gagner ou perdre. Ne te contente pas d'espérer que tout ira bien."],
 ["🧭","Garde le cap","Pense aussi à tes propres objectifs de vie. Ne laisse pas l'argent prendre toute la place."],
 ["💚","Reste aligné","Investis seulement dans ce en quoi tu crois. L'argent ne doit pas te pousser à faire ce que tu ne juges pas juste."]]}
};
