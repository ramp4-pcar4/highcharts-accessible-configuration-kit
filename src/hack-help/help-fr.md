# Pour commencer

Le Trousse de Configuration Accessible Highcharts (TCAH) est un outil qui vous aide à créer et à modifier facilement [Highcharts](https://www.highcharts.com/). Vous pouvez télécharger des données sous forme de tableau de données via un fichier CSV, XLS ou XLSX ou en collant directement les données. Vous pouvez également importer des graphiques de haut niveau existants à l’aide d’un fichier JSON à partir du menu latéral. Pour un graphique à plusieurs séries, voici un exemple de format de tableau de données valide :

<p style=" display: inline-block; border-radius:8px; font-family: monospace; background: #f3f4f6; padding: 14px; margin-top: 10px;margin-bottom: 10px;">
Année, Entreprise 1, Entreprise 2, Entreprise 3,<br>
2020,59,24,58,47<br>
2021,83,79,88,83.33<br>
2022,65,72,75,70.66<br>
2023,40,56,21,65
</p>

qui correspond à ce graphique :

![Exemple de graphique](samplechartfr.png)

La première colonne doit correspondre à la catégorie de l’axe des x, suivie de ses étiquettes. Par défaut, lorsque vous importez des données, elles s’affichent automatiquement sous forme de graphique linéaire, que vous pouvez modifier ultérieurement dans l’onglet Modèles.

Notez que différents types de graphiques peuvent nécessiter des formats de données spécifiques pour des visualisations précises. Pour un graphique à série unique ou un graphique circulaire, il ne doit y avoir qu’une seule colonne. Voici un exemple de tableau de données valide pour une seule série ou un graphique circulaire :

<p style=" display: inline-block; border-radius:8px; font-family: monospace; background: #f3f4f6; padding: 14px; margin-top: 10px;margin-bottom: 10px;">
"Le sport","Réponses" <br>
"Badminton",4 <br>
"Volley-ball",24 <br>
"Autres",9 <br>
"Soccer",21 <br>
"Basketball",42
</p>

Lorsque vous passez à un graphique circulaire, cela ressemble à ceci :
![Exemple de diagramme circulaire](piechartfr.png)


# Tableau de données


Après avoir téléchargé et importé vos données, vous serez dirigé vers la vue du tableau de données, où un tableau prérempli s’affiche à côté d’un aperçu du graphique. Sur cette page, vous pouvez modifier les valeurs de la table de données et manipuler les lignes et les colonnes. L’aperçu de la carte sera mis à jour en temps réel.

![Exemple de tableau de données](datatablefr.png)


# Modèles


Dans l’onglet Modèles, vous pouvez choisir le type de graphique avec lequel vous souhaitez représenter votre jeu de données. Pour un graphique standard, vous pouvez choisir entre un graphique en aires, un graphique à barres, un graphique à colonnes, un graphique linéaire, un graphique circulaire, un graphique spline et un nuage de points.

Les graphiques linéaires sont parfaits pour représenter les changements et les tendances au fil du temps.
![Exemple de graphique linéaire](linechartfr.png)

De même, les graphiques spline sont des graphiques linéaires qui ont des courbes lisses au lieu de segments de ligne droite.
![Exemple de diagramme spline](splinechartfr.png)

Les graphiques en aires sont généralement utilisés pour représenter graphiquement les tendances dans le temps et montrer l’ampleur ou le volume.
![Exemple de graphique en aires](areachartfr.png)

Les graphiques à barres et à colonnes sont simples et efficaces pour comparer différentes catégories.
![Exemple de graphique à barres](barchartfr.png)
![Exemple de graphique à colonnes](columnchartfr.png)

Les diagrammes circulaires permettent de représenter des pourcentages et de comparer des parties qui forment un tout.
![Exemple de diagramme circulaire](piechartfr.png)

#### Graphiques hybrides

Si vous avez plus d’une série de données, vous pouvez également représenter vos données sous la forme d’un graphique hybride, c’est-à-dire deux graphiques en un. Choisissez un deuxième modèle pour représenter vos données et sélectionnez la série de données que vous souhaitez transférer vers le deuxième modèle.

![Exemple de graphique hybride](hybridchartfr.png)


# Personnalisation

Il existe de nombreuses options de personnalisation dans la section <span style=" display: inline-block; border-radius:8px; font-family: monospace; background: #f3f4f6; padding: 2px 8px;">Personnaliser le graphique</span>  :

<table style="border:1px solid #000000ff;">
  <tr style="border:1px solid #000000ff;">
    <th style="border:1px solid #000000ff; text-align:left; padding: 8px; background:#e5e7eb;">Nom de l’onglet</th>
    <th style="text-align:left; padding: 8px; background:#e5e7eb;">Les options</th>
  </tr>
  <tr style="border:1px solid #000000ff;">
    <td style="border:1px solid #000000ff; padding: 8px;">Titres des graphiques</td>
    <td style="padding: 8px;">Modifier le titre ou le sous-titre du graphique</td>
  </tr>
  <tr style="border:1px solid #000000ff;">
    <td style="border:1px solid #000000ff; padding: 8px;">Série de données</td>
    <td style="padding: 8px;">Personnaliser les couleurs et les types de lignes, de séries ou de points</td>
  </tr>
  <tr style="border:1px solid #000000ff;">
    <td style="border:1px solid #000000ff; padding: 8px;"> <span
    style="cursor: text;"
    ondblclick="document.getElementById('axe').style.display='block';
    this.style.display='none'"
  >
    Axes
  </span>
  <img
    id="axe"
    src="https://64.media.tumblr.com/63bf11828fe7289dc5cc138bb8590e1b/tumblr_inline_pnadd7HcnM1wuj82d_250.gif"
    style="display:none; max-width:100px;"
  >
</td></td>
    <td style="padding: 8px;">Modifier les titres des axes du graphique</td>
  </tr>
  <tr style="border:1px solid #000000ff;">
    <td style="border:1px solid #000000ff; padding: 8px;">Avancé</td>
    <td style="padding: 8px;">Modifiez directement le fichier JSON de configuration du graphique, toutes les propriétés configurables se trouvent
    <a
      href="https://raw.githubusercontent.com/ramp4-pcar4/highcharts-accessible-configuration-kit/main/HighchartsSchema.json"
      class="text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
    ici
    </a>
    </td>
  </tr>
</table>


# Exportation


Dans le menu latéral, vous pouvez facilement exporter votre configuration Highcharts sous forme de fichier JSON. Les fichiers JSON peuvent être réimportés et modifiés ultérieurement.
Dans le menu contextuel de n’importe quel aperçu de graphique, vous pouvez imprimer votre graphique ou le télécharger au format PNG, JPEG, PDF, SVG, CSV ou XLS. Notez que l’enregistrement au format CSV ou XLS signifie que seul le tableau de données est enregistré, et non le modèle ou la personnalisation.

![Exemple de menu contextuel](contextmenufr.gif)


# Accessibilité

Cet outil est conforme aux WCAG 2.1 « AA ». Il est entièrement navigable au clavier et compatible avec les appareils mobiles.