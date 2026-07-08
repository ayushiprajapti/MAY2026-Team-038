// Illustrative demo data standing in for the "approved heritage site
// database" described in the user stories. Coordinates are approximate —
// swap this file for a real API/DB call once the backend exists.

export const regions = ['Pune', 'Nashik', 'Kolhapur', 'Chhatrapati Sambhajinagar']

export const themes = [
  'Forts & Ramparts',
  'Wadas & Colonial Architecture',
  'Temples & Shrines',
  'Stepwells & Water Heritage',
]

// Simple line-icon key per site "type" — rendered as inline SVG so the
// experience never depends on external photography or licensed imagery.
export const trails = [
  {
    id: 'peshwa-pune-walk',
    name: 'Peshwa Pune Heritage Walk',
    region: 'Pune',
    theme: 'Wadas & Colonial Architecture',
    era: '18th century',
    distanceKm: 3.2,
    durationMin: 90,
    description:
      'A short walk through the old Peshwa quarter, tracing the residences and courts that once ran the Maratha capital.',
    sites: [
      {
        id: 'shaniwar-wada',
        name: 'Shaniwar Wada',
        type: 'fortified palace',
        icon: 'fort',
        lat: 18.519,
        lon: 73.856,
        built: '1732 CE',
        narration: {
          en: 'Shaniwar Wada was the seat of the Peshwa rulers, built in 1732. Its fire-scarred walls and stepped gateway still show the scale of the original palace complex.',
          hi: 'शनिवार वाडा 1732 में पेशवाओं की राजधानी के रूप में बना था। आग से झुलसी दीवारें आज भी महल की भव्यता दिखाती हैं।',
          mr: 'शनिवारवाडा हा 1732 साली बांधलेला पेशव्यांचा राजवाडा आहे. आगीत होरपळलेल्या भिंती आजही त्याची भव्यता दाखवतात.',
        },
      },
      {
        id: 'vishrambaug-wada',
        name: 'Vishrambaug Wada',
        type: 'townhouse',
        icon: 'wada',
        lat: 18.516,
        lon: 73.856,
        built: '1807 CE',
        narration: {
          en: 'Vishrambaug Wada shows off wood-carved balconies and an ornamental facade typical of the later Peshwa period.',
          hi: 'विश्रामबाग वाडा में लकड़ी की नक्काशीदार बालकनियाँ हैं, जो बाद के पेशवा काल की खासियत हैं।',
          mr: 'विश्रामबाग वाड्यात कोरीव लाकडी बाल्कनी आहेत, जी नंतरच्या पेशवेकाळाचे वैशिष्ट्य आहे.',
        },
      },
      {
        id: 'lal-mahal',
        name: 'Lal Mahal',
        type: 'reconstructed residence',
        icon: 'wada',
        lat: 18.517,
        lon: 73.856,
        built: 'Reconstructed, orig. 1630s CE',
        narration: {
          en: 'Lal Mahal is a modern reconstruction marking the childhood home associated with Shivaji Maharaj and Jijabai.',
          hi: 'लाल महल एक आधुनिक पुनर्निर्माण है, जो शिवाजी महाराज और जीजाबाई से जुड़े बचपन के घर का स्मरण कराता है।',
          mr: 'लाल महाल ही आधुनिक पुनर्रचना असून शिवाजी महाराज व जिजाबाई यांच्या बालपणाच्या घराचे स्मरण करते.',
        },
      },
    ],
  },
  {
    id: 'sahyadri-fort-trail',
    name: 'Sahyadri Fort Trail',
    region: 'Pune',
    theme: 'Forts & Ramparts',
    era: '17th century',
    distanceKm: 42,
    durationMin: 360,
    description:
      'A hill-fort circuit through the Sahyadri range, following the ridgelines Maratha garrisons once held.',
    sites: [
      {
        id: 'sinhagad',
        name: 'Sinhagad Fort',
        type: 'hill fort',
        icon: 'fort',
        lat: 18.366,
        lon: 73.755,
        built: 'pre-1600s CE',
        narration: {
          en: 'Sinhagad sits at over 1,300 metres and was the site of a decisive 1670 night battle led by Tanaji Malusare.',
          hi: 'सिंहगड 1300 मीटर से अधिक ऊँचाई पर है और 1670 में तानाजी मालुसरे के नेतृत्व में हुई रात्रि लड़ाई का स्थल है।',
          mr: 'सिंहगड 1300 मीटरपेक्षा उंच असून 1670 मधील तानाजी मालुसरे यांच्या नेतृत्वाखालील रात्रीच्या लढाईचे ठिकाण आहे.',
        },
      },
      {
        id: 'rajgad',
        name: 'Rajgad Fort',
        type: 'hill fort',
        icon: 'fort',
        lat: 18.251,
        lon: 73.703,
        built: '1600s CE',
        narration: {
          en: 'Rajgad served as the Maratha capital for over two decades before the court moved to Raigad.',
          hi: 'राजगढ़ दो दशकों से अधिक समय तक मराठा राजधानी रहा, इसके बाद राजधानी रायगढ़ स्थानांतरित हुई।',
          mr: 'राजगड दोन दशकांहून अधिक काळ मराठा राजधानी होती, नंतर राजधानी रायगडावर हलवण्यात आली.',
        },
      },
      {
        id: 'torna',
        name: 'Torna Fort',
        type: 'hill fort',
        icon: 'fort',
        lat: 18.278,
        lon: 73.661,
        built: '1643 CE (captured)',
        narration: {
          en: 'Torna was the first fort captured by Shivaji Maharaj in 1643, at the start of Maratha expansion.',
          hi: 'तोरणा 1643 में शिवाजी महाराज द्वारा जीता गया पहला किला था, मराठा विस्तार की शुरुआत में।',
          mr: 'तोरणा हा शिवाजी महाराजांनी 1643 मध्ये जिंकलेला पहिला किल्ला, मराठा विस्ताराची सुरुवात.',
        },
      },
    ],
  },
  {
    id: 'nashik-temple-trail',
    name: 'Nashik Temple Trail',
    region: 'Nashik',
    theme: 'Temples & Shrines',
    era: '18th–19th century',
    distanceKm: 5.4,
    durationMin: 120,
    description:
      'A riverside walk along the Godavari through Nashik\'s temple ghats, one of India\'s four Kumbh Mela sites.',
    sites: [
      {
        id: 'trimbakeshwar',
        name: 'Trimbakeshwar Temple',
        type: 'jyotirlinga shrine',
        icon: 'temple',
        lat: 19.933,
        lon: 73.529,
        built: '1755 CE',
        narration: {
          en: 'Trimbakeshwar houses one of the twelve jyotirlingas and sits near the source of the Godavari river.',
          hi: 'त्र्यंबकेश्वर बारह ज्योतिर्लिंगों में से एक है और गोदावरी नदी के उद्गम के निकट स्थित है।',
          mr: 'त्र्यंबकेश्वर हे बारा ज्योतिर्लिंगांपैकी एक असून गोदावरी नदीच्या उगमाजवळ आहे.',
        },
      },
      {
        id: 'kalaram',
        name: 'Kalaram Temple',
        type: 'temple',
        icon: 'temple',
        lat: 19.998,
        lon: 73.791,
        built: '1794 CE',
        narration: {
          en: 'Kalaram Temple is built entirely of black stone and was central to the 1930 temple-entry satyagraha.',
          hi: 'कालाराम मंदिर पूरी तरह काले पत्थर से बना है और 1930 के मंदिर-प्रवेश सत्याग्रह का केंद्र था।',
          mr: 'काळाराम मंदिर संपूर्णपणे काळ्या दगडात बांधलेले असून 1930 च्या मंदिर-प्रवेश सत्याग्रहाचे केंद्र होते.',
        },
      },
      {
        id: 'someshwar',
        name: 'Someshwar Temple',
        type: 'riverside temple',
        icon: 'temple',
        lat: 19.984,
        lon: 73.776,
        built: '18th century',
        narration: {
          en: 'Someshwar Temple sits on a quiet bend of the Godavari, a favoured spot for evening aarti.',
          hi: 'सोमेश्वर मंदिर गोदावरी के शांत मोड़ पर स्थित है, जो शाम की आरती के लिए प्रिय स्थान है।',
          mr: 'सोमेश्वर मंदिर गोदावरीच्या शांत वळणावर असून संध्याकाळच्या आरतीसाठी आवडते ठिकाण आहे.',
        },
      },
    ],
  },
  {
    id: 'kolhapur-water-trail',
    name: 'Kolhapur Water Heritage Trail',
    region: 'Kolhapur',
    theme: 'Stepwells & Water Heritage',
    era: '12th–19th century',
    distanceKm: 8.1,
    durationMin: 150,
    description:
      'A trail linking the stepped tanks, ghats and lake reservoirs that once supplied the old city of Kolhapur.',
    sites: [
      {
        id: 'rankala-ghat',
        name: 'Rankala Lake Ghat',
        type: 'stepped lake ghat',
        icon: 'stepwell',
        lat: 16.700,
        lon: 74.223,
        built: '1000s CE, rebuilt 1835',
        narration: {
          en: 'Rankala\'s stone ghats step down to a lake believed to trace back to an 11th-century reservoir.',
          hi: 'रांकाला के पत्थर के घाट झील की ओर उतरते हैं, जिसकी उत्पत्ति 11वीं सदी के जलाशय से मानी जाती है।',
          mr: 'रंकाळ्याचे दगडी घाट तलावाकडे उतरतात, ज्याचा उगम अकराव्या शतकातील जलाशयाशी जोडला जातो.',
        },
      },
      {
        id: 'kotitirtha',
        name: 'Kotitirtha Stepwell',
        type: 'stepwell',
        icon: 'stepwell',
        lat: 16.706,
        lon: 74.230,
        built: '12th century',
        narration: {
          en: 'Kotitirtha is a stepped tank once used for ritual bathing, its tiers cut directly into black basalt.',
          hi: 'कोटितीर्थ एक सीढ़ीदार जलाशय है जो पहले स्नान अनुष्ठान के लिए प्रयोग होता था, इसकी सीढ़ियाँ काले बेसाल्ट में खुदी हैं।',
          mr: 'कोटितीर्थ हा पायऱ्यांचा तलाव असून पूर्वी स्नानविधीसाठी वापरला जाई, त्याच्या पायऱ्या काळ्या बेसाल्टमध्ये कोरलेल्या आहेत.',
        },
      },
      {
        id: 'panhala-tank',
        name: 'Panhala Fort Tank',
        type: 'fort reservoir',
        icon: 'fort',
        lat: 16.807,
        lon: 74.108,
        built: '12th century, fort 1178 CE',
        narration: {
          en: 'Panhala\'s fort reservoirs kept a hill garrison supplied with water through long sieges.',
          hi: 'पन्हाला किले के जलाशय लंबे घेरों के दौरान पहाड़ी चौकी को पानी की आपूर्ति करते थे।',
          mr: 'पन्हाळा किल्ल्याचे जलाशय दीर्घ वेढ्यांदरम्यान डोंगरी ठाण्याला पाणीपुरवठा करत असत.',
        },
      },
    ],
  },
]

export function getTrailById(id) {
  return trails.find((t) => t.id === id)
}
