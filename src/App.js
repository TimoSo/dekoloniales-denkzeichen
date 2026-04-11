import { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, SoftShadows, Html, CameraControls, Environment } from '@react-three/drei'
import { easing, geometry } from 'maath'

extend(geometry)

// Annotation-Daten mit Zusatzinfos und Bildern
export const annotationData = [
  {
    name: 'Handelswege',
    detailName: 'Handels-\nwege',
    position: [1.75, 2.5, 2],
    info: 'Der Baum steht auf einer Transportkiste, die auf den Kolonialwarenhandel und dessen Transportwege verweist.',
    detailText:
      '„Der Handelsweg des Dortmunder Hafens legt, laut den Forschungen des Historikers Fidel Amoussou-Moderan, die zentrale Rolle des Dortmunder Hafens als Knotenpunkt im deutschen Kolonialhandel offen, insbesondere in den Bereichen Logistik, Lagerung und industrielle Verarbeitung. Der Bau des Dortmunder Hafens war direkt mit der Notwendigkeit verbunden, den Kolonialhandel über große maritime und binnenländische Transportwege zu erleichtern, die mit dem breiteren hanseatischen Netzwerk verbunden waren.\n\nVor dem Ersten Weltkrieg profitierte der industrielle Sektor Dortmunds, insbesondere die Stahlproduktion – erheblich von der kolonialen Ausbeutung in Gebieten wie Togo, Kamerun, Namibia und Tansania. Mehr als 20 lokale Unternehmen waren in dieses System eingebunden, darunter Glässing & Schollwer, Hoesch, Union, Phoenix, Schüchtermann, Klönne, Jucho und Pohlschröder, die Güter wie Tresore, Industrieanlagen, Eisenbahnmaterial und mechanische Infrastruktur exportierten. Gleichzeitig waren Dortmunder Firmen in globale Extraktionsnetzwerke eingebunden und bezogen Eisen aus Marokko und Brasilien, Kohle aus China, Asbest aus Südafrika und Tropenholz aus Kamerun. Zu den importierten kolonialen Rohstoffen gehörten Palmöl, Kokosöl, Guttapercha, Kakao, Kaffee, Baumwolle und sogar Tierfutter aus Indien.\n\nDas Ausmaß dieses Handels zeigt sich in Zahlen aus dem Jahr 1905, als der maritime Außenhandel Dortmunds etwa 2.578.006 Tonnen erreichte, mit einem Wert von 66,28 Millionen Mark. Allein die deutschen Kolonien importierten Stahlprodukte im Wert von über einer Million Mark aus Dortmund.\n\nDie kolonialen Handelsrouten verbanden afrikanische Territorien mit Deutschland vor allem über Reedereien wie die Hamburg-Amerikanische Packetfahrt-Actien-Gesellschaft (HAPAG), den Norddeutschen Lloyd (NDL) und die Woermann-Linie, die Häfen in West- und Ostafrika mit Hamburg verknüpften. Von dort wurden die Waren über Kanal- und Eisenbahnnetze ins Landesinnere bis zum Dortmunder Hafen transportiert. Eisenbahnunternehmen wie Orenstein & Koppel (O&K) spielten eine Schlüsselrolle bei der Verteilung dieser Güter in der gesamten Ruhrregion und darüber hinaus.\n\nDer Dortmunder Hafen fungierte als bedeutendes Lager- und Verteilzentrum. Zu den wichtigsten Firmen gehörten Heinrich Schreer, Gebr. Rosendahl, Gebr. Wolff und der Verein Heinrich Beukenberg, die Lagerhaltung und Logistik für Kolonialwaren wie Kaffee, Kakao, Reis und Palmöl organisierten. Nach der Weltwirtschaftskrise expandierte Gebr. Rosendahl erheblich und übernahm Kunden von zusammengebrochenen Konkurrenten wie Gebr. Wolff und der Konsumgenossenschaft Eintracht Dortmund. Bis 1927 beschäftigte Rosendahl 30 kaufmännische Angestellte und 29 Lagerarbeiter und hielt ein Umsatzniveau aufrecht, das mit dem von 1913 vergleichbar war.\n\nAuf der Vertriebsseite gelangten Kolonialwaren über regionale und nationale Unternehmen in den alltäglichen Konsum. EDEKA, 1907 als Genossenschaft von Kolonialwarenhändlern gegründet, spielte eine zentrale Rolle im Einzelhandel. Weitere wichtige Akteure waren REWE-Dortmund (über die „Krone"-Genossenschaft), Bayer, Henkel (Persil), Unilever und Degussa. Diese Unternehmen verarbeiteten Rohstoffe wie Kakao, Kaffee und Palmöl zu Konsumgütern und verankerten koloniale Ressourcen im deutschen Alltag.\n\nDas Handelsnetz Dortmunds erstreckte sich auf umliegende Industriestädte wie Düsseldorf, Essen, Wuppertal, Bochum und Duisburg. Bereits zu Beginn des 20. Jahrhunderts waren Kolonialwaren in lokalen Geschäften und Warenhäusern wie Althoff (später Karstadt) weit verbreitet. Im Jahr 1914 wurden Produkte wie Kakao und Schokolade stark beworben, wobei lokale Unternehmen wie C. Lorenzen und Theodor Reichardt diese Waren verarbeiteten und verkauften.\n\nInsgesamt entwickelte sich der Dortmunder Hafen zu einem zentralen Knotenpunkt, der koloniale Extraktionsgebiete mit deutschen Industrie- und Konsummärkten verband. Die Kartierung dieser Routen macht die enge Verflechtung zwischen kolonialen Territorien, Transportunternehmen, Lagerinfrastrukturen und modernen Konzernen sichtbar und hebt zugleich die anhaltenden wirtschaftlichen und sozialen Folgen des deutschen Kolonialismus hervor."\n\nText credit: Fidel Amoussou-Moderan von Decolonize Dortmund',
    image: '/Baobab_Aufbau_1.jpg',
  },
  {
    name: 'Baobab',
    position: [-0.9, 5.8, 1],
    info: 'Der Baobab ist Erinnerung, Lebenskraft, Widerstand und Austausch.',
    detailText:
      'Der Baobab kann einen Stammumfang von 45 Metern erreichen, 25 Meter in die Höhe wachsen und weit über 2.000 Jahre alt werden.\n\nDer Baum ist allerdings viel mehr als das. Er ist auch Erinnerung, Lebenskraft, Widerstand und Austausch.\n\nFür die Gemeinschaften, die mit ihm leben, ist er mehr als ein Baum. Bei den Banen in Kamerun trägt er auch den Namen „Wortbaum". Unter seinem Schatten trafen sich die Ältesten des Dorfes zu Palmwein, Kolanüsse und Gesprächen. Sie saßen auf seinen Wurzeln, so wurde er ebenfalls Teil der Versammlung. An solchen Bäumen, die in Teilen Westafrika auch „Palaverbaum" genannt werden, werden Streitigkeiten geschlichtet, Entscheidungen getroffen und Geschichten von Generation zu Generation weitergegeben.\n\nBei den Serer in Senegal wurden die Griots, die Hüter des kollektiven Gedächtnisses, Sänger und Geschichtenerzähler, nach ihrem Tod im Inneren eines Baobabs beigesetzt. Nicht jeder Baum kam dafür infrage: Die Ältesten wählten ihn sorgfältig aus und weihten ihn in einem Ritual. Eine Stimme, die das Gedächtnis einer ganzen Gemeinschaft trägt, darf nicht einfach in der Erde verschwinden. Im Baobab würde sie weiterleben, so wie der Baum selbst.\n\nDass der Baobab weit über Afrika hinaus Spuren hinterlassen hat, zeigt eine Geschichte aus der Karibik. Auf der Insel St. Croix wächst seit etwa 1750 ein Baobab weit außerhalb seines normalen Verbreitungsgebiets. Für viele Inselbewohner ist die Erklärung: Versklavte Menschen brachten den Samen auf dem Weg über den Atlantik mit. Vermutlich versteckt im Haar, in Halsketten und Ohrringen. Der Erzählung nach hörten Kinder auf der Insel, dass sich der hohle Stamm des Baumes bei Vollmond öffne und man durch ihn hindurch nach Afrika zurückkehren könne.\n\nUnd dann gibt es die alltägliche Seite des Baumes: Das Fruchtpulver wird z.B. mit Milch zu einem erfrischenden Getränk verrührt oder über Nacht fermentiert, bis es zu einer Art Joghurt wird. Es dient als Backtriebmittel, die Asche der Fruchtschalen zum Geschirrspülen. Bei Erkältungen löst man das Pulver in Wasser auf, denn die Früchte enthalten viel Vitamin C.\n\n„Weisheit ist wie ein Baobab-Baum", sagt ein Sprichwort aus Westafrika, „Kein Mensch allein kann ihn umarmen."\n\n\nLiteratur:\n\nOngbakeleki (o.J.): The Baoba / the tree of words. In: Stories of People and Trees. URL: storiesofpeopleandtrees.com\n\nNational Arts Centre Canada (o.J.): Baobab: Stories and Art of West Africa. URL: nac-cna.ca\n\nThe Sumter Item (2026): Witness trees: A living archive of Black memory. URL: theitem.com\n\nAtmos Earth (2026): The Trees That Bear Witness to Black History. URL: atmos.earth\n\nPatrut, A. et al. (2018): The demise of the largest and oldest African baobabs. In: Nature Plants, doi: 10.1038/s41477-018-0170-5.',
    image: '/Baobab_Aufbau_3.jpg',
  },
  {
    name: 'Hafen',
    position: [-1.75, 2.5, -2],
    info: 'Der Dortmunder Hafen steht in unmittelbarer Verbindung mit der Kolonialgeschichte.',
    detailText:
      'Triggerwarnung: Rassistische Gewalt\n\nDer Dortmunder Hafen ist mit 11 Kilometern Uferlänge und zehn Hafenbecken heute der größte Kanalhafen Europas. Wenn man an der U-Bahnhaltestelle Hafen aussteigt, hat man das Hafenamt vor Augen. Auf der Brücke neben der A45 wird es abends von Scheinwerfern beleuchtet, was diesen Ort irgendwie romantisch wirken lässt. Zurzeit ist das in der Nordstadt Dortmunds liegende Gelände in einer Umbauphase. Das Hafenamt soll im Zuge der Umbauarbeiten wieder zum Wahrzeichen der Stadt und der Hafen zu einem neuen Zentrum der Nordstadt aufblühen. Das umliegende Gebiet soll Platz für Cafés, Bars und Kreativwirtschaft bieten. Eine Promenade soll den Hafen zu einem modernen Begegnungsort der Metropolregion machen. Wie kam es zu dem Bau des Hafens und was erzählt uns dieser Ort im Kontext der deutschen Kolonialgeschichte?\n\nIn der Mitte des 19. Jahrhundert gab es die ersten Ideen für eine künstliche Wasserstraße, die nach Dortmund führen und die kleine Industriestadt zu einem Handelspunkt machen sollte. Mit dem Ausbau des Ems-Kanal wurde im Auftrag der Stadt das östliche Ruhrgebiet mit der Nordsee verbunden. Die neue Zufahrt zum Meer sollte die geographisch benachteiligte Lage des östlichen Ruhrgebiets aufheben und strategisch das Deutsche Kaiserreich mit außereuropäischen Gebieten verknüpfen. Das deutsche Kaiserreich unter Kaiser Wilhelm I. stieg zwar erst 1884 in das europäische Kolonialgeschäft ein, doch gab es schon vorher laute Stimmen im politischen Diskurs Dortmunds, die sich für das Kolonialisierung einsetzten.\n\nBereits im Jahresbericht 1879 der Dortmunder Industrie- und Handelskammer bemängelte die Handelskammer – ein regional organisierter Verband von Unternehmen – die ungenutzten Chancen auf kolonialen Besitz. Handelskolonien seien lukrativ und strategisch notwendig. Kolonien seien genauso wichtig für die Sicherheit und den wirtschaftlichen Aufstieg wie eine „mächtige Flotte" oder ein „verteidigungsfähiges Kriegsheer". Mit der benachteiligten geografischen Lage sei Deutschland nicht konkurrenzfähig und müsste aufgrund der geringen Küstenentwicklung aufholen, um mit anderen europäischen Nationen mithalten zu können, so heißt es im Bericht. Mit einer überregionalen Wasserstraße zum Meer könnte Deutschland auch die Zölle vermindern, die durch den Handel mit Großbritannien, Belgien, Frankreich und den Niederlanden entstanden waren. Und damit unabhängiger, größer, mächtiger werden.\n\nIn den Jahresberichten der darauf folgenden Jahre bis zur Inbesitznahme der Gebiete auf dem afrikanischen Kontinent und in Asien um 1884, spricht sich die Industrie- und Handelskammer im Namen wirtschaftlicher Akteure vehement für den Einstieg in das koloniale Geschäft Europas aus. Vor und mit der Beschaffung der deutschen Kolonien formierten sich in der Stadt pro-koloniale Bewegungen, darunter auch die 1888 gegründete Dortmunder Abteilung der Deutschen Kolonialgesellschaft. Diese war die wichtigste Organisation der deutschen Kolonialbewegung und sie existierte bis 1941. In der Handelskammer waren vor allem die großen Unternehmen der Region vertreten. Und fast alle Unternehmen, die in der Handelskammer vertreten waren, waren ebenso Mitglieder der Deutschen Kolonialgesellschaft.\n\nKaiser Wilhelm II., der 1888 zum neuen Kaiser gekürt wurde, wollte den Gedanken vom deutschen „Platz an der Sonne" befördern. Er wollte das deutsche Kaiserreich als Weltmacht etablieren. Die Argumentation wirtschaftlicher und zivilgesellschaftlicher Gruppen deckte sich also mit den Vorstellungen von Kaiser Wilhelm II. Er stand nun hinter den Interessen der industriellen Akteure, die mit dem Kanalbau eine Konkurrenz zur Seeverbindung in Rotterdam schaffen und somit unabhängig von den Niederlanden Handel betreiben wollten.\n\nEs gab auch Stimmen gegen die Umsetzung des Projekts. So kam es im preußischen Abgeordnetenhaus des öfteren zu Konflikten. Die größten Gegner waren ostdeutsche Industrielle und Großgrundbesitzer. Bei ihnen herrschte die Sorge, dass Importe ihnen Konkurrenz mit dem Getreidehandel bringen und deshalb auch die Landflucht steigern würde. Diese Stimmen wurden aber übergangen, da sich nationale Interessen mit dem Projekt des Kanals verbinden ließen.\n\nIm Jahre 1899 wurden der Ausbau des Ems-Kanal und der Bau des Hafens abgeschlossen. Die Eröffnung löste in Dortmund große Begeisterung aus, denn nun war Dortmund von einer Stadt ohne Verbindung zum Meer zur Hafenstadt geworden. Am 11. August 1899 reiste Kaiser Wilhelm II. aus Berlin an, um den Hafen mit einer Rede feierlich einzuweihen. Das sogenannte Kaiserzimmer, das sich oben im Hafenamt befindet, ist ihm gewidmet. Ein Hinweis auf sein großes Engagement, den Bau zu realisieren. Damit gewann auch der Wirtschaftsstandort Dortmund an Bedeutung.\n\nDiese Art von Infrastrukturausbau steht für die deutschen Kolonialinteressen und für eine Durchsetzung der nationalen Interessen über die Grenzen des Landes und Europas hinaus. Der Bau des Hafens ist nicht nur für Dortmunds Infrastruktur relevant, sondern Teil der Kolonialvisionen. Wirtschaftliche Interessen spielten dabei eine essentielle Rolle. Kolonialwaren wie Tee, Kaffee, Tabak oder Palmöl sollten importiert und dementsprechend in den Kolonien in großen Mengen angebaut werden. Doch der Import von Konsumgütern fand nicht die hohe Nachfrage, die sich die Dortmunder Unternehmen erhofft hatten. Der Fokus des kolonialen Handels durch die Dortmunder Industrie konzentrierte sich deshalb vielmehr auf den Import von Eisen- und Kupfererz und den Export von fertigen Eisenwaren. So wurde unter anderem Eisen- und Kupfererz aus den deutschen Kolonien, wie dem heutigen Namibia und Togo importiert und Eisenbahnmaterial exportiert.\n\nFährst du mit der S4 in Richtung Lütgendortmund, kannst du zwischen den Haltestellen Dorstfeld und Marten Süd auf der rechten Seite große Baggerschaufeln und andere Maschinenteile sehen. Bis zur Mitte des Jahres 2021 befand sich dort das Caterpillar-Werk, ein Werk, das eine lange Tradition des Maschinenbaus repräsentiert. Das Werk wurde 1893 von Alfred Koppel und Benno Orenstein gegründet. Das Unternehmen Orenstein & Koppel nutzte das Caterpillar-Gelände zur Herstellung von Wagen, Weichen und anderen Materialen für Eisenbahnen, die dann auch über den Dortmunder Hafen exportiert wurden. Im übrigen wurde Orenstein & Koppel mit Kapital der Deutschen Bank und der Dresdner Bank gegründet.\n\nVon 1903 bis 1906 war Orenstein & Koppel neben der Otavi Minen- und Eisengesellschaft und dem Schiffbauunternehmen Woermann Shipping Lines am Bau der Otavi Bahn im damaligen Deutsch-Südwestafrika, dem heutigen Namibia, beteiligt. Die Otavi Bahn, mit einer Strecke von 600km, war zu der Zeit die längste Feldbahnstrecke der Welt. Sie wurde zum Zweck errichtet, Kupfererz von den Vorkommen durch das Land zu transportieren. Zum Abbau der Ressourcen schlossen sich die genannten deutschen Unternehmen und weitere britische Industrielle zur South West Africa Company zusammen. 1892 erhielten sie von der deutschen Regierung umfassende Land- und Minenrechte, die dazu befugten Grundbesitz und Eigentum zu erwerben und das Gebiet weiter zu erschließen.\n\nSeit der unrechtmäßigen Inbesitznahme des Landes 1904 und der darauffolgenden systematischen Plünderung gab es etliche Aufstände und Aktionen, mit denen sich lokale Gruppierungen wie die Herero und die Nama gegen die Unterdrückung und Menschenrechtsverletzungen der deutschen Besetzer wehrten. 1906 schaffte es ein Aufstand der Herero den Bau der Eisenbahn zu stören. Die Herero überfielen Handelsniederlassungen und andere koloniale Einrichtungen, belagerten Militärstationen und blockierten Bahnlinien. Die Kolonialisten schlugen die Aufstände gewaltvoll nieder. Im Mai 1904 übernahm der General Lothar von Trotha, der für seine besonders brutale Vorgehensweise bereits bekannt war, das Kommando. Er erhielt von Kaiser Wilhelm II. persönlich den Befehl, den Aufstand mit allen Mitteln niederzuschlagen. Von Trotha befahl im Oktober 1904 die völlige Vernichtung der Herero und im April 1905 die der Nama. Schätzungen nach wurden bis zu 100.000 Menschen von den deutschen Truppen vor Ort ermordet, in die Wüste gedrängt oder sie starben in den vom Deutschen Reich errichteten Konzentrationslagern.\n\nAn den Herero und Nama und weiteren Gruppierungen beging Deutschland den ersten Genozid des 20. Jahrhunderts. Sowohl die drei am Bau beteiligten Unternehmen, als auch die Bundesregierung, wurden von den Herero vor US-amerikanischen Zivilgerichten auf Sklavenarbeit verklagt. Denn Orenstein & Koppel unterhielt für den Bau der Bahn ein Lager mit 1.300 Zwangsarbeiter*innen. Die Klage musste jedoch zurückgezogen werden, weil Deutschland mit dem Gang vor den Internationalen Gerichtshof drohte.\n\nDie Auswirkungen der kolonialen Geschichte auf deutsche Wohnorte sind groß. Die kolonialen Bilder, die bis in die Gegenwart weitervermittelt werden, prägen genauso unsere Alltagsorte, wie die städtebaulichen Strukturen, die bis heute bestehen bleiben. Im Fall des Hafens in der Nordstadt Dortmunds lassen sich diese kolonialen Strukturen auch verfolgen. Zum Beispiel, wird die Nordstadt als migrantisiertes Viertel immer wieder zum Ort von Kriminalität und Unordnung gemacht. Medien bezeichnen das Viertel als „No-Go-Area". Das Lüchow-Danneberg-Syndrom beschreibt, dass sich in Orten, die eine erhöhte Polizeipräsenz haben, auch die statistisch erfassten Straftaten erhöhen. Die Nordstadt ist so ein Ort. Ein Ort, der allein durch die bloße Anwesenheit und den Fokus der Polizei krimineller eingeschätzt wird.\n\nDie Geschichte des Hafens kann also innerhalb der Strukturen, in die er eingebettet ist, auf verschiedene Weise mit Kolonialgeschichte verknüpft werden. Der Hafen ist damit ein Symbol der deutschen Politik und Kapitalinteressen. Um ökonomische Vorteile zu erhalten wurden Infrastrukturen geschaffen, die es möglich machten auf Rohstoffe in außereuropäischen Gebieten zugreifen zu können. Das Hafenamt mit dem Kaiserzimmer wurde Ende des 19. Jahrhunderts zum Wahrzeichen der Stadt ausgewählt. Heute soll es zu eben diesem wiederbelebt werden. So eine Überschreibung zentraler kolonialer Infrastruktur findet zum Beispiel auch mit der Hamburger Hafen City und dem Humboldt Forum in Berlin statt.\n\nText credit: Decolonize Dortmund',
    image: '/Baobab_Aufbau_4.jpg',
  },
  {
    name: 'Dekolonial',
    detailName: 'Dekoloniale Praxis',
    position: [-2.5, 8.3, 0],
    info: 'Was bedeutet dekoloniale Praxis? Ein Ansatz zur Auseinandersetzung mit kolonialen Kontinuitäten.',
    detailText:
      'Das Kunstwerk soll eine dekoloniale Praxis verfolgen und den Raum für die Schwarze Community und weitere BIPoC öffnen.\n\nDekolonisierung ist kein abgeschlossenes Kapitel\n\nKolonialismus hat nicht nur Grenzen auf Landkarten gezogen, er hat Wissenssysteme, Rechtspraxis, Sprache und das alltägliche Miteinander geformt. Diese Strukturen wirken bis heute. Dieses Denkzeichen lädt dazu ein, genauer hinzuschauen: Was bedeutet dekoloniales Handeln konkret für einzelne Menschen, für Institutionen, für Städte, Schulen und die Wissenschaft?\n\nDie folgenden Texte stützen sich auf den Sammelband Dekoloniale Rechtswissenschaft und -praxis, herausgegeben von Decolonize Berlin und dem European Center for Constitutional and Human Rights (ECCHR), 2024.\n\n„Nicht überall, wo Dekolonisierung draufsteht, ist auch Dekolonisierung drin."\n— Dekoloniale Rechtswissenschaft und -praxis, Einleitung, S. 18\n\n\nI. Dekoloniale Praxis für einzelne Menschen\n\nDekoloniales Handeln beginnt nicht erst in Institutionen oder auf politischer Ebene. Es beginnt im eigenen Denken und in der Bereitschaft zuzuhören, Privilegien zu erkennen und unbequeme Fragen zuzulassen. Der Sammelband benennt klar, wo die Verantwortung liegt: Bei allen, die in einer Gesellschaft leben, die von kolonialen Strukturen geprägt wurde.\n\n„Die europäischen Gesellschaften haben politische, wirtschaftliche, soziale und Wissenssysteme verinnerlicht, die in kolonialen Beziehungen wurzeln. Sie begründen und prägen unser Denken. Es geht nicht um Schuldzuweisungen, sondern darum, diese Systeme so umzugestalten, dass sie allen in der Gesellschaft gleichermaßen zugutekommen. Es geht nicht um Gut und Böse, sondern um das Zuhören und die Bereitschaft, die notwendigen Schritte zu unternehmen, um den Kreislauf von Ungerechtigkeit und Unterdrückung zu durchbrechen."\n— Vorwort, S. 11\n\n„Wir werden nur dann herausfinden, was es heißt, ‚antirassistisch\' oder ‚dekolonial\' zu sein, wenn wir rassifizierten Gemeinschaften zuhören, die die negativen Auswirkungen von Rassismus und Systemen erfahren haben, die koloniale Machtdynamiken reproduzieren, welche nie dazu gedacht waren, allen Menschen auf dieser Welt zu dienen."\n— Vorwort, S. 14\n\n„Hören wir auf, Rassismus und Entkolonialisierung als Tabuthemen zu behandeln oder sie als etwas abzutun, das nur eine kleine Anzahl von Menschen betrifft. Die Rede ist nicht von individueller Voreingenommenheit oder Vorurteilen, sondern von strukturellen Problemen, die das Leben von vielen Teilen der deutschen Bevölkerung beeinträchtigen. Wir müssen uns mit einem System auseinandersetzen, das nicht allen von uns dient, das uns alle betrifft und das zu ändern in unserer Verantwortung liegt."\n— Vorwort, S. 16\n\n„Aus unserer Sicht mangelt es noch immer am notwendigen Verständnis und der Solidarität der weißen Mehrheitsbevölkerung."\n— Vorwort, S. 15\n\n\nII. Dekoloniale Praxis für Institutionen, Vereine und Organisationen\n\nInstitutionen wie Vereine, Behörden, Rechtspraxis oder NGOs stehen vor der Aufgabe, ihre eigenen Strukturen zu hinterfragen. Dekoloniales Handeln bedeutet hier: Privilegien benennen, Betroffene einbeziehen, und echte Transformation anstreben, statt bei symbolischen Gesten stehenzubleiben.\n\n„Es geht um eine gesellschaftliche Transformation auf allen strukturellen, insbesondere auch rechtlichen Ebenen und nicht um einzelne Projektmaßnahmen oder die Umbenennung von Straßen, die zwar Prozesse anstoßen können, nur dürfen wir nicht auf dieser Stufe stehenbleiben und damit womöglich eine reine Symbolpolitik bedienen."\n— Einleitung, S. 18\n\n„Unabhängig von der jeweiligen Form der Intervention muss ein selbstkritisches und selbstreflexives Verständnis von der eigenen Praxis die Grundlage sein. […] [Akteur*innen] müssen regelmäßig ihre Privilegien hinterfragen und ihren Anspruch prüfen, alle Menschen in ihrer Praxis gleichberechtigt zu vertreten, zu schützen und Zugang zu gewähren."\n— Einleitung, S. 24\n\n„Eine Diskussion über eine bestimmte Gruppe sollte nie ohne die Beteiligung dieser Gruppe stattfinden, da die Betroffenen über spezifisches Wissen und Einsichten verfügen, die niemand sonst einbringen kann."\n— Vorwort, S. 13–14\n\n\nStädte und Verwaltung\n\nStädte können dekoloniale Prozesse aktiv gestalten – durch partizipative Konzepte, durch die Vernetzung zivilgesellschaftlicher, politischer und administrativer Akteur*innen und durch die strukturelle Unterstützung von Initiativen, die koloniale Geschichte aufarbeiten. Das folgende Beispiel beschreibt ein Modell aus dem deutschen Kontext:\n\n„[Die Koordinierungsstelle] dient im Rahmen der Auseinandersetzung mit der kolonialen Vergangenheit […] als Plattform zur Vernetzung von Akteur*innen aus Zivilgesellschaft, Politik und Verwaltung. Gemeinsam mit diesen Akteur*innen entwickelt [sie] Strategien, Konzepte und einen Rahmen, um die Umsetzung dekolonialer Ziele in der Praxis zu ermöglichen."\n— S. 6 – über Decolonize Berlin / Koordinierungsstelle\n\n[…] = Im Original steht hier ein spezifischer Ortsname (Berlin); die beschriebene Aufgabe gilt darüber hinaus.\n\n„Was wir brauchen, ist eine ehrliche politische und gesellschaftliche Auseinandersetzung mit Deutschlands lebendigem kolonialen Erbe und dem allgegenwärtigen systemischen Rassismus."\n— Vorwort, S. 15\n\n\nSchulen und Bildungseinrichtungen\n\nEine der folgenreichsten Leerstellen kolonialer Aufarbeitung liegt im Bildungssystem. Was nicht gelehrt wird, kann nicht hinterfragt werden – und koloniale Amnesie ist kein Zufall, sondern Ergebnis bewusster und unbewusster Weglassungen.\n\n„Teilen der deutschen Bevölkerung dieses Kapitel der Geschichte nicht bekannt ist, weil weitgehend versäumt wurde, es in die Lehrpläne aufzunehmen, es kritisch zu vermitteln oder die flächendeckende Beschäftigung damit zur Pflicht zu machen."\n— Vorwort, S. 14–15\n\n„[Es gehört dazu,] das Recht auf diskriminierungsfreie Bildung durchzusetzen."\n— Einleitung, S. 24 – Forderungen aus den Communities\n\n\nWissenschaft und Wissensproduktion\n\nWissen ist nie neutral. Wer forscht, wer zitiert wird, wessen Perspektiven als \'objektiv\' gelten – das sind Machtfragen. Eine dekoloniale Wissenschaft muss diese Fragen stellen, bevor sie Antworten formuliert.\n\n„Epistemische Gewalt ist mehr als ein Konzept, sie ist die gelebte Realität rassifizierter Menschen. […] Die bestehenden kolonialen Wissenssysteme [haben] die Stimmen von Unterworfenen, das heißt von rassifizierten Gemeinschaften, die von kolonialer Kontinuität und strukturellem Rassismus betroffen sind, zum Schweigen gebracht."\n— Vorwort, S. 12–13\n\n„Der Anspruch an eine Dekolonisierung von Wissensproduktion und Herrschaftsstrukturen muss daher sein, sich dieser Fortschreibungen bewusst zu sein, sie aufzudecken und für die Zukunft auf der Basis von postkolonialen/dekolonialen, antirassistischen, machtkritischen Theorien zu durchbrechen und durch ein emanzipatorisches und selbstbestimmtes Programm zu ersetzen."\n— Einleitung, S. 20\n\n„Es sollte eine intensivere Zusammenarbeit zwischen europäischen Wissenschaftler*innen und den auf den Kontinenten der ehemaligen Kolonien Lebenden geben, um die Wissenssysteme miteinander zu verknüpfen."\n— Vorwort, S. 14\n\n\nKein Ende – ein Anfang\n\nDekolonisierung ist kein abgeschlossener Vorgang. Sie ist ein gesellschaftlicher Prozess – lokal und global, individuell und strukturell. Dieses Denkzeichen steht nicht als Antwort. Es steht als Einladung: hinzuschauen, zu fragen, zuzuhören und zu handeln.\n\n„Der Wandel beginnt mit wiederkehrenden, inklusiven, intersektionalen und mutigen Gesprächen."\n— Vorwort, S. 16\n\n\nQuellenangabe\n\nAlle Zitate stammen aus: Decolonize Berlin / ECCHR (Hrsg.): Dekoloniale Rechtswissenschaft und -praxis. Berlin 2024.\n\nDie mit […] gekennzeichneten Stellen markieren Auslassungen, die im Original einen spezifischen lokalen Kontext (Berlin) benennen; der inhaltliche Kern der Aussage bleibt unverändert und gilt überörtlich.',
    image: '/Baobab_Aufbau_6.jpg',
  },
  {
    name: 'Spiegel',
    position: [1, 4, -1],
    info: 'Der Spiegel lädt zur Selbstreflexion über koloniale Kontinuitäten ein.',
    detailText:
      'Du kannst dich aber auch in ihm spiegeln, bei ihm deine eigene Position zum Thema hinterfragen und dich kritisch mit der Kolonialgeschichte auseinandersetzen. Der Spiegel ist bewusst als interaktives Element gestaltet — er fordert Besuchende auf, sich selbst in Bezug zur kolonialen Vergangenheit zu setzen. Kolonialismus ist keine abgeschlossene Geschichte, sondern wirkt in Strukturen, Denkmustern und Machtverhältnissen bis heute fort. Der Spiegel fragt: Wo stehe ich? Welche Privilegien habe ich? Wie profitiere ich möglicherweise von Strukturen, die in der Kolonialzeit geschaffen wurden? Diese Fragen sind unbequem, aber notwendig — denn nur durch Selbstreflexion kann eine echte dekoloniale Praxis entstehen.',
    image: '/Baobab_Aufbau_1.jpg',
  },
]

export default function App({ page, onTreeHover, onReadMore, onBack }) {
  const controlsRef = useRef()
  const [isZoomedIn, setIsZoomedIn] = useState(false)
  const [activeAnnotation, setActiveAnnotation] = useState(null)
  const [infoOverlay, setInfoOverlay] = useState(null)
  const [overlayExiting, setOverlayExiting] = useState(false)
  const [exitingOverlayData, setExitingOverlayData] = useState(null)

  const handleZoomTo = (markerRef) => {
    if (controlsRef.current && markerRef.current) {
      controlsRef.current.fitToBox(markerRef.current, true, {
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 3,
        paddingRight: 3,
      })
      setIsZoomedIn(true)
    }
  }

  const handleReset = useCallback((transition = true) => {
    if (controlsRef.current) {
      controlsRef.current.setLookAt(0, 2, 14, 0, 0.5, 0, transition)
      setIsZoomedIn(false)
      setActiveAnnotation(null)
      setInfoOverlay(null)
    }
  }, [])

  // Kamera-Reset: nur beim ersten Render instant, bei Rückkehr zu Home sanft
  const hasRendered = useRef(false)
  useEffect(() => {
    if (!hasRendered.current) {
      handleReset(false)
      hasRendered.current = true
    } else if (page === 'home') {
      handleReset(true)
    } else if (page === 'detail') {
      // Kamera wird im useFrame zurückgesetzt (CameraControls ist disabled)
      setIsZoomedIn(false)
      setActiveAnnotation(null)
    }
  }, [page, handleReset])

  // Rechtsklick: auf Home Kamera zurücksetzen, auf Detail zurück zur Startseite
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      if (page === 'home') {
        handleReset(true)
      } else if (page === 'detail' && onBack) {
        onBack()
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => window.removeEventListener('contextmenu', handleContextMenu)
  }, [page, handleReset, onBack])

  const handleReadMoreClick = () => {
    if (activeAnnotation !== null && onReadMore) {
      // Overlay-Exit-Animation starten, Baum sofort bewegen
      setExitingOverlayData(infoOverlay)
      setOverlayExiting(true)
      setInfoOverlay(null)
      setActiveAnnotation(null)
      onReadMore(activeAnnotation)
      // Overlay nach Animation entfernen
      setTimeout(() => {
        setOverlayExiting(false)
        setExitingOverlayData(null)
      }, 1500)
    }
  }

  return (
    <>
      <Canvas
        shadows="basic"
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        camera={{ position: [0, 2, 14], fov: 45 }}
        onPointerMissed={() => {
          if (isZoomedIn) handleReset(true)
        }}>
        <fog attach="fog" args={['black', 0, 25]} />
        <pointLight position={[10, 10, -40]} intensity={5} />
        <pointLight position={[-10, 10, -20]} intensity={5} />

        <Model
          page={page}
          handleZoomTo={handleZoomTo}
          isZoomedIn={isZoomedIn}
          activeAnnotation={activeAnnotation}
          setActiveAnnotation={setActiveAnnotation}
          setInfoOverlay={setInfoOverlay}
          onTreeHover={onTreeHover}
          onBack={onBack}
          position={[0, -5, 3]}
          rotation={[0, -0.2, 0]}
        />

        <SoftShadows samples={4} />
        <ambientLight intensity={0.6} />
        <Environment preset="city" />

        <CameraControls
          ref={controlsRef}
          enabled={page === 'home'}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          dollySpeed={0}
          truckSpeed={0}
        />
      </Canvas>

      {/* Info-Text Overlay mit Weiterlesen-Button — z-index über Annotations */}
      {infoOverlay && (
        <div className="annotation-info-overlay annotation-fadein">
          {infoOverlay.text}
          <br />
          <span className="read-more-button" onClick={handleReadMoreClick}>
            Weiterlesen
          </span>
        </div>
      )}

      {/* Overlay Exit-Animation: fliegt nach unten raus */}
      {overlayExiting && exitingOverlayData && (
        <div className="annotation-info-overlay overlay-exit">
          {exitingOverlayData.text}
          <br />
          <span className="read-more-button">Weiterlesen</span>
        </div>
      )}
    </>
  )
}

function Model({ page, handleZoomTo, isZoomedIn, activeAnnotation, setActiveAnnotation, setInfoOverlay, onTreeHover, onBack, ...props }) {
  const group = useRef()
  const light = useRef()
  const spinRef = useRef()
  const modelRef = useRef()
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [annotationVisibility, setAnnotationVisibility] = useState(annotationData.map(() => true))

  const markerRefs = useRef(annotationData.map(() => ({ current: null })))
  const lookAtRef = useRef(new THREE.Vector3(0, 0.5, 0))
  const detailTransitionStarted = useRef(false)

  const { scene } = useGLTF('/Baobab_Website_e11.glb')

  useEffect(() => {
    const timer = setTimeout(() => setShowAnnotations(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material.transparent) {
          child.material.depthWrite = false
          child.material.polygonOffset = true
          child.material.polygonOffsetFactor = -1
        }

        if (child.material.transmission && child.material.transmission > 0) {
          child.material.roughness = Math.max(child.material.roughness, 0.5)
          child.material.ior = 1
          child.material.thickness = 0.1
          child.material.specularIntensity = 0.6
          child.material.envMapIntensity = 0.9
        }

        child.material.needsUpdate = true
      }
    })
  }, [scene])

  useFrame((state, delta) => {
    if (page === 'home') {
      easing.dampE(group.current.rotation, [0, -state.pointer.x * (Math.PI / 10), 0], 1.5, delta)
      easing.damp3(light.current.position, [state.pointer.x * 12, 0, 8 + state.pointer.y * 4], 0.2, delta)
    } else {
      easing.dampE(group.current.rotation, [0, 0, 0], 1.5, delta)
    }

    let targetPos = [0, 0, 0]
    let targetScale = 2.5

    // Detail-Seite: Baum nach unten, Kamera zurück zur Standardposition
    if (page === 'detail') {
      targetPos = [0, -11, -2]
      targetScale = 3.5
      // Beim ersten Frame: aktuelles Blickziel der Kamera erfassen
      if (!detailTransitionStarted.current) {
        const dir = new THREE.Vector3()
        state.camera.getWorldDirection(dir)
        lookAtRef.current.copy(state.camera.position).add(dir.multiplyScalar(14))
        detailTransitionStarted.current = true
      }
      // Kamera-Position und Blickziel sanft interpolieren
      easing.damp3(state.camera.position, [0, 2, 14], 0.8, delta)
      easing.damp3(lookAtRef.current, [0, 0.5, 0], 0.8, delta)
      state.camera.lookAt(lookAtRef.current)
    } else {
      detailTransitionStarted.current = false
    }

    if (modelRef.current) {
      easing.damp3(modelRef.current.scale, [targetScale, targetScale, targetScale], 0.8, delta)
    }
    easing.damp3(spinRef.current.position, targetPos, 0.8, delta)

    if (spinRef.current && !isZoomedIn) {
      spinRef.current.rotation.y += delta * 0.3
    }

    // Sichtbarkeit der Annotations berechnen
    if (spinRef.current && showAnnotations) {
      const camera = state.camera
      const newVisibility = annotationData.map((ann) => {
        const worldPos = new THREE.Vector3(...ann.position)
        spinRef.current.localToWorld(worldPos)
        const modelCenter = new THREE.Vector3(0, 4, 0)
        spinRef.current.localToWorld(modelCenter)
        const annDist = camera.position.distanceTo(worldPos)
        const centerDist = camera.position.distanceTo(modelCenter)
        return annDist < centerDist + 2
      })
      setAnnotationVisibility(newVisibility)
    }
  })

  const handleAnnotationClick = (index) => {
    const ann = annotationData[index]
    if (activeAnnotation === index) {
      setActiveAnnotation(null)
      setInfoOverlay(null)
    } else {
      setActiveAnnotation(index)
      setInfoOverlay({ text: ann.info })
    }
    if (page === 'home') handleZoomTo(markerRefs.current[index])
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group ref={spinRef}>
        <primitive
          ref={modelRef}
          object={scene}
          position={[0, 0, 0]}
          onPointerEnter={() => onTreeHover && onTreeHover(true)}
          onPointerLeave={() => onTreeHover && onTreeHover(false)}
          onClick={() => {
            if (page === 'detail' && onBack) onBack()
          }}
        />

        {annotationData.map((ann, i) => (
          <mesh
            key={ann.name + '-marker'}
            ref={(el) => {
              markerRefs.current[i].current = el
            }}
            position={ann.position}
            visible={false}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial />
          </mesh>
        ))}

        {showAnnotations &&
          page === 'home' &&
          annotationData.map((ann, i) => (
            <Annotation
              key={ann.name}
              position={ann.position}
              name={ann.name}
              isActive={activeAnnotation === i}
              isVisible={annotationVisibility[i]}
              onClick={() => handleAnnotationClick(i)}
            />
          ))}
      </group>

      <spotLight angle={0.5} penumbra={0.5} ref={light} castShadow intensity={2} shadow-mapSize={1024} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
      </spotLight>
    </group>
  )
}

function Annotation({ name, isActive, isVisible, onClick, ...props }) {
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) onClick()
  }

  return (
    <Html
      {...props}
      transform
      sprite
      center
      style={{
        transition: 'opacity 0.3s',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}>
      <div className="annotation-container">
        <div className={`annotation annotation-fadein ${isActive ? 'annotation-active' : ''}`} onPointerDown={(e) => e.stopPropagation()} onClick={handleClick}>
          {name}
        </div>
      </div>
    </Html>
  )
}
