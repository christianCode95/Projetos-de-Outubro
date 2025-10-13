document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const periodicTableGrid = document.getElementById('periodic-table-grid');
    const legendContainer = document.getElementById('legend-container');
    const elementDetailModal = document.getElementById('element-detail-modal');
    const closeModalButton = elementDetailModal.querySelector('.close-button');
    const modalElementName = document.getElementById('modal-element-name');
    const modalElementSymbol = document.getElementById('modal-element-symbol');
    const modalElementAtomicNumber = document.getElementById('modal-element-atomic-number');
    const modalElementAtomicMass = document.getElementById('modal-element-atomic-mass');
    const modalElementCategory = document.getElementById('modal-element-category');
    const modalElementElectronConfiguration = 
    document.getElementById('modal-element-electron-configuration');
    const modalElementMeltingPoint = document.getElementById('modal-element-melting-point');
    const modalElementBoilingPoint = document.getElementById('modal-element-boiling-point');
    const modalElementDensity = document.getElementById('modal-element-density');
    const modalElementDiscoveredBy = document.getElementById('modal-element-discovered-by');
    const modalElementDiscoveryYear = document.getElementById('modal-element-discovery-year');
    const modalElementDescription = document.getElementById('modal-element-description');

    // --- Element Data (Simplified for example) ---
    // A more comprehensive dataset would be much larger.
    const elementsData = [
        // Row 1
        { name: 'Hidrogênio', symbol: 'H', atomicNumber: 1, atomicMass: 1.008, category: 'Não-metal', electronConfiguration: '1s¹', meltingPoint: '-259.16 °C', boilingPoint: '-252.87 °C', density: '0.08988 g/L', discoveredBy: 'Henry Cavendish', discoveryYear: 1766, description: 'O elemento mais abundante no universo.' },
        { name: '', symbol: '', atomicNumber: 0, category: 'empty', gridColumn: 'span 16' }, // Empty cells for layout
        { name: 'Hélio', symbol: 'He', atomicNumber: 2, atomicMass: 4.0026, category: 'Gás Nobre', electronConfiguration: '1s²', meltingPoint: '-272.2 °C', boilingPoint: '-268.93 °C', density: '0.1786 g/L', discoveredBy: 'Pierre Janssen, Norman Lockyer', discoveryYear: 1868, description: 'Um gás inerte e o segundo elemento mais leve.' },

        // Row 2
        { name: 'Lítio', symbol: 'Li', atomicNumber: 3, atomicMass: 6.94, category: 'Metal Alcalino', electronConfiguration: '[He] 2s¹', meltingPoint: '180.5 °C', boilingPoint: '1342 °C', density: '0.534 g/cm³', discoveredBy: 'Johan August Arfwedson', discoveryYear: 1817, description: 'O metal mais leve, usado em baterias.' },
        { name: 'Berílio', symbol: 'Be', atomicNumber: 4, atomicMass: 9.0122, category: 'Metal Alcalino Terroso', electronConfiguration: '[He] 2s²', meltingPoint: '1287 °C', boilingPoint: '2471 °C', density: '1.85 g/cm³', discoveredBy: 'Louis-Nicolas Vauquelin', discoveryYear: 1798, description: 'Um metal leve e forte, usado em ligas.' },
        { name: '', symbol: '', atomicNumber: 0, category: 'empty', gridColumn: 'span 10' },
        { name: 'Boro', symbol: 'B', atomicNumber: 5, atomicMass: 10.81, category: 'Metaloide', electronConfiguration: '[He] 2s² 2p¹', meltingPoint: '2075 °C', boilingPoint: '3927 °C', density: '2.34 g/cm³', discoveredBy: 'Humphry Davy, Joseph Louis Gay-Lussac, Louis Jacques Thénard', discoveryYear: 1808, description: 'Um semimetal com propriedades intermediárias.' },
        { name: 'Carbono', symbol: 'C', atomicNumber: 6, atomicMass: 12.011, category: 'Não-metal', electronConfiguration: '[He] 2s² 2p²', meltingPoint: '3500 °C', boilingPoint: '4827 °C', density: '2.267 g/cm³ (grafite)', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Base de toda a vida orgânica.' },
        { name: 'Nitrogênio', symbol: 'N', atomicNumber: 7, atomicMass: 14.007, category: 'Não-metal', electronConfiguration: '[He] 2s² 2p³', meltingPoint: '-210 °C', boilingPoint: '-195.8 °C', density: '1.251 g/L', discoveredBy: 'Daniel Rutherford', discoveryYear: 1772, description: 'Principal componente do ar.' },
        { name: 'Oxigênio', symbol: 'O', atomicNumber: 8, atomicMass: 15.999, category: 'Não-metal', electronConfiguration: '[He] 2s² 2p⁴', meltingPoint: '-218.79 °C', boilingPoint: '-182.95 °C', density: '1.429 g/L', discoveredBy: 'Joseph Priestley, Carl Wilhelm Scheele', discoveryYear: 1774, description: 'Essencial para a respiração.' },
        { name: 'Flúor', symbol: 'F', atomicNumber: 9, atomicMass: 18.998, category: 'Halogênio', electronConfiguration: '[He] 2s² 2p⁵', meltingPoint: '-219.62 °C', boilingPoint: '-188.12 °C', density: '1.696 g/L', discoveredBy: 'Henri Moissan', discoveryYear: 1886, description: 'O elemento mais reativo.' },
        { name: 'Neônio', symbol: 'Ne', atomicNumber: 10, atomicMass: 20.180, category: 'Gás Nobre', electronConfiguration: '[He] 2s² 2p⁶', meltingPoint: '-248.59 °C', boilingPoint: '-246.08 °C', density: '0.9002 g/L', discoveredBy: 'William Ramsay, Morris Travers', discoveryYear: 1898, description: 'Usado em letreiros luminosos.' },

        // Row 3
        { name: 'Sódio', symbol: 'Na', atomicNumber: 11, atomicMass: 22.990, category: 'Metal Alcalino', electronConfiguration: '[Ne] 3s¹', meltingPoint: '97.72 °C', boilingPoint: '883 °C', density: '0.968 g/cm³', discoveredBy: 'Humphry Davy', discoveryYear: 1807, description: 'Um metal macio e reativo.' },
        { name: 'Magnésio', symbol: 'Mg', atomicNumber: 12, atomicMass: 24.305, category: 'Metal Alcalino Terroso', electronConfiguration: '[Ne] 3s²', meltingPoint: '650 °C', boilingPoint: '1091 °C', density: '1.738 g/cm³', discoveredBy: 'Joseph Black', discoveryYear: 1755, description: 'Metal leve e forte, usado em ligas.' },
        { name: '', symbol: '', atomicNumber: 0, category: 'empty', gridColumn: 'span 10' },
        { name: 'Alumínio', symbol: 'Al', atomicNumber: 13, atomicMass: 26.982, category: 'Metal Pós-Transição', electronConfiguration: '[Ne] 3s² 3p¹', meltingPoint: '660.32 °C', boilingPoint: '2519 °C', density: '2.70 g/cm³', discoveredBy: 'Hans Christian Ørsted', discoveryYear: 1825, description: 'Metal leve e resistente à corrosão.' },
        { name: 'Silício', symbol: 'Si', atomicNumber: 14, atomicMass: 28.085, category: 'Metaloide', electronConfiguration: '[Ne] 3s² 3p²', meltingPoint: '1414 °C', boilingPoint: '3265 °C', density: '2.329 g/cm³', discoveredBy: 'Jöns Jacob Berzelius', discoveryYear: 1823, description: 'Base de semicondutores.' },
        { name: 'Fósforo', symbol: 'P', atomicNumber: 15, atomicMass: 30.974, category: 'Não-metal', electronConfiguration: '[Ne] 3s² 3p³', meltingPoint: '44.1 °C (branco)', boilingPoint: '280.5 °C (branco)', density: '1.823 g/cm³ (branco)', discoveredBy: 'Hennig Brand', discoveryYear: 1669, description: 'Essencial para o DNA.' },
        { name: 'Enxofre', symbol: 'S', atomicNumber: 16, atomicMass: 32.06, category: 'Não-metal', electronConfiguration: '[Ne] 3s² 3p⁴', meltingPoint: '115.21 °C', boilingPoint: '444.6 °C', density: '2.07 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Usado em ácidos e fertilizantes.' },
        { name: 'Cloro', symbol: 'Cl', atomicNumber: 17, atomicMass: 35.45, category: 'Halogênio', electronConfiguration: '[Ne] 3s² 3p⁵', meltingPoint: '-101.5 °C', boilingPoint: '-34.04 °C', density: '3.2 g/L', discoveredBy: 'Carl Wilhelm Scheele', discoveryYear: 1774, description: 'Gás verde-amarelado, desinfetante.' },
        { name: 'Argônio', symbol: 'Ar', atomicNumber: 18, atomicMass: 39.948, category: 'Gás Nobre', electronConfiguration: '[Ne] 3s² 3p⁶', meltingPoint: '-189.34 °C', boilingPoint: '-185.84 °C', density: '1.784 g/L', discoveredBy: 'Lord Rayleigh, William Ramsay', discoveryYear: 1894, description: 'Gás inerte, usado em lâmpadas.' },

        // Row 4 (Simplified Transition Metals block)
        { name: 'Potássio', symbol: 'K', atomicNumber: 19, atomicMass: 39.098, category: 'Metal Alcalino', electronConfiguration: '[Ar] 4s¹', meltingPoint: '63.5 °C', boilingPoint: '759 °C', density: '0.862 g/cm³', discoveredBy: 'Humphry Davy', discoveryYear: 1807, description: 'Metal macio e reativo, essencial para a vida.' },
        { name: 'Cálcio', symbol: 'Ca', atomicNumber: 20, atomicMass: 40.078, category: 'Metal Alcalino Terroso', electronConfiguration: '[Ar] 4s²', meltingPoint: '842 °C', boilingPoint: '1484 °C', density: '1.55 g/cm³', discoveredBy: 'Humphry Davy', discoveryYear: 1808, description: 'Importante para ossos e dentes.' },
        { name: 'Escândio', symbol: 'Sc', atomicNumber: 21, atomicMass: 44.956, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d¹ 4s²', meltingPoint: '1541 °C', boilingPoint: '2836 °C', density: '2.989 g/cm³', discoveredBy: 'Lars Fredrik Nilson', discoveryYear: 1879, description: 'Metal leve, usado em ligas aeroespaciais.' },
        { name: 'Titânio', symbol: 'Ti', atomicNumber: 22, atomicMass: 47.867, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d² 4s²', meltingPoint: '1668 °C', boilingPoint: '3287 °C', density: '4.506 g/cm³', discoveredBy: 'William Gregor', discoveryYear: 1791, description: 'Metal forte e leve, resistente à corrosão.' },
        { name: 'Vanádio', symbol: 'V', atomicNumber: 23, atomicMass: 50.942, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d³ 4s²', meltingPoint: '1910 °C', boilingPoint: '3407 °C', density: '6.11 g/cm³', discoveredBy: 'Andrés Manuel del Río', discoveryYear: 1801, description: 'Usado em ligas de aço por sua resistência.' },
        { name: 'Cromo', symbol: 'Cr', atomicNumber: 24, atomicMass: 51.996, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d⁵ 4s¹', meltingPoint: '1857 °C', boilingPoint: '2672 °C', density: '7.19 g/cm³', discoveredBy: 'Louis Nicolas Vauquelin', discoveryYear: 1797, description: 'Usado para dar brilho e resistência à corrosão.' },
        { name: 'Manganês', symbol: 'Mn', atomicNumber: 25, atomicMass: 54.938, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d⁵ 4s²', meltingPoint: '1246 °C', boilingPoint: '2061 °C', density: '7.21 g/cm³', discoveredBy: 'Johan Gottlieb Gahn', discoveryYear: 1774, description: 'Importante na produção de aço.' },
        { name: 'Ferro', symbol: 'Fe', atomicNumber: 26, atomicMass: 55.845, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d⁶ 4s²', meltingPoint: '1538 °C', boilingPoint: '2862 °C', density: '7.874 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Metal mais comum na Terra, base do aço.' },
        { name: 'Cobalto', symbol: 'Co', atomicNumber: 27, atomicMass: 58.933, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d⁷ 4s²', meltingPoint: '1495 °C', boilingPoint: '2927 °C', density: '8.90 g/cm³', discoveredBy: 'Georg Brandt', discoveryYear: 1735, description: 'Usado em ligas e baterias.' },
        { name: 'Níquel', symbol: 'Ni', atomicNumber: 28, atomicMass: 58.693, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d⁸ 4s²', meltingPoint: '1455 °C', boilingPoint: '2913 °C', density: '8.908 g/cm³', discoveredBy: 'Axel Fredrik Cronstedt', discoveryYear: 1751, description: 'Resistente à corrosão, usado em moedas.' },
        { name: 'Cobre', symbol: 'Cu', atomicNumber: 29, atomicMass: 63.546, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d¹⁰ 4s¹', meltingPoint: '1084.62 °C', boilingPoint: '2562 °C', density: '8.96 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Excelente condutor de eletricidade e calor.' },
        { name: 'Zinco', symbol: 'Zn', atomicNumber: 30, atomicMass: 65.38, category: 'Metal de Transição', electronConfiguration: '[Ar] 3d¹⁰ 4s²', meltingPoint: '419.53 °C', boilingPoint: '907 °C', density: '7.14 g/cm³', discoveredBy: 'Andreas Sigismund Marggraf', discoveryYear: 1746, description: 'Usado para galvanizar e proteger metais.' },
        { name: 'Gálio', symbol: 'Ga', atomicNumber: 31, atomicMass: 69.723, category: 'Metal Pós-Transição', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹', meltingPoint: '29.76 °C', boilingPoint: '2204 °C', density: '5.904 g/cm³', discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', discoveryYear: 1875, description: 'Metal que derrete na mão.' },
        { name: 'Germânio', symbol: 'Ge', atomicNumber: 32, atomicMass: 72.63, category: 'Metaloide', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²', meltingPoint: '938.25 °C', boilingPoint: '2833 °C', density: '5.323 g/cm³', discoveredBy: 'Clemens Winkler', discoveryYear: 1886, description: 'Semimetal usado em eletrônicos.' },
        { name: 'Arsênio', symbol: 'As', atomicNumber: 33, atomicMass: 74.922, category: 'Metaloide', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³', meltingPoint: '817 °C (sublima)', boilingPoint: '614 °C (sublima)', density: '5.727 g/cm³', discoveredBy: 'Albertus Magnus', discoveryYear: 1250, description: 'Tóxico, usado em semicondutores.' },
        { name: 'Selênio', symbol: 'Se', atomicNumber: 34, atomicMass: 78.971, category: 'Não-metal', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴', meltingPoint: '221 °C', boilingPoint: '685 °C', density: '4.81 g/cm³', discoveredBy: 'Jöns Jacob Berzelius', discoveryYear: 1817, description: 'Usado em eletrônicos e pigmentos.' },
        { name: 'Bromo', symbol: 'Br', atomicNumber: 35, atomicMass: 79.904, category: 'Halogênio', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵', meltingPoint: '-7.2 °C', boilingPoint: '58.8 °C', density: '3.1028 g/cm³', discoveredBy: 'Antoine Jérôme Balard', discoveryYear: 1826, description: 'Líquido vermelho-amarronzado volátil.' },
        { name: 'Criptônio', symbol: 'Kr', atomicNumber: 36, atomicMass: 83.798, category: 'Gás Nobre', electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶', meltingPoint: '-157.36 °C', boilingPoint: '-153.22 °C', density: '3.749 g/L', discoveredBy: 'William Ramsay, Morris Travers', discoveryYear: 1898, description: 'Usado em iluminação e lasers.' },

        // Row 5 (Simplified)
        { name: 'Rubídio', symbol: 'Rb', atomicNumber: 37, atomicMass: 85.468, category: 'Metal Alcalino', electronConfiguration: '[Kr] 5s¹', meltingPoint: '39.3 °C', boilingPoint: '688 °C', density: '1.532 g/cm³', discoveredBy: 'Robert Bunsen, Gustav Kirchhoff', discoveryYear: 1861, description: 'Metal macio e altamente reativo.' },
        { name: 'Estrôncio', symbol: 'Sr', atomicNumber: 38, atomicMass: 87.62, category: 'Metal Alcalino Terroso', electronConfiguration: '[Kr] 5s²', meltingPoint: '777 °C', boilingPoint: '1377 °C', density: '2.64 g/cm³', discoveredBy: 'Adair Crawford', discoveryYear: 1790, description: 'Usado em fogos de artifício (cor vermelha).' },
        { name: 'Ítrio', symbol: 'Y', atomicNumber: 39, atomicMass: 88.906, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d¹ 5s²', meltingPoint: '1526 °C', boilingPoint: '3338 °C', density: '4.472 g/cm³', discoveredBy: 'Johan Gadolin', discoveryYear: 1794, description: 'Usado em ligas e lasers.' },
        { name: 'Zircônio', symbol: 'Zr', atomicNumber: 40, atomicMass: 91.224, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d² 5s²', meltingPoint: '1855 °C', boilingPoint: '4377 °C', density: '6.511 g/cm³', discoveredBy: 'Martin Heinrich Klaproth', discoveryYear: 1789, description: 'Resistente à corrosão, usado em reatores nucleares.' },
        { name: 'Nióbio', symbol: 'Nb', atomicNumber: 41, atomicMass: 92.906, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d⁴ 5s¹', meltingPoint: '2477 °C', boilingPoint: '4744 °C', density: '8.57 g/cm³', discoveredBy: 'Charles Hatchett', discoveryYear: 1801, description: 'Usado em aços especiais e supercondutores.' },
        { name: 'Molibdênio', symbol: 'Mo', atomicNumber: 42, atomicMass: 95.95, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d⁵ 5s¹', meltingPoint: '2623 °C', boilingPoint: '4639 °C', density: '10.28 g/cm³', discoveredBy: 'Carl Wilhelm Scheele', discoveryYear: 1778, description: 'Usado em ligas de alta resistência.' },
        { name: 'Tecnécio', symbol: 'Tc', atomicNumber: 43, atomicMass: 98, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d⁵ 5s²', meltingPoint: '2172 °C', boilingPoint: '4265 °C', density: '11 g/cm³', discoveredBy: 'Emilio Segrè, Carlo Perrier', discoveryYear: 1937, description: 'O elemento mais leve sem isótopos estáveis.' },
        { name: 'Rutênio', symbol: 'Ru', atomicNumber: 44, atomicMass: 101.07, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d⁷ 5s¹', meltingPoint: '2334 °C', boilingPoint: '4150 °C', density: '12.45 g/cm³', discoveredBy: 'Karl Ernst Claus', discoveryYear: 1844, description: 'Metal raro, usado em ligas de platina.' },
        { name: 'Ródio', symbol: 'Rh', atomicNumber: 45, atomicMass: 102.91, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d⁸ 5s¹', meltingPoint: '1964 °C', boilingPoint: '3695 °C', density: '12.41 g/cm³', discoveredBy: 'William Hyde Wollaston', discoveryYear: 1803, description: 'Metal precioso, usado em catalisadores.' },
        { name: 'Paládio', symbol: 'Pd', atomicNumber: 46, atomicMass: 106.42, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d¹⁰', meltingPoint: '1554.9 °C', boilingPoint: '2963 °C', density: '12.023 g/cm³', discoveredBy: 'William Hyde Wollaston', discoveryYear: 1803, description: 'Usado em catalisadores e joias.' },
        { name: 'Prata', symbol: 'Ag', atomicNumber: 47, atomicMass: 107.868, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d¹⁰ 5s¹', meltingPoint: '961.78 °C', boilingPoint: '2162 °C', density: '10.49 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Metal precioso, excelente condutor.' },
        { name: 'Cádmio', symbol: 'Cd', atomicNumber: 48, atomicMass: 112.414, category: 'Metal de Transição', electronConfiguration: '[Kr] 4d¹⁰ 5s²', meltingPoint: '321.07 °C', boilingPoint: '767 °C', density: '8.65 g/cm³', discoveredBy: 'Friedrich Stromeyer', discoveryYear: 1817, description: 'Tóxico, usado em baterias e pigmentos.' },
        { name: 'Índio', symbol: 'In', atomicNumber: 49, atomicMass: 114.818, category: 'Metal Pós-Transição', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p¹', meltingPoint: '156.6 °C', boilingPoint: '2072 °C', density: '7.31 g/cm³', discoveredBy: 'Ferdinand Reich, Hieronymus Theodor Richter', discoveryYear: 1863, description: 'Metal macio, usado em ligas e eletrônicos.' },
        { name: 'Estanho', symbol: 'Sn', atomicNumber: 50, atomicMass: 118.710, category: 'Metal Pós-Transição', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p²', meltingPoint: '231.93 °C', boilingPoint: '2602 °C', density: '7.26 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Usado em soldas e revestimentos.' },
        { name: 'Antimônio', symbol: 'Sb', atomicNumber: 51, atomicMass: 121.760, category: 'Metaloide', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p³', meltingPoint: '630.63 °C', boilingPoint: '1587 °C', density: '6.697 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Semimetal usado em ligas e eletrônicos.' },
        { name: 'Telúrio', symbol: 'Te', atomicNumber: 52, atomicMass: 127.60, category: 'Metaloide', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁴', meltingPoint: '449.5 °C', boilingPoint: '988 °C', density: '6.24 g/cm³', discoveredBy: 'Franz-Joseph Müller von Reichenstein', discoveryYear: 1782, description: 'Semimetal raro, usado em ligas e semicondutores.' },
        { name: 'Iodo', symbol: 'I', atomicNumber: 53, atomicMass: 126.904, category: 'Halogênio', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵', meltingPoint: '113.7 °C', boilingPoint: '184.3 °C', density: '4.933 g/cm³', discoveredBy: 'Bernard Courtois', discoveryYear: 1811, description: 'Sólido escuro que sublima em vapor roxo.' },
        { name: 'Xenônio', symbol: 'Xe', atomicNumber: 54, atomicMass: 131.293, category: 'Gás Nobre', electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁶', meltingPoint: '-111.7 °C', boilingPoint: '-108.1 °C', density: '5.894 g/L', discoveredBy: 'William Ramsay, Morris Travers', discoveryYear: 1898, description: 'Usado em lâmpadas de flash e faróis.' },

        // Row 6 (with Lanthanides placeholder)
        { name: 'Césio', symbol: 'Cs', atomicNumber: 55, atomicMass: 132.905, category: 'Metal Alcalino', electronConfiguration: '[Xe] 6s¹', meltingPoint: '28.4 °C', boilingPoint: '671 °C', density: '1.879 g/cm³', discoveredBy: 'Robert Bunsen, Gustav Kirchhoff', discoveryYear: 1860, description: 'Metal macio, usado em relógios atômicos.' },
        { name: 'Bário', symbol: 'Ba', atomicNumber: 56, atomicMass: 137.327, category: 'Metal Alcalino Terroso', electronConfiguration: '[Xe] 6s²', meltingPoint: '727 °C', boilingPoint: '1897 °C', density: '3.51 g/cm³', discoveredBy: 'Carl Wilhelm Scheele', discoveryYear: 1774, description: 'Usado em fogos de artifício (cor verde).' },
        { name: 'Lantanídeos', symbol: 'La-Lu', atomicNumber: 57-71, category: 'Lantanídeo', gridColumn: 'span 1', description: 'Série de elementos de terras raras.' }, // Placeholder for Lanthanides
        { name: 'Háfnio', symbol: 'Hf', atomicNumber: 72, atomicMass: 178.49, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d² 6s²', meltingPoint: '2233 °C', boilingPoint: '4603 °C', density: '13.31 g/cm³', discoveredBy: 'Dirk Coster, George de Hevesy', discoveryYear: 1923, description: 'Usado em superligas e reatores nucleares.' },
        { name: 'Tântalo', symbol: 'Ta', atomicNumber: 73, atomicMass: 180.948, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d³ 6s²', meltingPoint: '3017 °C', boilingPoint: '5458 °C', density: '16.69 g/cm³', discoveredBy: 'Anders Gustaf Ekeberg', discoveryYear: 1802, description: 'Metal altamente resistente à corrosão.' },
        { name: 'Tungstênio', symbol: 'W', atomicNumber: 74, atomicMass: 183.84, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²', meltingPoint: '3422 °C', boilingPoint: '5930 °C', density: '19.25 g/cm³', discoveredBy: 'Juan José Elhuyar, Fausto Elhuyar', discoveryYear: 1783, description: 'Maior ponto de fusão de todos os metais.' },
        { name: 'Rênio', symbol: 'Re', atomicNumber: 75, atomicMass: 186.207, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d⁵ 6s²', meltingPoint: '3186 °C', boilingPoint: '5596 °C', density: '21.02 g/cm³', discoveredBy: 'Walter Noddack, Ida Tacke, Otto Berg', discoveryYear: 1925, description: 'Metal raro, usado em superligas.' },
        { name: 'Ósmio', symbol: 'Os', atomicNumber: 76, atomicMass: 190.23, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d⁶ 6s²', meltingPoint: '3033 °C', boilingPoint: '5012 °C', density: '22.59 g/cm³', discoveredBy: 'Smithson Tennant', discoveryYear: 1803, description: 'O elemento mais denso.' },
        { name: 'Irídio', symbol: 'Ir', atomicNumber: 77, atomicMass: 192.217, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d⁷ 6s²', meltingPoint: '2466 °C', boilingPoint: '4428 °C', density: '22.56 g/cm³', discoveredBy: 'Smithson Tennant', discoveryYear: 1803, description: 'Metal resistente à corrosão, usado em ligas.' },
        { name: 'Platina', symbol: 'Pt', atomicNumber: 78, atomicMass: 195.084, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d⁹ 6s¹', meltingPoint: '1768.3 °C', boilingPoint: '3825 °C', density: '21.45 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Metal precioso, usado em joias e catalisadores.' },
        { name: 'Ouro', symbol: 'Au', atomicNumber: 79, atomicMass: 196.967, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', meltingPoint: '1064.18 °C', boilingPoint: '2856 °C', density: '19.3 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Metal precioso, altamente maleável.' },
        { name: 'Mercúrio', symbol: 'Hg', atomicNumber: 80, atomicMass: 200.592, category: 'Metal de Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', meltingPoint: '-38.83 °C', boilingPoint: '356.73 °C', density: '13.534 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'O único metal líquido à temperatura ambiente.' },
        { name: 'Tálio', symbol: 'Tl', atomicNumber: 81, atomicMass: 204.38, category: 'Metal Pós-Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', meltingPoint: '304 °C', boilingPoint: '1473 °C', density: '11.85 g/cm³', discoveredBy: 'William Crookes', discoveryYear: 1861, description: 'Metal macio e tóxico.' },
        { name: 'Chumbo', symbol: 'Pb', atomicNumber: 82, atomicMass: 207.2, category: 'Metal Pós-Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', meltingPoint: '327.46 °C', boilingPoint: '1749 °C', density: '11.34 g/cm³', discoveredBy: 'Antiguidade', discoveryYear: null, description: 'Metal pesado e maleável.' },
        { name: 'Bismuto', symbol: 'Bi', atomicNumber: 83, atomicMass: 208.980, category: 'Metal Pós-Transição', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', meltingPoint: '271.4 °C', boilingPoint: '1564 °C', density: '9.78 g/cm³', discoveredBy: 'Claude Geoffroy le Jeune', discoveryYear: 1753, description: 'Metal quebradiço, usado em ligas de baixo ponto de fusão.' },
        { name: 'Polônio', symbol: 'Po', atomicNumber: 84, atomicMass: 209, category: 'Metaloide', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', meltingPoint: '254 °C', boilingPoint: '962 °C', density: '9.196 g/cm³', discoveredBy: 'Marie Curie, Pierre Curie', discoveryYear: 1898, description: 'Elemento radioativo raro.' },
        { name: 'Astato', symbol: 'At', atomicNumber: 85, atomicMass: 210, category: 'Halogênio', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', meltingPoint: '302 °C', boilingPoint: '337 °C', density: '7 g/cm³ (estimado)', discoveredBy: 'Dale R. Corson, Kenneth R. MacKenzie, Emilio Segrè', discoveryYear: 1940, description: 'O halogênio mais raro e radioativo.' },
        { name: 'Radônio', symbol: 'Rn', atomicNumber: 86, atomicMass: 222, category: 'Gás Nobre', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', meltingPoint: '-71 °C', boilingPoint: '-61.7 °C', density: '9.73 g/L', discoveredBy: 'Friedrich Ernst Dorn', discoveryYear: 1900, description: 'Gás radioativo, produto do decaimento do rádio.' },

        // Row 7 (with Actinides placeholder)
        { name: 'Frâncio', symbol: 'Fr', atomicNumber: 87, atomicMass: 223, category: 'Metal Alcalino', electronConfiguration: '[Rn] 7s¹', meltingPoint: '27 °C', boilingPoint: '677 °C', density: '1.87 g/cm³ (estimado)', discoveredBy: 'Marguerite Perey', discoveryYear: 1939, description: 'O segundo elemento alcalino mais pesado e radioativo.' },
        { name: 'Rádio', symbol: 'Ra', atomicNumber: 88, atomicMass: 226, category: 'Metal Alcalino Terroso', electronConfiguration: '[Rn] 7s²', meltingPoint: '700 °C', boilingPoint: '1737 °C', density: '5.5 g/cm³', discoveredBy: 'Marie Curie, Pierre Curie', discoveryYear: 1898, description: 'Elemento radioativo luminescente.' },
        { name: 'Actinídeos', symbol: 'Ac-Lr', atomicNumber: 89-103, category: 'Actinídeo', gridColumn: 'span 1', description: 'Série de elementos radioativos pesados.' }, // Placeholder for Actinides
        { name: 'Rutherfórdio', symbol: 'Rf', atomicNumber: 104, atomicMass: 267, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d² 7s²', meltingPoint: '2100 °C (estimado)', boilingPoint: '5500 °C (estimado)', density: '23.2 g/cm³ (estimado)', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Berkeley National Laboratory', discoveryYear: 1964, description: 'Elemento sintético e altamente radioativo.' },
        { name: 'Dúbnio', symbol: 'Db', atomicNumber: 105, atomicMass: 268, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d³ 7s²', meltingPoint: '1800 °C (estimado)', boilingPoint: 'unknown', density: '29.3 g/cm³ (estimado)', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Berkeley National Laboratory', discoveryYear: 1968, description: 'Elemento sintético e extremamente instável.' },
        { name: 'Seabórgio', symbol: 'Sg', atomicNumber: 106, atomicMass: 271, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d⁴ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: '35 g/cm³ (estimado)', discoveredBy: 'Lawrence Berkeley National Laboratory', discoveryYear: 1974, description: 'Elemento sintético, nomeado em homenagem a Glenn Seaborg.' },
        { name: 'Bóhrio', symbol: 'Bh', atomicNumber: 107, atomicMass: 272, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d⁵ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1976, description: 'Elemento sintético e muito radioativo.' },
        { name: 'Hássio', symbol: 'Hs', atomicNumber: 108, atomicMass: 277, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d⁶ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: '40.7 g/cm³ (estimado)', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1984, description: 'Elemento sintético e extremamente pesado.' },
        { name: 'Meitnério', symbol: 'Mt', atomicNumber: 109, atomicMass: 276, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d⁷ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1982, description: 'Elemento sintético, nomeado em homenagem a Lise Meitner.' },
        { name: 'Darmstádtio', symbol: 'Ds', atomicNumber: 110, atomicMass: 281, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d⁸ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1994, description: 'Elemento sintético e superpesado.' },
        { name: 'Roentgênio', symbol: 'Rg', atomicNumber: 111, atomicMass: 282, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d⁹ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1994, description: 'Elemento sintético, nomeado em homenagem a Wilhelm Röntgen.' },
        { name: 'Copernício', symbol: 'Cn', atomicNumber: 112, atomicMass: 285, category: 'Metal de Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Gesellschaft für Schwerionenforschung (GSI)', discoveryYear: 1996, description: 'Elemento sintético, nomeado em homenagem a Nicolau Copérnico.' },
        { name: 'Nihônio', symbol: 'Nh', atomicNumber: 113, atomicMass: 286, category: 'Metal Pós-Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'RIKEN', discoveryYear: 2003, description: 'Elemento sintético e altamente radioativo.' },
        { name: 'Fleróvio', symbol: 'Fl', atomicNumber: 114, atomicMass: 289, category: 'Metal Pós-Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Livermore National Laboratory', discoveryYear: 1999, description: 'Elemento sintético e superpesado.' },
        { name: 'Moscóvio', symbol: 'Mc', atomicNumber: 115, atomicMass: 290, category: 'Metal Pós-Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Livermore National Laboratory', discoveryYear: 2003, description: 'Elemento sintético e extremamente radioativo.' },
        { name: 'Livermório', symbol: 'Lv', atomicNumber: 116, atomicMass: 293, category: 'Metal Pós-Transição', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Livermore National Laboratory', discoveryYear: 2000, description: 'Elemento sintético, superpesado e radioativo.' },
        { name: 'Tenessino', symbol: 'Ts', atomicNumber: 117, atomicMass: 294, category: 'Halogênio', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Oak Ridge National Laboratory', discoveryYear: 2010, description: 'Elemento sintético e o segundo mais pesado halogênio.' },
        { name: 'Oganessônio', symbol: 'Og', atomicNumber: 118, atomicMass: 294, category: 'Gás Nobre', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', meltingPoint: 'unknown', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Livermore National Laboratory', discoveryYear: 2002, description: 'Elemento sintético, o mais pesado gás nobre.' },

        // Lanthanides (separate block below)
        { name: 'Lantânio', symbol: 'La', atomicNumber: 57, atomicMass: 138.905, category: 'Lantanídeo', electronConfiguration: '[Xe] 5d¹ 6s²', meltingPoint: '920 °C', boilingPoint: '3464 °C', density: '6.162 g/cm³', discoveredBy: 'Carl Gustaf Mosander', discoveryYear: 1839, description: 'Metal prateado, usado em ligas e lentes.' , gridRow: 8, gridColumn: 3 },
        { name: 'Cério', symbol: 'Ce', atomicNumber: 58, atomicMass: 140.116, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²', meltingPoint: '795 °C', boilingPoint: '3443 °C', density: '6.77 g/cm³', discoveredBy: 'Martin Heinrich Klaproth, Jöns Jacob Berzelius, Wilhelm Hisinger', discoveryYear: 1803, description: 'O lantanídeo mais abundante.' },
        { name: 'Praseodímio', symbol: 'Pr', atomicNumber: 59, atomicMass: 140.908, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f³ 6s²', meltingPoint: '935 °C', boilingPoint: '3520 °C', density: '6.77 g/cm³', discoveredBy: 'Carl Auer von Welsbach', discoveryYear: 1885, description: 'Usado em vidros coloridos e lasers.' },
        { name: 'Neodímio', symbol: 'Nd', atomicNumber: 60, atomicMass: 144.242, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f⁴ 6s²', meltingPoint: '1021 °C', boilingPoint: '3074 °C', density: '7.01 g/cm³', discoveredBy: 'Carl Auer von Welsbach', discoveryYear: 1885, description: 'Usado em ímãs potentes.' },
        { name: 'Promécio', symbol: 'Pm', atomicNumber: 61, atomicMass: 145, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f⁵ 6s²', meltingPoint: '1042 °C', boilingPoint: '3000 °C', density: '7.26 g/cm³', discoveredBy: 'Jacob A. Marinsky, Lawrence E. Glendenin, Charles D. Coryell', discoveryYear: 1945, description: 'Único lantanídeo radioativo.' },
        { name: 'Samário', symbol: 'Sm', atomicNumber: 62, atomicMass: 150.36, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f⁶ 6s²', meltingPoint: '1074 °C', boilingPoint: '1794 °C', density: '7.52 g/cm³', discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', discoveryYear: 1879, description: 'Usado em ímãs e lasers.' },
        { name: 'Európio', symbol: 'Eu', atomicNumber: 63, atomicMass: 151.964, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f⁷ 6s²', meltingPoint: '822 °C', boilingPoint: '1529 °C', density: '5.244 g/cm³', discoveredBy: 'Eugène-Anatole Demarçay', discoveryYear: 1901, description: 'Usado em fósforos de TV colorida.' },
        { name: 'Gadolínio', symbol: 'Gd', atomicNumber: 64, atomicMass: 157.25, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f⁷ 5d¹ 6s²', meltingPoint: '1312 °C', boilingPoint: '3273 °C', density: '7.90 g/cm³', discoveredBy: 'Jean Charles Galissard de Marignac', discoveryYear: 1880, description: 'Usado em ímãs e ressonância magnética.' },
        { name: 'Térbio', symbol: 'Tb', atomicNumber: 65, atomicMass: 158.925, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f⁹ 6s²', meltingPoint: '1356 °C', boilingPoint: '3230 °C', density: '8.219 g/cm³', discoveredBy: 'Carl Gustaf Mosander', discoveryYear: 1843, description: 'Usado em ligas e lasers.' },
        { name: 'Disprósio', symbol: 'Dy', atomicNumber: 66, atomicMass: 162.500, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f¹⁰ 6s²', meltingPoint: '1412 °C', boilingPoint: '2567 °C', density: '8.55 g/cm³', discoveredBy: 'Paul-Émile Lecoq de Boisbaudran', discoveryYear: 1886, description: 'Usado em lasers e ímãs.' },
        { name: 'Hólmio', symbol: 'Ho', atomicNumber: 67, atomicMass: 164.930, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f¹¹ 6s²', meltingPoint: '1474 °C', boilingPoint: '2700 °C', density: '8.795 g/cm³', discoveredBy: 'Per Teodor Cleve', discoveryYear: 1878, description: 'Usado em lasers e barras de controle nuclear.' },
        { name: 'Érbio', symbol: 'Er', atomicNumber: 68, atomicMass: 167.259, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f¹² 6s²', meltingPoint: '1529 °C', boilingPoint: '2868 °C', density: '9.066 g/cm³', discoveredBy: 'Carl Gustaf Mosander', discoveryYear: 1843, description: 'Usado em lasers de fibra óptica.' },
        { name: 'Túlio', symbol: 'Tm', atomicNumber: 69, atomicMass: 168.934, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f¹³ 6s²', meltingPoint: '1545 °C', boilingPoint: '1950 °C', density: '9.32 g/cm³', discoveredBy: 'Per Teodor Cleve', discoveryYear: 1879, description: 'Usado em lasers de estado sólido.' },
        { name: 'Itérbio', symbol: 'Yb', atomicNumber: 70, atomicMass: 173.045, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f¹⁴ 6s²', meltingPoint: '819 °C', boilingPoint: '1196 °C', density: '6.90 g/cm³', discoveredBy: 'Jean Charles Galissard de Marignac', discoveryYear: 1878, description: 'Usado em aços e lasers.' },
        { name: 'Lutécio', symbol: 'Lu', atomicNumber: 71, atomicMass: 174.966, category: 'Lantanídeo', electronConfiguration: '[Xe] 4f¹⁴ 5d¹ 6s²', meltingPoint: '1663 °C', boilingPoint: '3402 °C', density: '9.84 g/cm³', discoveredBy: 'Georges Urbain', discoveryYear: 1907, description: 'Usado em catalisadores e cintiladores.' },

        // Actinides (separate block below)
        { name: 'Actínio', symbol: 'Ac', atomicNumber: 89, atomicMass: 227, category: 'Actinídeo', electronConfiguration: '[Rn] 6d¹ 7s²', meltingPoint: '1050 °C', boilingPoint: '3200 °C', density: '10.07 g/cm³', discoveredBy: 'André-Louis Debierne', discoveryYear: 1899, description: 'Elemento radioativo, usado como fonte de nêutrons.' , gridRow: 9, gridColumn: 3 },
        { name: 'Tório', symbol: 'Th', atomicNumber: 90, atomicMass: 232.038, category: 'Actinídeo', electronConfiguration: '[Rn] 6d² 7s²', meltingPoint: '1750 °C', boilingPoint: '4788 °C', density: '11.72 g/cm³', discoveredBy: 'Jöns Jacob Berzelius', discoveryYear: 1828, description: 'Radioativo, usado em reatores nucleares e ligas.' },
        { name: 'Protactínio', symbol: 'Pa', atomicNumber: 91, atomicMass: 231.036, category: 'Actinídeo', electronConfiguration: '[Rn] 5f² 6d¹ 7s²', meltingPoint: '1568 °C', boilingPoint: '4027 °C', density: '15.37 g/cm³', discoveredBy: 'Kasimir Fajans, Oswald H. Göhring', discoveryYear: 1913, description: 'Radioativo, muito raro e tóxico.' },
        { name: 'Urânio', symbol: 'U', atomicNumber: 92, atomicMass: 238.029, category: 'Actinídeo', electronConfiguration: '[Rn] 5f³ 6d¹ 7s²', meltingPoint: '1132.2 °C', boilingPoint: '4131 °C', density: '19.05 g/cm³', discoveredBy: 'Martin Heinrich Klaproth', discoveryYear: 1789, description: 'Radioativo, usado em energia nuclear e armas.' },
        { name: 'Netúnio', symbol: 'Np', atomicNumber: 93, atomicMass: 237, category: 'Actinídeo', electronConfiguration: '[Rn] 5f⁴ 6d¹ 7s²', meltingPoint: '637 °C', boilingPoint: '4000 °C', density: '20.45 g/cm³', discoveredBy: 'Edwin McMillan, Philip H. Abelson', discoveryYear: 1940, description: 'Elemento transurânico, radioativo.' },
        { name: 'Plutônio', symbol: 'Pu', atomicNumber: 94, atomicMass: 244, category: 'Actinídeo', electronConfiguration: '[Rn] 5f⁶ 7s²', meltingPoint: '639.4 °C', boilingPoint: '3228 °C', density: '19.816 g/cm³', discoveredBy: 'Glenn T. Seaborg, Joseph W. Kennedy, Edwin M. McMillan, Arthur C. Wahl', discoveryYear: 1940, description: 'Radioativo, usado em armas nucleares e reatores.' },
        { name: 'Amerício', symbol: 'Am', atomicNumber: 95, atomicMass: 243, category: 'Actinídeo', electronConfiguration: '[Rn] 5f⁷ 7s²', meltingPoint: '1176 °C', boilingPoint: '2607 °C', density: '13.67 g/cm³', discoveredBy: 'Glenn T. Seaborg, Ralph A. James, Leon O. Morgan, Albert Ghiorso', discoveryYear: 1944, description: 'Radioativo, usado em detectores de fumaça.' },
        { name: 'Cúrio', symbol: 'Cm', atomicNumber: 96, atomicMass: 247, category: 'Actinídeo', electronConfiguration: '[Rn] 5f⁷ 6d¹ 7s²', meltingPoint: '1340 °C', boilingPoint: '3100 °C', density: '13.51 g/cm³', discoveredBy: 'Glenn T. Seaborg, Ralph A. James, Albert Ghiorso', discoveryYear: 1944, description: 'Radioativo, usado em geradores termoelétricos.' },
        { name: 'Berquélio', symbol: 'Bk', atomicNumber: 97, atomicMass: 247, category: 'Actinídeo', electronConfiguration: '[Rn] 5f⁹ 7s²', meltingPoint: '986 °C', boilingPoint: 'unknown', density: '14.78 g/cm³', discoveredBy: 'Glenn T. Seaborg, Albert Ghiorso, Stanley G. Thompson, Kenneth Street Jr.', discoveryYear: 1949, description: 'Radioativo, elemento transurânico.' },
        { name: 'Califórnio', symbol: 'Cf', atomicNumber: 98, atomicMass: 251, category: 'Actinídeo', electronConfiguration: '[Rn] 5f¹⁰ 7s²', meltingPoint: '900 °C', boilingPoint: 'unknown', density: '15.1 g/cm³', discoveredBy: 'Glenn T. Seaborg, Stanley G. Thompson, Albert Ghiorso, Kenneth Street Jr.', discoveryYear: 1950, description: 'Radioativo, usado como fonte de nêutrons.' },
        { name: 'Einstênio', symbol: 'Es', atomicNumber: 99, atomicMass: 252, category: 'Actinídeo', electronConfiguration: '[Rn] 5f¹¹ 7s²', meltingPoint: '860 °C', boilingPoint: 'unknown', density: '8.84 g/cm³', discoveredBy: 'Albert Ghiorso et al.', discoveryYear: 1952, description: 'Radioativo, elemento transurânico.' },
        { name: 'Férmio', symbol: 'Fm', atomicNumber: 100, atomicMass: 257, category: 'Actinídeo', electronConfiguration: '[Rn] 5f¹² 7s²', meltingPoint: '1527 °C', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Albert Ghiorso et al.', discoveryYear: 1952, description: 'Radioativo, elemento transurânico.' },
        { name: 'Mendelévio', symbol: 'Md', atomicNumber: 101, atomicMass: 258, category: 'Actinídeo', electronConfiguration: '[Rn] 5f¹³ 7s²', meltingPoint: '827 °C', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Albert Ghiorso, Glenn T. Seaborg, Gregory R. Choppin, Bernard G. Harvey, Stanley G. Thompson', discoveryYear: 1955, description: 'Radioativo, elemento transurânico.' },
        { name: 'Nobélio', symbol: 'No', atomicNumber: 102, atomicMass: 259, category: 'Actinídeo', electronConfiguration: '[Rn] 5f¹⁴ 7s²', meltingPoint: '827 °C', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Joint Institute for Nuclear Research / Lawrence Berkeley National Laboratory', discoveryYear: 1966, description: 'Radioativo, elemento transurânico.' },
        { name: 'Laurêncio', symbol: 'Lr', atomicNumber: 103, atomicMass: 262, category: 'Actinídeo', electronConfiguration: '[Rn] 5f¹⁴ 7s² 7p¹', meltingPoint: '1627 °C', boilingPoint: 'unknown', density: 'unknown', discoveredBy: 'Albert Ghiorso, Torbjørn Sikkeland, Almon Larsh, Robert M. Latimer', discoveryYear: 1961, description: 'Radioativo, elemento transurânico.' }
    ];

    // Define as cores para cada categoria (deve corresponder ao CSS)
    const categoryColors = {
        'Metal Alcalino': '#ff9999',
        'Metal Alcalino Terroso': '#ffcc99',
        'Lantanídeo': '#ffc0cb',
        'Actinídeo': '#ffb3e6',
        'Metal de Transição': '#99ccff',
        'Metal Pós-Transição': '#99ffcc',
        'Metaloide': '#ffff99',
        'Não-metal': '#c2f0c2',
        'Halogênio': '#b3e6b3',
        'Gás Nobre': '#c2c2f0',
        'empty': 'transparent', // Para células vazias
        'Desconhecido': '#e0e0e0'
    };

    // --- Funções Auxiliares ---

    /**
     * Renders the periodic table grid based on the elementsData.
     */
    function renderPeriodicTable() {
        periodicTableGrid.innerHTML = ''; // Clear existing grid

        // Create a map for quick lookup of elements by atomic number
        const elementMap = new Map();
        elementsData.forEach(el => {
            if (el.atomicNumber > 0) { // Only add real elements to map
                elementMap.set(el.atomicNumber, el);
            }
        });

        // Loop through all 18 columns and 9 rows (including Lanthanides/Actinides rows)
        for (let r = 1; r <= 9; r++) {
            for (let c = 1; c <= 18; c++) {
                let element = null;
                let isPlaceholder = false;

                // Determine which element (if any) belongs in this grid position
                if (r === 1 && c === 1) element = elementMap.get(1); // H
                else if (r === 1 && c === 18) element = elementMap.get(2); // He
                else if (r === 2 && c === 1) element = elementMap.get(3); // Li
                else if (r === 2 && c === 2) element = elementMap.get(4); // Be
                else if (r === 2 && c >= 13 && c <= 18) element = elementMap.get(c - 8); // B to Ne
                else if (r === 3 && c === 1) element = elementMap.get(11); // Na
                else if (r === 3 && c === 2) element = elementMap.get(12); // Mg
                else if (r === 3 && c >= 13 && c <= 18) element = elementMap.get(c + 1); // Al to Ar
                else if (r === 4 && c >= 1 && c <= 18) element = elementMap.get(c + 18); // K to Kr
                else if (r === 5 && c >= 1 && c <= 18) element = elementMap.get(c + 36); // Rb to Xe
                else if (r === 6 && c === 1) element = elementMap.get(55); // Cs
                else if (r === 6 && c === 2) element = elementMap.get(56); // Ba
                else if (r === 6 && c === 3) { // Lanthanides placeholder
                    element = elementsData.find(el => el.category 
                        === 'Lantanídeo' && el.atomicNumber === 57); // Get La
                    isPlaceholder = true;
                }
                else if (r === 6 && c >= 4 && c <= 18) element = elementMap.get(c + 68); // Hf to Rn (adjusting for La-Lu jump)
                else if (r === 7 && c === 1) element = elementMap.get(87); // Fr
                else if (r === 7 && c === 2) element = elementMap.get(88); // Ra
                else if (r === 7 && c === 3) { // Actinides placeholder
                    element = elementsData.find(el => el.category 
                        === 'Actinídeo' && el.atomicNumber === 89); // Get Ac
                    isPlaceholder = true;
                }
                else if (r === 7 && c >= 4 && c <= 18) element = elementMap.get(c + 100); // Rf to Og (adjusting for Ac-Lr jump)
                
                // Lanthanides and Actinides block (rows 8 and 9)
                else if (r === 8 && c >= 3 && c <= 17) { // Lanthanides (La-Lu, 15 elements)
                    element = elementMap.get(c + 54); // Atomic numbers 57 to 71
                }
                else if (r === 9 && c >= 3 && c <= 17) { // Actinides (Ac-Lr, 15 elements)
                    element = elementMap.get(c + 86); // Atomic numbers 89 to 103
                }

                const cellDiv = document.createElement('div');
                cellDiv.classList.add('element-cell');

                if (element) {
    cellDiv.classList.add(`category-${element.category.toLowerCase().replace(/\s/g, '-')}`);
                    cellDiv.innerHTML = `
                        <span class="atomic-number">${element.atomicNumber}</span>
                        <span class="symbol">${element.symbol}</span>
                        <span class="name">${element.name}</span>
                    `;
                    // Store full element data in dataset for modal
                    cellDiv.dataset.elementData = JSON.stringify(element);
                    cellDiv.addEventListener('click', showElementDetail);
                } else {
                    cellDiv.classList.add('empty-cell');
                }

                // Handle special grid column spans for empty cells
                if (element && element.gridColumn) {
                    cellDiv.style.gridColumn = element.gridColumn;
                }
                 // Handle special grid row/column for Lanthanides/Actinides in their separate block
                 if (element && (element.category === 'Lantanídeo' 
      || element.category === 'Actinídeo') && element.gridRow && element.gridColumn) {
                    // These elements are handled by their specific gridRow/gridColumn in the data
                    // We only want to place them in the main table if they are the placeholder
                    // Otherwise, they go into the separate block
                    if (!isPlaceholder) { // If it's not the placeholder, it goes into the separate block
                        // This logic is simplified for the main grid rendering.
                        // The separate block for Lanthanides/Actinides would need its own rendering loop
                        // or a more complex grid setup. For this example, we'll just render them in order
                        // in the main grid and then add the separate block below.
                    }
                }
                periodicTableGrid.appendChild(cellDiv);
            }
        }
    }

    /**
     * Renders the category legend.
     */
    function renderCategoryLegend() {
        legendContainer.innerHTML = ''; // Clear existing legend

        // Get unique categories and sort them
        const categories = 
        [...new Set(elementsData.map(el => el.category))].filter
        (cat => cat && cat !== 'empty' && cat !== 'Lantanídeo' && cat !==
             'Actinídeo').sort();
        
        // Add Lanthanides and Actinides explicitly to the beginning of the legend
        categories.unshift('Actinídeo');
        categories.unshift('Lantanídeo');

        categories.forEach(category => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');

            const colorBox = document.createElement('div');
            colorBox.classList.add('legend-color-box');
            colorBox.style.backgroundColor = categoryColors[category] || '#e0e0e0'; // Default to gray if color not found

            const categoryName = document.createElement('span');
            categoryName.textContent = category;

            legendItem.appendChild(colorBox);
            legendItem.appendChild(categoryName);
            legendContainer.appendChild(legendItem);
        });
    }

    /**
     * Displays the element detail modal.
     * @param {Event} e - The click event.
     */
    function showElementDetail(e) {
        const elementData = JSON.parse(e.currentTarget.dataset.elementData);

        modalElementName.textContent = elementData.name;
        modalElementSymbol.textContent = elementData.symbol;
        modalElementAtomicNumber.textContent = elementData.atomicNumber;
        modalElementAtomicMass.textContent = elementData.atomicMass;
        modalElementCategory.textContent = elementData.category;
 modalElementElectronConfiguration.textContent = elementData.electronConfiguration || 'N/A';
        modalElementMeltingPoint.textContent = elementData.meltingPoint || 'N/A';
        modalElementBoilingPoint.textContent = elementData.boilingPoint || 'N/A';
        modalElementDensity.textContent = elementData.density || 'N/A';
        modalElementDiscoveredBy.textContent = elementData.discoveredBy || 'N/A';
        modalElementDiscoveryYear.textContent = elementData.discoveryYear || 'N/A';
        modalElementDescription.textContent = elementData.description || 'N/A';

        // Apply category color to modal title
        modalElementName.style.color = categoryColors[elementData.category] || '#007bff';

        elementDetailModal.style.display = 'flex'; // Show the modal
    }

    /**
     * Hides the element detail modal.
     */
    function hideElementDetail() {
        elementDetailModal.style.display = 'none';
    }

    // --- Event Listeners ---
    closeModalButton.addEventListener('click', hideElementDetail);

    // Close modal if clicked outside content
    elementDetailModal.addEventListener('click', (e) => {
        if (e.target === elementDetailModal) {
            hideElementDetail();
        }
    });

    // --- Initialization ---
    renderPeriodicTable();
    renderCategoryLegend();
});
